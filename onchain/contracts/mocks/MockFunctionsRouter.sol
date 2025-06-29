// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/interfaces/IFunctionsRouter.sol";
// import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/interfaces/IFunctionsClient.sol";
// import "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsResponse.sol";

// /**
//  * @title MockFunctionsRouter
//  * @dev Mock implementation of Chainlink Functions Router for testing purposes
//  */
// contract MockFunctionsRouter is IFunctionsRouter {
//     // Mapping to store request IDs for testing
//     mapping(bytes32 => bool) public requestIds;
//     uint256 private requestCounter = 0;
    
//     // Mock state variables
//     bytes32 public allowListId;
//     uint72 public adminFee = 0;

//     // Guarda la dirección del cliente para cada requestId
//     mapping(bytes32 => address) public requestClients;

//     // Events
//     event MockRequestSent(
//         bytes32 indexed requestId,
//         address indexed sender,
//         bytes data,
//         uint64 subscriptionId,
//         uint16 dataVersion,
//         uint32 callbackGasLimit,
//         bytes32 donId
//     );

//     /**
//      * @dev Mock implementation of sendRequest
//      * @param subscriptionId The subscription ID
//      * @param data The encoded request data
//      * @param dataVersion The data version
//      * @param callbackGasLimit The gas limit for the callback
//      * @param donId The DON ID
//      * @return requestId A mock request ID
//      */
//     function sendRequest(
//         uint64 subscriptionId,
//         bytes calldata data,
//         uint16 dataVersion,
//         uint32 callbackGasLimit,
//         bytes32 donId
//     ) public returns (bytes32 requestId) {
//         // Generate a mock request ID
//         requestId = keccak256(abi.encodePacked(
//             block.timestamp,
//             msg.sender,
//             requestCounter++
//         ));
        
//         // Store the request ID for testing purposes
//         requestIds[requestId] = true;
//         // Guarda la dirección del cliente
//         requestClients[requestId] = msg.sender;

//         // Emit event for testing
//         emit MockRequestSent(
//             requestId,
//             msg.sender,
//             data,
//             subscriptionId,
//             dataVersion,
//             callbackGasLimit,
//             donId
//         );

//         return requestId;
//     }

//     /**
//      * @dev Mock implementation of sendRequestToProposed
//      * @param subscriptionId The subscription ID
//      * @param data The encoded request data
//      * @param dataVersion The data version
//      * @param callbackGasLimit The gas limit for the callback
//      * @param donId The DON ID
//      * @return requestId A mock request ID
//      */
//     function sendRequestToProposed(
//         uint64 subscriptionId,
//         bytes calldata data,
//         uint16 dataVersion,
//         uint32 callbackGasLimit,
//         bytes32 donId
//     ) external returns (bytes32 requestId) {
//         return sendRequest(subscriptionId, data, dataVersion, callbackGasLimit, donId);
//     }

//     /**
//      * @dev Mock function to simulate fulfillment
//      * @param requestId The request ID to fulfill
//      * @param response The mock response data
//      * @param err Any error data
//      */
//     function mockFulfillRequest(
//         bytes32 requestId,
//         bytes memory response,
//         bytes memory err
//     ) external {
//         require(requestIds[requestId], "Request ID does not exist");
//         address clientAddr = requestClients[requestId];
//         require(clientAddr != address(0), "Client address not found");
//         IFunctionsClient client = IFunctionsClient(clientAddr);
//         client.handleOracleFulfillment(requestId, response, err);
//     }

//     /**
//      * @dev Check if a request ID exists
//      * @param requestId The request ID to check
//      * @return True if the request ID exists
//      */
//     function hasRequestId(bytes32 requestId) external view returns (bool) {
//         return requestIds[requestId];
//     }

//     /**
//      * @dev Get the total number of requests made
//      * @return The request counter
//      */
//     function getRequestCounter() external view returns (uint256) {
//         return requestCounter;
//     }

//     // Implementation of IFunctionsRouter interface functions
    
//     function getAllowListId() external view returns (bytes32) {
//         return allowListId;
//     }

//     function setAllowListId(bytes32 _allowListId) external {
//         allowListId = _allowListId;
//     }

//     function getAdminFee() external view returns (uint72) {
//         return adminFee;
//     }

//     function fulfill(
//         bytes memory response,
//         bytes memory err,
//         uint96 juelsPerGas,
//         uint96 costWithoutFulfillment,
//         address transmitter,
//         FunctionsResponse.Commitment memory commitment
//     ) external returns (FunctionsResponse.FulfillResult, uint96) {
//         // Mock implementation - return success
//         return (FunctionsResponse.FulfillResult.FULFILLED, 0);
//     }

//     function isValidCallbackGasLimit(uint64 subscriptionId, uint32 callbackGasLimit) external view {
//         // Mock implementation - always valid
//     }

//     function getContractById(bytes32 id) external pure returns (address) {
//         return address(0);
//     }

//     function getProposedContractById(bytes32 id) external pure returns (address) {
//         return address(0);
//     }

//     function getProposedContractSet() external pure returns (bytes32[] memory, address[] memory) {
//         return (new bytes32[](0), new address[](0));
//     }

//     function proposeContractsUpdate(bytes32[] memory proposalSetIds, address[] memory proposalSetAddresses) external {
//         // Mock implementation - do nothing
//     }

//     function updateContracts() external {
//         // Mock implementation - do nothing
//     }

//     function pause() external {
//         // Mock implementation - do nothing
//     }

//     function unpause() external {
//         // Mock implementation - do nothing
//     }
// } 