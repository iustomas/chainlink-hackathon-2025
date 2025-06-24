// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Chainlink functions imports
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

// Chainlink VRF imports
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";

// OpenZeppelin imports
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ConsumerSimpleWithVRF6
 * @notice Combines Chainlink VRF v2.5 and Chainlink Functions:
 *         – Every user call to `execute()` requests 1 random word from VRF.
 *         – Only if randomWord % 5 == 0 (≈20 % of the time) we forward the call
 *           to your backend via Functions; the rest are skipped.
 */
contract ConsumerSimpleWithVRF6 is
    FunctionsClient,
    VRFConsumerBaseV2Plus
{
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;

    /* ─────────────────────────────────────────────
       Chainlink Functions configuration
    ───────────────────────────────────────────── */
    bytes32 public donId;               // DON identifier
    uint64  public functionsSubId;      // Subscription ID for Functions
    uint32  public functionsGasLimit;   // Callback gas limit for Functions

    /* ─────────────────────────────────────────────
       Chainlink VRF configuration
    ───────────────────────────────────────────── */
    IVRFCoordinatorV2Plus private COORDINATOR;
    bytes32 public keyHash;             // VRF keyHash for your network
    uint256 public vrfSubId;            // Subscription ID for VRF
    uint16  public requestConfirmations = 3;
    uint32  public vrfCallbackGasLimit  = 1_000_000;

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

    mapping(uint256 => PendingCall) public pending;   // VRF requestId → data
    bytes32 public lastFunctionsRequestId;
    string  public lastResponse;

    /* ─────────────────────────────────────────────
       Events
    ───────────────────────────────────────────── */
    event RequestQueued(uint256 indexed vrfRequestId, address indexed caller);
    event VRFReceived(uint256 indexed vrfRequestId, uint256 randomWord);
    event SkippedRequest(uint256 indexed vrfRequestId, uint256 randomWord);
    event ExecutedRequest(uint256 indexed vrfRequestId, bytes32 functionsReqId);

    /* ─────────────────────────────────────────────
       Constructor
    ───────────────────────────────────────────── */
    constructor(
        address functionsRouter,        // FunctionsRouter (network-specific)
        bytes32 _donId,                 // DON ID (network-specific)
        uint64  _functionsSubId,        // Existing Functions subscription
        uint32  _functionsGasLimit,     // Gas for fulfillRequest()
        address vrfCoordinator,         // VRF coordinator address
        bytes32 _keyHash,               // VRF keyHash
        uint256 _vrfSubId,              // Existing VRF subscription
        uint8   _secretsSlot,           // Secrets slot in DON
        uint64  _secretsVersion         // Secrets version in DON
    )
        FunctionsClient(functionsRouter)
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
        // Functions config
        donId             = _donId;
        functionsSubId    = _functionsSubId;
        functionsGasLimit = _functionsGasLimit;

        // VRF config
        COORDINATOR       = IVRFCoordinatorV2Plus(vrfCoordinator);
        keyHash           = _keyHash;
        vrfSubId          = _vrfSubId;

        // Secrets
        secretsSlot       = _secretsSlot;
        secretsVersion    = _secretsVersion;
    }

    /* ─────────────────────────────────────────────
       1️⃣  User-facing entrypoint
    ───────────────────────────────────────────── */
    function execute() external {
        VRFV2PlusClient.RandomWordsRequest memory vrfReq = VRFV2PlusClient.RandomWordsRequest({
            keyHash:               keyHash,
            subId:                 vrfSubId,
            requestConfirmations:  requestConfirmations,
            callbackGasLimit:      vrfCallbackGasLimit,
            numWords:              1,
            extraArgs: VRFV2PlusClient._argsToBytes(
                VRFV2PlusClient.ExtraArgsV1({ nativePayment: true }) 
            )
        });

        uint256 vrfRequestId = COORDINATOR.requestRandomWords(vrfReq);

        pending[vrfRequestId] = PendingCall({
            caller:    msg.sender,
            timestamp: block.timestamp
        });

        emit RequestQueued(vrfRequestId, msg.sender);
    }

    /* ─────────────────────────────────────────────
       2️⃣  VRF callback
    ───────────────────────────────────────────── */
    function fulfillRandomWords(
        uint256 vrfRequestId,
        uint256[] calldata randomWords
    )
        internal
        override
    {
        PendingCall memory data = pending[vrfRequestId];
        delete pending[vrfRequestId];              // clean up storage

        uint256 rand = randomWords[0];
        
        // Emit event for debugging
        emit VRFReceived(vrfRequestId, rand);

        // 4 out of 5 chance (80% probability) - changed from 1 out of 5
        if (rand % 5 == 0) {
            emit SkippedRequest(vrfRequestId, rand);
            return;
        }

        /* ───────── Build the Functions request ───────── */
        FunctionsRequest.Request memory req;

        string memory source = string(
            abi.encodePacked(
                "const response = await Functions.makeHttpRequest({",
                "  url: 'https://tomas-web3-api-ex5ksmcdeq-uc.a.run.app/tomas/escalate-to-human-lawyer',",
                "  method: 'POST',",
                "  timeout: 10000,",
                "  headers: { 'chainlink-functions-secret': secrets.chainlinkSecret },",
                "  data: {",
                "    caseId: args[0],",
                "    contractAddress: args[1],",
                "    timestamp: args[2],",
                "    randomWord: args[3],", // Add random word for debugging
                "  },",
                "});",
                "if (response.error) { throw Error(JSON.stringify(response)); }",
                "return Functions.encodeString(JSON.stringify(response.data));"
            )
        );

        req.initializeRequestForInlineJavaScript(source);

        string[] memory args = new string[](4); // Changed from 3 to 4
        args[0] = toAsciiString(data.caller);
        args[1] = toAsciiString(address(this));
        args[2] = data.timestamp.toString();
        args[3] = rand.toString(); // Add random word for debugging
        req.setArgs(args);

        req.addDONHostedSecrets(secretsSlot, secretsVersion);

        bytes32 functionsReqId = _sendRequest(
            req.encodeCBOR(),
            functionsSubId,
            functionsGasLimit,
            donId
        );

        lastFunctionsRequestId = functionsReqId;

        emit ExecutedRequest(vrfRequestId, functionsReqId);
    }

    /* ─────────────────────────────────────────────
       Chainlink Functions callback
    ───────────────────────────────────────────── */
    function fulfillRequest(
        bytes32 /* requestId */,
        bytes memory response,
        bytes memory /* err */
    )
        internal
        override
    {
        lastResponse = string(response);
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
       Admin helpers (optional, add access control)
    ───────────────────────────────────────────── */
    function updateSecretsSlot(uint8 newSlot) external {
        secretsSlot = newSlot;
    }
    
    function updateSecretsVersion(uint64 newVersion) external {
        secretsVersion = newVersion;
    }
}
