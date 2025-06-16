// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IntakePayment
 * @author Cristian Valdivia
 * @notice Contract for handling intake payments in ETH for Tomas web3 legal agent
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract IntakePayment is Ownable {
    // Chainlink Price Feed for ETH/USD
    AggregatorV3Interface private priceFeed;
    
    // Cost price in USD for the intake 
    uint256 public constant INTAKE_COST_USD = 0.1 * 1e8; // $0.1 USD
    
    // Maximum allowed price in USD
    uint256 public constant MAX_PRICE_USD = 10000 * 1e18; // $10,000 USD
    
    // Mapping to track who has paid
    mapping(address => bool) public hasPaid;
    
    // Events
    event PaymentReceived(address indexed user, uint256 amountETH);
    event PaymentRevoked(address indexed user);
    
    constructor(address _priceFeed) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }
    
    /**
     * @notice Get the latest ETH/USD price from Chainlink
     * @return The latest price with 8 decimals
     */
    function getLatestPrice() public view returns (uint256) {
        (, int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price);
    }
    
    /**
     * @notice Calculate the required ETH amount based on USD price
     * @return The amount of ETH required with 18 decimals
     */
    function getRequiredETHAmount() public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        require(ethPrice > 0, "Invalid price feed");
        // Multiply by 1e18 to maintain precision and then divide by ethPrice
        return (INTAKE_COST_USD * 1e18) / ethPrice;
    }
    
    /**
     * @notice Pay for the intake service
     */
    function payForIntake() external payable {
        require(!hasPaid[msg.sender], "Already paid");
        require(msg.value >= getRequiredETHAmount(), "Insufficient payment");
        
        hasPaid[msg.sender] = true;
        emit PaymentReceived(msg.sender, msg.value);
        
        // Refund excess ETH if any
        if (msg.value > getRequiredETHAmount()) {
            payable(msg.sender).transfer(msg.value - getRequiredETHAmount());
        }
    }
    
    /**
     * @notice Withdraw collected ETH
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }    

    /**
     * @notice Get payment details including USD price and ETH amount
     * @return usdPrice The price in USD
     * @return ethAmount The required amount in ETH
     * @return contractAddress The address of this contract
     */
    function getPaymentDetails() external view returns (
        uint256 usdPrice,
        uint256 ethAmount,
        address contractAddress
    ) {
        return (
            INTAKE_COST_USD,
            getRequiredETHAmount(),
            address(this)
        );
    }
} 