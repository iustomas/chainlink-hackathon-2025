// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/* ══════════════════════════════════════════
   ░░  External deps
   ══════════════════════════════════════════ */
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";  
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";

/* ══════════════════════════════════════════
   ░░  Minimal interface to TomasSubscription
   ══════════════════════════════════════════ */
interface ITomasSubscription {
    function hasActiveSubscription(address user) external view returns (bool);
}

/**
* @title TomasProposal
* @author Cristian Valdivia
*
* @notice
* Handles one-off legal-service proposals:
* 1. The contract owner quotes each user in USD.
* 2. The user either pays the USD-equivalent in native ETH **or** bypasses
*    payment if an active subscription exists in `TomasSubscription`.
*
* @dev
* ────────────────────────────────────────────────────────────────
* Core flow
* ────────────────────────────────────────────────────────────────
* • Price conversion  : On-chain via the Chainlink ETH/USD price feed (8 decimals). 
* • Payment collection : If `hasActiveSubscription(user) == false`, the contract
*                        calculates the ETH-denominated amount and forwards it
*                        to the `owner()`, refunding any excess. 
* • Audit lottery     : After every successful payment (or free pass), the
*                        contract requests 1 random word from Chainlink VRF
*                        v2.5. Roughly 1 in 5 executions trigger an off-chain
*                        “human-in-the-loop” audit by calling a backend endpoint
*                        through Chainlink Functions, authenticated with
*                        DON-hosted secrets.
*
*/
contract TomasPayProposal is
    ReentrancyGuard,
    FunctionsClient,
    VRFConsumerBaseV2Plus
{
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings           for uint256;
    using Strings           for address;

    /* ─────────────────────────────────────────────
       Basic config
    ───────────────────────────────────────────── */
    AggregatorV3Interface public immutable priceFeed;   // ETH/USD (8 dec)
    ITomasSubscription    public immutable subs;        // Subscription contract

    mapping(address => uint256) public proposalPriceUSD;    // user → USD (8 dec)

    /* ─────────────────────────────────────────────
       Chainlink VRF config
    ───────────────────────────────────────────── */
    IVRFCoordinatorV2Plus private immutable COORD;
    bytes32 public immutable keyHash;
    uint256 public immutable vrfSubId;

    uint16 public constant VRF_CONFIRMATIONS = 3;
    uint32 public vrfCallbackGasLimit = 1_000_000;


    /* ─────────────────────────────────────────────
       Chainlink Functions config
    ───────────────────────────────────────────── */
    bytes32 public donId;
    uint64  public functionsSubId;
    uint32  public functionsGasLimit;

    /* ─────────────────────────────────────────────
       DON-hosted Secrets
    ───────────────────────────────────────────── */
    uint8  public secretsSlot;
    uint64 public secretsVersion;

    /* ─────────────────────────────────────────────
       State
    ───────────────────────────────────────────── */
    struct PendingCall {
        address caller;
        uint256 timestamp;
    }

    mapping(uint256 => PendingCall) private pending;   // vrfReqId → caller
    bytes32 public lastFunctionsRequestId;
    string  public lastResponse;

    /* ─────────────────────────────────────────────
       Events
    ───────────────────────────────────────────── */
    event ProposalPriceSet(address indexed user, uint256 usdPriceE8);
    event ProposalPaid    (address indexed user, uint256 usdPriceE8, uint256 ethWei);
    event RequestQueued(uint256 indexed vrfRequestId, address indexed caller);
    event VRFReceived(uint256 indexed vrfRequestId, uint256 randomWord);
    event SkippedRequest(uint256 indexed vrfRequestId, uint256 randomWord);
    event FunctionsRequest(uint256 indexed vrfRequestId, bytes32 functionsReqId);

    constructor(
        /* owner */
        address _owner,
        
        /* oracle & subs */
        address _priceFeed,
        address _subscriptionContract,

        /* VRF */
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _vrfSubId,

        /* Functions */
        address _functionsRouter,
        bytes32 _donId,
        uint64  _functionsSubId,
        uint32  _functionsGasLimit,
        uint8   _secretsSlot,
        uint64  _secretsVersion
    )
        FunctionsClient(_functionsRouter)
        VRFConsumerBaseV2Plus(_vrfCoordinator)
    {
        // Transfer ownership to the specified owner
        transferOwnership(_owner);
        
        priceFeed = AggregatorV3Interface(_priceFeed);
        subs      = ITomasSubscription(_subscriptionContract);

        /* VRF */
        COORD    = IVRFCoordinatorV2Plus(_vrfCoordinator);
        keyHash  = _keyHash;
        vrfSubId = _vrfSubId;

        /* Functions */
        donId             = _donId;
        functionsSubId    = _functionsSubId;
        functionsGasLimit = _functionsGasLimit;

        secretsSlot    = _secretsSlot;
        secretsVersion = _secretsVersion;
    }

    function setProposalPriceForUser(address user, uint256 usdPriceE8)
        external
        onlyOwner
    {
        require(usdPriceE8 > 0, "price = 0");
        proposalPriceUSD[user] = usdPriceE8;
        emit ProposalPriceSet(user, usdPriceE8);
    }

    function payProposal() external payable nonReentrant {
        uint256 usdPriceE8 = proposalPriceUSD[msg.sender];
        require(usdPriceE8 > 0, "no proposal pending");
        
        if (!subs.hasActiveSubscription(msg.sender)) {
            uint256 ethUsdE8 = _latestPrice();                
            uint256 priceWei = (usdPriceE8 * 1e18) / ethUsdE8; 
            require(msg.value >= priceWei, "insufficient ETH");
            
            (bool sent, ) = owner().call{value: priceWei}("");
            require(sent, "transfer failed");
            
            if (msg.value > priceWei) {
                (bool refund, ) = msg.sender.call{value: msg.value - priceWei}("");
                require(refund, "refund failed");
            }
            emit ProposalPaid(msg.sender, usdPriceE8, priceWei);
        } else {
            emit ProposalPaid(msg.sender, usdPriceE8, 0);
        }
        
        delete proposalPriceUSD[msg.sender];
    
        _requestRandomAudit(msg.sender);
    }

    function _requestRandomAudit(address caller) internal {
        VRFV2PlusClient.RandomWordsRequest memory req =
            VRFV2PlusClient.RandomWordsRequest({
                keyHash:              keyHash,
                subId:                vrfSubId,
                requestConfirmations: VRF_CONFIRMATIONS,
                callbackGasLimit:     vrfCallbackGasLimit,
                numWords:             1,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({ nativePayment: true })
                )   
            });

        uint256 vrfReqId = COORD.requestRandomWords(req);
        pending[vrfReqId] = PendingCall({ caller: caller, timestamp: block.timestamp });

        emit RequestQueued(vrfReqId, caller);
    }

    /* ─────────────────────────────────────────────
       VRF callback – Audit lottery 1/5
    ───────────────────────────────────────────── */
    function fulfillRandomWords(uint256 vrfReqId, uint256[] calldata words)
        internal
        override
    {
        PendingCall memory data = pending[vrfReqId];
        delete pending[vrfReqId];

        uint256 rand = words[0];

        emit VRFReceived(vrfReqId, rand);

        if (rand % 5 == 0) {
            emit SkippedRequest(vrfReqId, rand);
            return;
        }  

        /* --- Build & send Functions request --- */
        FunctionsRequest.Request memory fReq;

        string memory source = string(
            abi.encodePacked(
                "const res = await Functions.makeHttpRequest({",
                "  url: 'https://tomas-web3-api-ex5ksmcdeq-uc.a.run.app/tomas/scriptum',",
                "  method: 'POST',",
                "  timeout: 10000,",
                "  headers: { 'chainlink-functions-secret': secrets.chainlinkSecret },",
                "  data: {",
                "    userAddress: args[0],",
                "    contractAddress: args[1],",
                "    timestamp: args[2],",
                "    escalateToHuman: true",
                "  },",
                "});",
                "if (res.error) throw Error(JSON.stringify(res));",
                "return Functions.encodeString(JSON.stringify(res.data));"
            )
        );

        fReq.initializeRequestForInlineJavaScript(source);

        string[] memory args = new string[](4); 

        args[0] = toAsciiString(data.caller);
        args[1] = toAsciiString(address(this));
        args[2] = data.timestamp.toString();        
        fReq.setArgs(args);

        fReq.addDONHostedSecrets(secretsSlot, secretsVersion);

        lastFunctionsRequestId = _sendRequest(
            fReq.encodeCBOR(),
            functionsSubId,
            functionsGasLimit,
            donId
        );

        emit FunctionsRequest(vrfReqId, lastFunctionsRequestId);
    }

    /* ─────────────────────────────────────────────
       5️⃣  Functions callback
    ───────────────────────────────────────────── */
    function fulfillRequest(
        bytes32,          /* requestId */
        bytes memory data,
        bytes memory      /* err */
    )
        internal
        override
    {
        lastResponse = string(data);  
    }

    /* ─────────────────────────────────────────────
       Utilities
    ───────────────────────────────────────────── */
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = "0";
        s[1] = "x";
        for (uint i = 0; i < 20; i++) {
            bytes1 b =
                bytes1(uint8(uint(uint160(x)) / (2**(8 * (19 - i)))));
            uint8 hi = uint8(b) / 16;
            uint8 lo = uint8(b) - 16 * hi;
            s[2 * i + 2] = _char(hi);
            s[2 * i + 3] = _char(lo);
        }
        return string(s);
    }
    function _char(uint8 b) private pure returns (bytes1 c) {
        return b < 10 ? bytes1(b + 0x30) : bytes1(b + 0x57);
    }

    /* ─────────────────────────────────────────────
       Utils
    ───────────────────────────────────────────── */
    function _latestPrice() internal view returns (uint256) {
        (, int256 answer,,,) = priceFeed.latestRoundData();
        require(answer > 0, "invalid oracle price");
        return uint256(answer);
    }

    /* ─────────────────────────────────────────────
       Admin tweaks
    ───────────────────────────────────────────── */
    function updateGasLimits(uint32 newVRFGas, uint32 newFuncGas) external onlyOwner {
        vrfCallbackGasLimit = newVRFGas;
        functionsGasLimit   = newFuncGas;
    }

    function updateSecrets(uint8 newSlot, uint64 newVersion) external onlyOwner {
        secretsSlot    = newSlot;
        secretsVersion = newVersion;
    }
}
