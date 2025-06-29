// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Chainlink Price Feed imports
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// Chainlink Automation imports (for monthly billing)
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// OpenZeppelin imports
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TomasSubscription
 * @author Cristian Valdivia
 * @notice Contract for handling monthly subscriptions in WETH for Tomas web3 legal agent
 * @dev Uses Chainlink Automations for monthly billing (every 30 days), Chainlink Price Feeds for ETH/USD conversion, and WETH for automatic payments
 */

contract TomasSubscription is Ownable, AutomationCompatibleInterface, ReentrancyGuard {
    // Chainlink Price Feed for ETH/USD
    AggregatorV3Interface private priceFeed;
    
    // WETH token contract
    IERC20 public immutable wethToken;
    
    // Subscription cost in USD (with 8 decimals) - every 30 days
    uint256 public constant SUBSCRIPTION_COST_USD = 100 * 1e8; // $100 USD
    
    // Maximum allowed price in USD for safety
    uint256 public constant MAX_PRICE_USD = 10000 * 1e8; // $10,000 USD
    
    // Billing cycle in seconds (30 days)
    uint256 public constant BILLING_CYCLE = 30 days;
    
    // Grace period before subscription expires (3 days)
    uint256 public constant GRACE_PERIOD = 3 days;
    
    // Price feed staleness threshold (1 hour)
    uint256 public constant PRICE_STALENESS_THRESHOLD = 3600; 
    
    // Subscription tracking
    struct Subscription {
        uint256 lastPaymentTimestamp;  // When last payment was made
        uint256 nextBillingTimestamp;  // When next payment is due
        bool isActive;
        uint256 lastPaymentAmount;     // Amount paid in last transaction
        bool hasWETHApproval;          // Whether user has approved WETH spending
    }
    
    // Mapping to track user subscriptions
    mapping(address => Subscription) public subscriptions;
    
    // Array to track all active users for automation processing
    address[] public activeUsers;
    mapping(address => uint256) public userIndex; // Index in activeUsers array
    mapping(address => bool) public isUserTracked; // Whether user is in the array
    
    // Whitelist for users who don't need to pay
    mapping(address => bool) public whitelist;
    
    // Events
    event SubscriptionPaid(address indexed user, uint256 amountWETH, uint256 nextBilling);
    event SubscriptionExpired(address indexed user, uint256 timestamp);
    event SubscriptionCanceled(address indexed user, uint256 timestamp);
    event UserWhitelisted(address indexed user, bool isWhitelisted);
    event AutomationTriggered(uint256 timestamp, uint256 usersProcessed);
    event WETHApprovalUpdated(address indexed user, bool approved);
    event AutomaticPaymentFailed(address indexed user, string reason);
    event UserAddedToTracking(address indexed user);
    event UserRemovedFromTracking(address indexed user);
    
    // Automation variables
    uint256 public lastAutomationTime;
    uint256 public constant AUTOMATION_INTERVAL = 1 days; // Check daily for due subscriptions
    
    // Gas optimization for automation
    uint256 public constant MAX_USERS_PER_UPKEEP = 20; // Process max 20 users per upkeep call
    
    constructor(address _priceFeed, address _wethToken) Ownable(msg.sender) {
        require(_priceFeed != address(0), "Invalid price feed address");
        require(_wethToken != address(0), "Invalid WETH address");
        
        priceFeed = AggregatorV3Interface(_priceFeed);
        wethToken = IERC20(_wethToken);
        lastAutomationTime = block.timestamp;
    }
    
    /**
     * @notice Get the latest ETH/USD price from Chainlink with staleness checks
     * @return The latest price with 8 decimals
     */
    function getLatestPrice() public view returns (uint256) {
        (
            uint80 roundId,
            int256 price,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        require(price > 0, "Invalid price feed");
        require(updatedAt > 0, "Round not complete");
        require(block.timestamp - updatedAt <= PRICE_STALENESS_THRESHOLD, "Price data too old");
        require(answeredInRound >= roundId, "Stale price data");
        require(uint256(price) <= MAX_PRICE_USD, "Price too high");
        
        return uint256(price);
    }
    
    /**
     * @notice Calculate the required WETH amount based on USD price with overflow protection
     * @return The amount of WETH required with 18 decimals
     */
    function getRequiredWETHAmount() public view returns (uint256) {
        uint256 ethPrice = getLatestPrice();
        
        // Overflow protection
        uint256 numerator = SUBSCRIPTION_COST_USD * 1e18;
        require(numerator / 1e18 == SUBSCRIPTION_COST_USD, "Overflow detected");
        require(ethPrice > 0, "Invalid ETH price");
        
        return numerator / ethPrice;
    }
    
    /**
     * @notice Add user to tracking array
     * @param user Address to add
     */
    function _addUser(address user) internal {
        if (!isUserTracked[user]) {
            activeUsers.push(user);
            userIndex[user] = activeUsers.length - 1;
            isUserTracked[user] = true;
            emit UserAddedToTracking(user);
        }
    }
    
    /**
     * @notice Remove user from tracking array
     * @param user Address to remove
     */
    function _removeUser(address user) internal {
        if (isUserTracked[user]) {
            uint256 index = userIndex[user];
            uint256 lastIndex = activeUsers.length - 1;
            
            if (index != lastIndex) {
                address lastUser = activeUsers[lastIndex];
                activeUsers[index] = lastUser;
                userIndex[lastUser] = index;
            }
            
            activeUsers.pop();
            delete userIndex[user];
            isUserTracked[user] = false;
            emit UserRemovedFromTracking(user);
        }
    }
    
    /**
     * @notice Pay for subscription with ETH (manual payment)
     */
    function payWithETH() external payable nonReentrant {
        require(!whitelist[msg.sender], "User is whitelisted");
        
        // Check if user already has an active subscription
        if (!subscriptions[msg.sender].isActive) {
            require(activeUsers.length < MAX_USERS_PER_UPKEEP, "Maximum users reached");
        }
        
        uint256 requiredAmount = getRequiredWETHAmount();
        require(msg.value >= requiredAmount, "Insufficient payment");
        
        // Calculate refund amount
        uint256 refundAmount = 0;
        if (msg.value > requiredAmount) {
            refundAmount = msg.value - requiredAmount;
        }
        
        uint256 nextBilling = block.timestamp + BILLING_CYCLE;
        
        // Update state first (checks-effects-interactions pattern)
        subscriptions[msg.sender] = Subscription({
            lastPaymentTimestamp: block.timestamp,
            nextBillingTimestamp: nextBilling,
            isActive: true,
            lastPaymentAmount: msg.value - refundAmount, // Store actual payment amount
            hasWETHApproval: false // User paid with ETH, not using auto-pay
        });
        
        // Add user to tracking for future automation (in case they set up WETH later)
        _addUser(msg.sender);
        
        emit SubscriptionPaid(msg.sender, msg.value - refundAmount, nextBilling);
        
        // Refund excess ETH if any (interactions last)
        if (refundAmount > 0) {
            (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
            require(success, "Refund failed");
        }
    }
    
    /**
     * @notice Set up subscription with WETH for automatic payments
     */
    function setupWETHSubscription() external nonReentrant {
        require(!whitelist[msg.sender], "User is whitelisted");
        
        // Check if user already has an active subscription
        if (!subscriptions[msg.sender].isActive) {
            require(activeUsers.length < MAX_USERS_PER_UPKEEP, "Maximum users reached");
        }
        
        uint256 requiredAmount = getRequiredWETHAmount();
        
        // Check if user has enough WETH
        require(wethToken.balanceOf(msg.sender) >= requiredAmount, "Insufficient WETH balance");
        
        // Check if user has approved this contract to spend WETH
        require(wethToken.allowance(msg.sender, address(this)) >= requiredAmount, "WETH approval required");
        
        // Transfer WETH for first payment
        require(wethToken.transferFrom(msg.sender, address(this), requiredAmount), "WETH transfer failed");
        
        uint256 nextBilling = block.timestamp + BILLING_CYCLE;
        
        // Update subscription
        subscriptions[msg.sender] = Subscription({
            lastPaymentTimestamp: block.timestamp,
            nextBillingTimestamp: nextBilling,
            isActive: true,
            lastPaymentAmount: requiredAmount,
            hasWETHApproval: true
        });
        
        // Add user to tracking for automation
        _addUser(msg.sender);
        
        emit SubscriptionPaid(msg.sender, requiredAmount, nextBilling);
        emit WETHApprovalUpdated(msg.sender, true);
    }
    
    /**
     * @notice Enable WETH automatic payments for existing subscription
     */
    function enableWETHAutoPay() external {
        require(subscriptions[msg.sender].isActive, "No active subscription");
        require(!subscriptions[msg.sender].hasWETHApproval, "Already enabled");
        
        uint256 requiredAmount = getRequiredWETHAmount();
        
        // Check if user has approved this contract to spend WETH
        require(wethToken.allowance(msg.sender, address(this)) >= requiredAmount, "WETH approval required");
        
        subscriptions[msg.sender].hasWETHApproval = true;
        _addUser(msg.sender); // Ensure user is tracked for automation
        
        emit WETHApprovalUpdated(msg.sender, true);
    }
    
    /**
     * @notice Disable WETH automatic payments
     */
    function disableWETHAutoPay() external {
        subscriptions[msg.sender].hasWETHApproval = false;
        emit WETHApprovalUpdated(msg.sender, false);
    }
    
    /**
     * @notice Cancel subscription
     */
    function cancelSubscription() external {
        require(subscriptions[msg.sender].isActive, "No active subscription");
        
        subscriptions[msg.sender].isActive = false;
        subscriptions[msg.sender].hasWETHApproval = false;
        _removeUser(msg.sender);
        
        emit SubscriptionCanceled(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Check if user has active subscription
     * @param user Address to check
     * @return True if user has active subscription (not expired)
     */
    function hasActiveSubscription(address user) external view returns (bool) {
        if (whitelist[user]) {
            return true;
        }
        
        Subscription memory sub = subscriptions[user];
        if (!sub.isActive) {
            return false;
        }
        
        // Check if subscription hasn't expired (including grace period)
        return block.timestamp <= (sub.nextBillingTimestamp + GRACE_PERIOD);
    }
    
    /**
     * @notice Check if user's subscription is due for payment
     * @param user Address to check
     * @return True if payment is due
     */
    function isPaymentDue(address user) public view returns (bool) {
        Subscription memory sub = subscriptions[user];
        
        if (!sub.isActive || whitelist[user]) {
            return false;
        }
        
        return block.timestamp >= sub.nextBillingTimestamp;
    }
    
    /**
     * @notice Check if user's subscription has expired
     * @param user Address to check
     * @return True if subscription has expired
     */
    function isSubscriptionExpired(address user) public view returns (bool) {
        Subscription memory sub = subscriptions[user];
        
        if (!sub.isActive || whitelist[user]) {
            return false;
        }
        
        return block.timestamp > (sub.nextBillingTimestamp + GRACE_PERIOD);
    }
    
    /**
     * @notice Get subscription details for a user
     * @param user Address to check
     * @return lastPayment When the last payment was made
     * @return nextBilling When next payment is due
     * @return isActive If subscription is currently active
     * @return lastAmount The last payment amount
     * @return isWhitelisted If user is whitelisted
     * @return paymentDue If payment is currently due
     * @return hasExpired If subscription has expired
     * @return hasWETHApproval If user has enabled auto-pay
     */
    function getSubscriptionDetails(address user) external view returns (
        uint256 lastPayment,
        uint256 nextBilling,
        bool isActive,
        uint256 lastAmount,
        bool isWhitelisted,
        bool paymentDue,
        bool hasExpired,
        bool hasWETHApproval
    ) {
        Subscription memory sub = subscriptions[user];
        return (
            sub.lastPaymentTimestamp,
            sub.nextBillingTimestamp,
            sub.isActive,
            sub.lastPaymentAmount,
            whitelist[user],
            isPaymentDue(user),
            isSubscriptionExpired(user),
            sub.hasWETHApproval
        );
    }
    
    /**
     * @notice Add or remove user from whitelist (only owner)
     * @param user Address to modify
     * @param isWhitelisted True to whitelist, false to remove
     */
    function setWhitelist(address user, bool isWhitelisted) external onlyOwner {
        whitelist[user] = isWhitelisted;
        
        // Remove from tracking if whitelisted
        if (isWhitelisted) {
            _removeUser(user);
        }
        
        emit UserWhitelisted(user, isWhitelisted);
    }
    
    /**
     * @notice Batch whitelist operations (only owner)
     * @param users Array of addresses to modify
     * @param isWhitelisted True to whitelist, false to remove
     */
    function batchSetWhitelist(address[] calldata users, bool isWhitelisted) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = isWhitelisted;
            
            if (isWhitelisted) {
                _removeUser(users[i]);
            }
            
            emit UserWhitelisted(users[i], isWhitelisted);
        }
    }
    
    /**
     * @notice Withdraw collected WETH (only owner)
     */
    function withdrawWETH() external onlyOwner {
        uint256 balance = wethToken.balanceOf(address(this));
        require(balance > 0, "No WETH to withdraw");
        require(wethToken.transfer(owner(), balance), "WETH transfer failed");
    }
    
    /**
     * @notice Withdraw collected ETH (only owner)
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "ETH transfer failed");
    }

    // allow ETH to be sent to the contract
    receive() external payable {}
    
    /**
     * @notice Get current pricing information
     * @return usdPrice The subscription price in USD
     * @return wethAmount The required amount in WETH
     * @return ethPrice Current ETH price in USD
     */
    function getPricingInfo() external view returns (
        uint256 usdPrice,
        uint256 wethAmount,
        uint256 ethPrice
    ) {
        uint256 currentEthPrice = getLatestPrice();
        return (
            SUBSCRIPTION_COST_USD,
            getRequiredWETHAmount(),
            currentEthPrice
        );
    }
    
    /**
     * @notice Get comprehensive service details including pricing, billing cycle, and contract info
     * @return usdPrice The subscription price in USD
     * @return wethAmount The required amount in WETH
     * @return ethPrice Current ETH price in USD
     * @return billingCycle The billing cycle in seconds (30 days)
     * @return gracePeriod The grace period in seconds (3 days)
     * @return maxUsers The maximum number of users allowed
     * @return currentUsers The current number of active users
     * @return contractAddress The address of this contract
     */
    function getServiceDetails() external view returns (
        uint256 usdPrice,
        uint256 wethAmount,
        uint256 ethPrice,
        uint256 billingCycle,
        uint256 gracePeriod,
        uint256 maxUsers,
        uint256 currentUsers,
        address contractAddress
    ) {
        uint256 currentEthPrice = getLatestPrice();
        return (
            SUBSCRIPTION_COST_USD,
            getRequiredWETHAmount(),
            currentEthPrice,
            BILLING_CYCLE,
            GRACE_PERIOD,
            MAX_USERS_PER_UPKEEP,
            activeUsers.length,
            address(this)
        );
    }
    
    /**
     * @notice Get total number of tracked users
     * @return Total number of active users
     */
    function getTotalActiveUsers() external view returns (uint256) {
        return activeUsers.length;
    }
    
    /**
     * @notice Get user at specific index
     * @param index Index of user to get
     * @return User address
     */
    function getActiveUserAtIndex(uint256 index) external view returns (address) {
        require(index < activeUsers.length, "Index out of bounds");
        return activeUsers[index];
    }
    
    // ============ CHAINLINK AUTOMATION FUNCTIONS ============
    
    /**
     * @notice Check if automation should be triggered
     * @return upkeepNeeded True if automation should run
     * @return performData Data to pass to performUpkeep
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        // Check if it's time to run automation
        bool timeCondition = (block.timestamp - lastAutomationTime) >= AUTOMATION_INTERVAL;
        
        // Check if there are users with due payments
        bool hasWork = false;
        uint256 totalUsers = activeUsers.length;
        
        for (uint256 i = 0; i < totalUsers && i < MAX_USERS_PER_UPKEEP; i++) {
            address user = activeUsers[i];
            if (isPaymentDue(user) && subscriptions[user].hasWETHApproval) {
                hasWork = true;
                break;
            }
        }
        
        upkeepNeeded = timeCondition && hasWork;
        performData = "";
    }
    
    /**
     * @notice Execute automation logic - process due payments with gas control
     */
    function performUpkeep(bytes calldata) external override {
    require((block.timestamp - lastAutomationTime) >= AUTOMATION_INTERVAL, "Too early");
    
    lastAutomationTime = block.timestamp;
    uint256 requiredAmount = getRequiredWETHAmount();
    uint256 processedCount = 0;
    
    // Crear snapshot del array para evitar modificaciones durante iteración
    address[] memory usersSnapshot = new address[](activeUsers.length);
    uint256 snapshotLength = 0;
    
    // Llenar snapshot con usuarios que necesitan procesamiento
    for (uint256 i = 0; i < activeUsers.length && snapshotLength < MAX_USERS_PER_UPKEEP; i++) {
        address user = activeUsers[i];
        if (isPaymentDue(user) && subscriptions[user].hasWETHApproval) {
            usersSnapshot[snapshotLength] = user;
            snapshotLength++;
        }
    }
    
    // Procesar snapshot
    for (uint256 i = 0; i < snapshotLength; i++) {
        if (gasleft() < 100000) break; // Gas safety buffer
        
        if (_processUserPayment(usersSnapshot[i], requiredAmount)) {
            processedCount++;
        }
    }
    
    emit AutomationTriggered(block.timestamp, processedCount);
}
    
    /**
     * @notice Process payment for a specific user
     * @param user Address of the user
     * @param requiredAmount Amount required for payment
     * @return success True if payment was processed successfully
     */
    function _processUserPayment(address user, uint256 requiredAmount) internal returns (bool) {
        Subscription storage sub = subscriptions[user];
        
        // Check if user should be charged
        if (!sub.isActive || whitelist[user] || !isPaymentDue(user)) {
            return false;
        }
        
        // Check if subscription has expired (past grace period)
        if (isSubscriptionExpired(user)) {
            // Expire the subscription
            sub.isActive = false;
            sub.hasWETHApproval = false;
            _removeUser(user);
            emit SubscriptionExpired(user, block.timestamp);
            return false;
        }
        
        // Check if user has WETH approval
        if (!sub.hasWETHApproval) {
            emit AutomaticPaymentFailed(user, "No WETH approval");
            return false;
        }
        
        // Check if user has enough WETH
        if (wethToken.balanceOf(user) < requiredAmount) {
            emit AutomaticPaymentFailed(user, "Insufficient WETH balance");
            return false;
        }
        
        // Check if allowance is still sufficient
        if (wethToken.allowance(user, address(this)) < requiredAmount) {
            emit AutomaticPaymentFailed(user, "Insufficient WETH allowance");
            return false;
        }
        
        // Transfer WETH from user to contract
        if (!wethToken.transferFrom(user, address(this), requiredAmount)) {
            emit AutomaticPaymentFailed(user, "WETH transfer failed");
            return false;
        }
        
        // Update subscription for next billing cycle
        sub.lastPaymentTimestamp = block.timestamp;
        sub.nextBillingTimestamp = block.timestamp + BILLING_CYCLE;
        sub.lastPaymentAmount = requiredAmount;
        
        emit SubscriptionPaid(user, requiredAmount, sub.nextBillingTimestamp);
        return true;
    }
    
    /**
     * @notice Emergency function to update automation time (only owner)
     * @param newTime New automation time
     */
    function updateAutomationTime(uint256 newTime) external onlyOwner {
        lastAutomationTime = newTime;
    }
    
    /**
     * @notice Emergency function to manually process a user's payment (only owner)
     * @param user Address of user to process
     */
    function manuallyProcessPayment(address user) external onlyOwner {
        uint256 requiredAmount = getRequiredWETHAmount();
        require(_processUserPayment(user, requiredAmount), "Payment processing failed");
    }
}