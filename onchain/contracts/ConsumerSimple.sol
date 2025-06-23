// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract ConsumerSimple is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions configuration
    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit;

    bytes32 public lastId;
    string  public lastResponse;   

    constructor(
        address router,
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit
    ) FunctionsClient(router) {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
    }

    function execute(string calldata source) external {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(string(source));
        lastId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);  
    }
    
    function fulfillRequest(bytes32, bytes memory resp, bytes memory) internal override {
        lastResponse = string(resp);
    }
}
