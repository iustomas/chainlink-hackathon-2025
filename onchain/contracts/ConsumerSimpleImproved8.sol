// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ConsumerSimpleImproved8 is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;

    // Chainlink Functions configuration
    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit;
    
    // Secrets configuration
    uint8 public secretsSlot;
    uint64 public secretsVersion;

    bytes32 public lastId;
    string  public lastResponse;   

    constructor(
        address router,
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        uint8 _secretsSlot,
        uint64 _secretsVersion
    ) FunctionsClient(router) {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        secretsSlot = _secretsSlot;
        secretsVersion = _secretsVersion;
    }

    function execute() external {
        FunctionsRequest.Request memory req;
        
        string memory source = string(
            abi.encodePacked(                
                "const response = await Functions.makeHttpRequest({\n"
                "  url: 'https://tomas-web3-api-ex5ksmcdeq-uc.a.run.app/tomas/escalate-to-human-lawyer',\n"
                "  method: 'POST',\n"
                "  timeout: 10000,\n"
                "  headers: { 'chainlink-functions-secret': secrets.chainlinkSecret },\n"
                "  data: {\n"
                "    caseId: args[0],\n"
                "    contractAddress: args[1],\n"
                "    timestamp: args[2],\n"
                "  },\n"
                "});\n"
                "if (response.error) { throw Error(JSON.stringify(response)); }\n"
                "return Functions.encodeString(JSON.stringify(response.data));"
            )
        );

        req.initializeRequestForInlineJavaScript(source);
        
        string[] memory args = new string[](3);
        args[0] = toAsciiString(msg.sender);
        args[1] = toAsciiString(address(this)); 
        args[2] = block.timestamp.toString(); 
        req.setArgs(args);
        
        req.addDONHostedSecrets(secretsSlot, secretsVersion);

        lastId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);
    }

    // Function to update secrets version (useful when you upload new secrets)
    function updateSecretsVersion(uint64 _newVersion) external {
        secretsVersion = _newVersion;
    }

    // Function to update secrets slot (useful if you want to use a different slot)
    function updateSecretsSlot(uint8 _newSlot) external {
        secretsSlot = _newSlot;
    }

    // Helper function to convert address to string (ascii hex)
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = '0';
        s[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            uint8 hi = uint8(b) / 16;
            uint8 lo = uint8(b) - 16 * hi;
            s[2*i + 2] = char(hi);
            s[2*i + 3] = char(lo);
        }
        return string(s);
    }
    function char(uint8 b) internal pure returns (bytes1 c) {
        if (b < 10) return bytes1(b + 0x30);
        else return bytes1(b + 0x57);
    }
    
    function fulfillRequest(bytes32, bytes memory resp, bytes memory) internal override {
        lastResponse = string(resp);
    }
}
