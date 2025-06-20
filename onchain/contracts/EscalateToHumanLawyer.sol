// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title EscalateToHumanLawyer
 * @dev Smart contract that uses Chainlink Functions to escalate cases to human lawyers
 * by calling the backend API endpoint
 */
contract EscalateToHumanLawyer is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions configuration
    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit;
    bytes32 public secretsReference;

    // API URL storage
    string public apiUrl;

    // Events
    event EscalationRequested(
        string caseId,
        address contractAddress,
        string signature,
        uint256 timestamp,
        string nonce,
        bytes32 requestId
    );
    
    event EscalationCompleted(
        bytes32 requestId,
        bytes response,
        bytes err
    );

    // Mapping to store request details
    mapping(bytes32 => EscalationRequest) public requests;

    struct EscalationRequest {
        string caseId;
        address contractAddress;
        string signature;
        uint256 timestamp;
        string nonce;
        bool completed;
    }

    /**
     * @dev Constructor to initialize the contract with Chainlink Functions configuration
     * @param _router The Chainlink Functions router address
     * @param _donId The DON ID for the Functions network
     * @param _subscriptionId The subscription ID for Chainlink Functions
     * @param _gasLimit The gas limit for function execution
     * @param _secretsReference The secrets reference for API keys
     * @param _apiUrl The initial API URL for the escalation endpoint
     */
    constructor(
        address _router,
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        bytes32 _secretsReference,
        string memory _apiUrl
    ) FunctionsClient(_router) ConfirmedOwner(msg.sender) {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        secretsReference = _secretsReference;
        apiUrl = _apiUrl;
    }

    /**
     * @dev Request escalation to human lawyer
     * @param _caseId The case identifier
     * @param _signature The signature for verification
     * @param _timestamp The timestamp of the request
     * @param _nonce The nonce for request uniqueness
     */
    function requestEscalation(
        string memory _caseId,
        string memory _signature,
        uint256 _timestamp,
        string memory _nonce
    ) external returns (bytes32 requestId) {
        // Create the request
        FunctionsRequest.Request memory req;
        
        // Build the JavaScript source code for the API call
        string memory source = string(abi.encodePacked(
            "const url = '", getApiUrl(), "';",
            "const caseId = args[0];",
            "const contractAddress = args[1];",
            "const signature = args[2];",
            "const timestamp = parseInt(args[3]);",
            "const nonce = args[4];",
            "",
            "const requestBody = {",
            "  caseId: caseId,",
            "  contractAddress: contractAddress,",
            "  signature: signature,",
            "  timestamp: timestamp,",
            "  nonce: nonce",
            "};",
            "",
            "const response = await Functions.makeHttpRequest({",
            "  url: url,",
            "  method: 'POST',",
            "  headers: {",
            "    'Content-Type': 'application/json'",
            "  },",
            "  data: requestBody",
            "});",
            "",
            "if (response.error) {",
            "  throw Error('Request failed: ' + response.error);",
            "}",
            "",
            "return Functions.encodeString(JSON.stringify(response.data));"
        ));

        req.initializeRequestForInlineJavaScript(source);
        req.addSecretsReference(abi.encodePacked(secretsReference));
        
        string[] memory args = new string[](5);
        args[0] = _caseId;
        args[1] = addressToString(msg.sender);
        args[2] = _signature; // This will be ignored, we generate the correct one
        args[3] = uintToString(_timestamp);
        args[4] = _nonce;
        req.setArgs(args);

        // Send the request
        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);

        // Store the request details
        requests[requestId] = EscalationRequest({
            caseId: _caseId,
            contractAddress: msg.sender,
            signature: _signature,
            timestamp: _timestamp,
            nonce: _nonce,
            completed: false
        });

        emit EscalationRequested(
            _caseId,
            msg.sender,
            _signature,
            _timestamp,
            _nonce,
            requestId
        );
    }

    /**
     * @dev Callback function that receives the response from Chainlink Functions
     * @param requestId The ID of the request
     * @param response The response from the API
     * @param err Any error that occurred
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (requests[requestId].completed) {
            revert("Request already fulfilled");
        }

        requests[requestId].completed = true;

        emit EscalationCompleted(requestId, response, err);
    }

    /**
     * @dev Get the API URL for the escalation endpoint
     * @return The API URL
     */
    function getApiUrl() internal view returns (string memory) {
        return apiUrl;
    }

    /**
     * @dev Convert address to string
     * @param addr The address to convert
     * @return The address as a string
     */
    function addressToString(address addr) internal pure returns (string memory) {
        return string(abi.encodePacked(addr));
    }

    /**
     * @dev Convert uint to string
     * @param value The uint to convert
     * @return The uint as a string
     */
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }

        return string(buffer);
    }

    /**
     * @dev Update the API URL (only owner)
     * @param newUrl The new API URL
     */
    function updateApiUrl(string memory newUrl) external onlyOwner {
        require(bytes(newUrl).length > 0, "API URL cannot be empty");
        apiUrl = newUrl;
    }

    /**
     * @dev Update Chainlink Functions configuration (only owner)
     * @param _donId The new DON ID
     * @param _subscriptionId The new subscription ID
     * @param _gasLimit The new gas limit
     * @param _secretsReference The new secrets reference
     */
    function updateConfig(
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        bytes32 _secretsReference
    ) external onlyOwner {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        secretsReference = _secretsReference;
    }

    /**
     * @dev Get request details by request ID
     * @param requestId The request ID
     * @return The escalation request details
     */
    function getRequest(bytes32 requestId) external view returns (EscalationRequest memory) {
        return requests[requestId];
    }
}
