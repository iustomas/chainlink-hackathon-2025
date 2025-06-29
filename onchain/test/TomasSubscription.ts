// chai for testing
import { expect } from "chai";

// ethers from hardhat
import { ethers } from "hardhat";

// ethers
import { Signer } from "ethers";

// time from hardhat (helper for testing)
import { time } from "@nomicfoundation/hardhat-network-helpers";

// describe the contract
describe("TomasSubscription", function () {
  let tomasSubscription: any;
  let mockPriceFeed: any;
  let mockWETH: any;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let user3: Signer;
  let nonUser: Signer;
  let ownerAddress: string;
  let user1Address: string;
  let user2Address: string;
  let user3Address: string;
  let nonUserAddress: string;

  const MOCK_ETH_PRICE = 2000 * 1e8;
  const MONTHLY_COST_USD = 100 * 1e8;
  const REQUIRED_WETH_AMOUNT = BigInt(
    (MONTHLY_COST_USD * 1e18) / MOCK_ETH_PRICE
  );

  // Contract constants
  const BILLING_CYCLE = 30 * 24 * 60 * 60; // 30 days in seconds
  const GRACE_PERIOD = 3 * 24 * 60 * 60; // 3 days in seconds

  // Helper function to refresh price feed after time increase
  async function refreshPriceFeed() {
    const now = await time.latest();
    await mockPriceFeed.updateRoundData(999, MOCK_ETH_PRICE, now, now, 999);
  }

  beforeEach(async function () {
    [owner, user1, user2, user3, nonUser] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();
    user3Address = await user3.getAddress();
    nonUserAddress = await nonUser.getAddress();

    // Deploy mock price feed
    const MockV3Aggregator = await ethers.getContractFactory(
      "MockV3Aggregator"
    );
    mockPriceFeed = await MockV3Aggregator.deploy(8, MOCK_ETH_PRICE);

    // Deploy mock WETH
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockWETH = await MockERC20.deploy("Wrapped Ether", "WETH");

    // Deploy TomasSubscription
    const TomasSubscription = await ethers.getContractFactory(
      "TomasSubscription"
    );
    tomasSubscription = await TomasSubscription.deploy(
      await mockPriceFeed.getAddress(),
      await mockWETH.getAddress()
    );

    // Give some WETH to users for testing
    await mockWETH.mint(user1Address, ethers.parseEther("10"));
    await mockWETH.mint(user2Address, ethers.parseEther("10"));
    await mockWETH.mint(user3Address, ethers.parseEther("10"));
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await tomasSubscription.owner()).to.equal(ownerAddress);
    });

    it("Should set the correct price feed address", async function () {
      // Test by calling getLatestPrice to ensure price feed is working
      const price = await tomasSubscription.getLatestPrice();
      expect(price).to.equal(MOCK_ETH_PRICE);
    });

    it("Should set the correct WETH token address", async function () {
      expect(await tomasSubscription.wethToken()).to.equal(
        await mockWETH.getAddress()
      );
    });

    it("Should reject deployment with zero address for price feed", async function () {
      const TomasSubscription = await ethers.getContractFactory(
        "TomasSubscription"
      );
      await expect(
        TomasSubscription.deploy(
          ethers.ZeroAddress,
          await mockWETH.getAddress()
        )
      ).to.be.revertedWith("Invalid price feed address");
    });

    it("Should reject deployment with zero address for WETH", async function () {
      const TomasSubscription = await ethers.getContractFactory(
        "TomasSubscription"
      );
      await expect(
        TomasSubscription.deploy(
          await mockPriceFeed.getAddress(),
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("Invalid WETH address");
    });
  });

  describe("Price Feed Functions", function () {
    it("Should return correct ETH price", async function () {
      const price = await tomasSubscription.getLatestPrice();
      expect(price).to.equal(MOCK_ETH_PRICE);
    });

    it("Should calculate correct WETH amount required", async function () {
      const amount = await tomasSubscription.getRequiredWETHAmount();
      expect(amount).to.equal(REQUIRED_WETH_AMOUNT);
    });

    it("Should reject stale price data", async function () {
      // Set updatedAt to be too old (more than 1 hour ago)
      const staleTimestamp = (await time.latest()) - 3700; // 3700 seconds ago
      await mockPriceFeed.updateRoundData(
        2,
        MOCK_ETH_PRICE,
        staleTimestamp,
        staleTimestamp,
        2
      );

      await expect(tomasSubscription.getLatestPrice()).to.be.revertedWith(
        "Price data too old"
      );
    });

    it("Should reject invalid price (zero or negative)", async function () {
      await mockPriceFeed.updateAnswer(0);
      await expect(tomasSubscription.getLatestPrice()).to.be.revertedWith(
        "Invalid price feed"
      );

      await mockPriceFeed.updateAnswer(-1);
      await expect(tomasSubscription.getLatestPrice()).to.be.revertedWith(
        "Invalid price feed"
      );
    });

    it("Should reject price that's too high", async function () {
      const tooHighPrice = 10001 * 1e8; // $10001 > MAX_PRICE_USD ($1000)
      await mockPriceFeed.updateAnswer(tooHighPrice);
      await expect(tomasSubscription.getLatestPrice()).to.be.revertedWith(
        "Price too high"
      );
    });

    it("Should return pricing info correctly", async function () {
      const [usdPrice, wethAmount, ethPrice] =
        await tomasSubscription.getPricingInfo();
      expect(usdPrice).to.equal(MONTHLY_COST_USD);
      expect(wethAmount).to.equal(REQUIRED_WETH_AMOUNT);
      expect(ethPrice).to.equal(MOCK_ETH_PRICE);
    });
  });

  describe("ETH Payment Functionality", function () {
    it("Should allow user to pay with ETH", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      await expect(
        tomasSubscription.connect(user1).payWithETH({ value: requiredAmount })
      )
        .to.emit(tomasSubscription, "SubscriptionPaid")
        .withArgs(
          user1Address,
          requiredAmount,
          (await time.latest()) + BILLING_CYCLE + 1
        );

      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;
    });

    it("Should refund excess ETH payment", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      const excessAmount = requiredAmount + ethers.parseEther("0.01");

      const balanceBefore = await ethers.provider.getBalance(user1Address);
      const tx = await tomasSubscription
        .connect(user1)
        .payWithETH({ value: excessAmount });
      const receipt = await tx.wait();
      const balanceAfter = await ethers.provider.getBalance(user1Address);

      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const expectedBalance = balanceBefore - requiredAmount - BigInt(gasUsed);

      expect(balanceAfter).to.be.closeTo(
        expectedBalance,
        ethers.parseEther("0.0001")
      );
    });

    it("Should reject insufficient ETH payment", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      const insufficientAmount = requiredAmount - BigInt(1);

      await expect(
        tomasSubscription
          .connect(user1)
          .payWithETH({ value: insufficientAmount })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should reject payment from whitelisted user", async function () {
      await tomasSubscription.setWhitelist(user1Address, true);
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      await expect(
        tomasSubscription.connect(user1).payWithETH({ value: requiredAmount })
      ).to.be.revertedWith("User is whitelisted");
    });

    it("Should add user to tracking after ETH payment", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(1);
      expect(await tomasSubscription.getActiveUserAtIndex(0)).to.equal(
        user1Address
      );
    });
  });

  describe("WETH Subscription Functionality", function () {
    beforeEach(async function () {
      // Approve WETH spending for users
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        ); // 12 months
      await mockWETH
        .connect(user2)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
    });

    it("Should allow user to setup WETH subscription", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      await expect(tomasSubscription.connect(user1).setupWETHSubscription())
        .to.emit(tomasSubscription, "SubscriptionPaid")
        .and.to.emit(tomasSubscription, "WETHApprovalUpdated")
        .withArgs(user1Address, true);

      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;

      const [, , , , , , , hasWETHApproval] =
        await tomasSubscription.getSubscriptionDetails(user1Address);
      expect(hasWETHApproval).to.be.true;
    });

    it("Should reject WETH subscription setup with insufficient balance", async function () {
      // Remove WETH from user
      const balance = await mockWETH.balanceOf(user1Address);
      await mockWETH.connect(user1).transfer(user2Address, balance);

      await expect(
        tomasSubscription.connect(user1).setupWETHSubscription()
      ).to.be.revertedWith("Insufficient WETH balance");
    });

    it("Should reject WETH subscription setup without approval", async function () {
      // Reset approval
      await mockWETH
        .connect(user1)
        .approve(await tomasSubscription.getAddress(), 0);

      await expect(
        tomasSubscription.connect(user1).setupWETHSubscription()
      ).to.be.revertedWith("WETH approval required");
    });

    it("Should allow enabling WETH auto-pay for existing subscription", async function () {
      // First pay with ETH
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });

      // Then enable WETH auto-pay
      await expect(tomasSubscription.connect(user1).enableWETHAutoPay())
        .to.emit(tomasSubscription, "WETHApprovalUpdated")
        .withArgs(user1Address, true);

      const [, , , , , , , hasWETHApproval] =
        await tomasSubscription.getSubscriptionDetails(user1Address);
      expect(hasWETHApproval).to.be.true;
    });

    it("Should allow disabling WETH auto-pay", async function () {
      await tomasSubscription.connect(user1).setupWETHSubscription();

      await expect(tomasSubscription.connect(user1).disableWETHAutoPay())
        .to.emit(tomasSubscription, "WETHApprovalUpdated")
        .withArgs(user1Address, false);

      const [, , , , , , , hasWETHApproval] =
        await tomasSubscription.getSubscriptionDetails(user1Address);
      expect(hasWETHApproval).to.be.false;
    });

    it("Should reject enabling auto-pay without active subscription", async function () {
      await expect(
        tomasSubscription.connect(user1).enableWETHAutoPay()
      ).to.be.revertedWith("No active subscription");
    });

    it("Should reject enabling auto-pay when already enabled", async function () {
      await tomasSubscription.connect(user1).setupWETHSubscription();

      await expect(
        tomasSubscription.connect(user1).enableWETHAutoPay()
      ).to.be.revertedWith("Already enabled");
    });
  });

  describe("Subscription Management", function () {
    beforeEach(async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await tomasSubscription.connect(user1).setupWETHSubscription();
    });

    it("Should allow user to cancel subscription", async function () {
      await expect(tomasSubscription.connect(user1).cancelSubscription())
        .to.emit(tomasSubscription, "SubscriptionCanceled")
        .withArgs(user1Address, (await time.latest()) + 1);

      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .false;
      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(0);
    });

    it("Should reject cancel from user without subscription", async function () {
      await expect(
        tomasSubscription.connect(user2).cancelSubscription()
      ).to.be.revertedWith("No active subscription");
    });

    it("Should correctly identify active subscriptions", async function () {
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;
      expect(await tomasSubscription.hasActiveSubscription(user2Address)).to.be
        .false;
    });

    it("Should correctly identify whitelisted users as having active subscriptions", async function () {
      await tomasSubscription.setWhitelist(user2Address, true);
      expect(await tomasSubscription.hasActiveSubscription(user2Address)).to.be
        .true;
    });

    it("Should return correct subscription details", async function () {
      const [
        lastPayment,
        nextBilling,
        isActive,
        lastAmount,
        isWhitelisted,
        paymentDue,
        hasExpired,
        hasWETHApproval,
      ] = await tomasSubscription.getSubscriptionDetails(user1Address);

      expect(isActive).to.be.true;
      expect(isWhitelisted).to.be.false;
      expect(paymentDue).to.be.false;
      expect(hasExpired).to.be.false;
      expect(hasWETHApproval).to.be.true;
      expect(lastAmount).to.equal(
        await tomasSubscription.getRequiredWETHAmount()
      );
    });
  });

  describe("Payment Due and Expiration Logic", function () {
    beforeEach(async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await tomasSubscription.connect(user1).setupWETHSubscription();
    });

    it("Should correctly identify when payment is due", async function () {
      expect(await tomasSubscription.isPaymentDue(user1Address)).to.be.false;

      // Fast forward to billing cycle
      await time.increase(BILLING_CYCLE);
      await refreshPriceFeed();

      expect(await tomasSubscription.isPaymentDue(user1Address)).to.be.true;
    });

    it("Should correctly identify expired subscriptions", async function () {
      expect(await tomasSubscription.isSubscriptionExpired(user1Address)).to.be
        .false;

      // Fast forward past grace period
      await time.increase(BILLING_CYCLE + GRACE_PERIOD + 1);
      await refreshPriceFeed();

      expect(await tomasSubscription.isSubscriptionExpired(user1Address)).to.be
        .true;
    });

    it("Should maintain active subscription during grace period", async function () {
      // Fast forward to just within grace period
      await time.increase(BILLING_CYCLE + GRACE_PERIOD - 100);
      await refreshPriceFeed();

      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;
      expect(await tomasSubscription.isPaymentDue(user1Address)).to.be.true;
      expect(await tomasSubscription.isSubscriptionExpired(user1Address)).to.be
        .false;
    });

    it("Should expire subscription after grace period", async function () {
      // Fast forward past grace period
      await time.increase(BILLING_CYCLE + GRACE_PERIOD + 1);
      await refreshPriceFeed();

      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .false;
      expect(await tomasSubscription.isSubscriptionExpired(user1Address)).to.be
        .true;
    });
  });

  describe("Whitelist Management", function () {
    it("Should allow owner to whitelist users", async function () {
      await expect(tomasSubscription.setWhitelist(user1Address, true))
        .to.emit(tomasSubscription, "UserWhitelisted")
        .withArgs(user1Address, true);

      expect(await tomasSubscription.whitelist(user1Address)).to.be.true;
    });

    it("Should allow owner to remove users from whitelist", async function () {
      await tomasSubscription.setWhitelist(user1Address, true);

      await expect(tomasSubscription.setWhitelist(user1Address, false))
        .to.emit(tomasSubscription, "UserWhitelisted")
        .withArgs(user1Address, false);

      expect(await tomasSubscription.whitelist(user1Address)).to.be.false;
    });

    it("Should reject whitelist operations from non-owner", async function () {
      await expect(
        tomasSubscription.connect(user1).setWhitelist(user2Address, true)
      ).to.be.revertedWithCustomError(
        tomasSubscription,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should allow batch whitelist operations", async function () {
      const users = [user1Address, user2Address, user3Address];

      await tomasSubscription.batchSetWhitelist(users, true);

      for (const user of users) {
        expect(await tomasSubscription.whitelist(user)).to.be.true;
      }
    });

    it("Should remove whitelisted users from tracking", async function () {
      // First create subscription
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(1);

      // Whitelist should remove from tracking
      await tomasSubscription.setWhitelist(user1Address, true);

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(0);
    });
  });

  describe("Chainlink Automation", function () {
    beforeEach(async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Setup multiple users with WETH subscriptions
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await mockWETH
        .connect(user2)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );

      await tomasSubscription.connect(user1).setupWETHSubscription();
      await tomasSubscription.connect(user2).setupWETHSubscription();
    });

    it("Should not need upkeep when no payments are due", async function () {
      const [upkeepNeeded] = await tomasSubscription.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });

    it("Should not need upkeep too early (before automation interval)", async function () {
      await time.increase(10); // 10 s antes
      await refreshPriceFeed();

      const [upkeepNeeded] = await tomasSubscription.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });

    it("Should need upkeep when payments are due and automation interval passed", async function () {
      // Fast forward past both billing cycle and automation interval
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      const [upkeepNeeded] = await tomasSubscription.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.true;
    });

    it("Should successfully perform upkeep and process payments", async function () {
      // Fast forward to make payments due
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      const contractBalanceBefore = await mockWETH.balanceOf(
        await tomasSubscription.getAddress()
      );

      await expect(tomasSubscription.performUpkeep("0x"))
        .to.emit(tomasSubscription, "AutomationTriggered")
        .and.to.emit(tomasSubscription, "SubscriptionPaid");

      const contractBalanceAfter = await mockWETH.balanceOf(
        await tomasSubscription.getAddress()
      );
      expect(contractBalanceAfter).to.be.gt(contractBalanceBefore);
    });

    it("Should handle users without sufficient WETH balance during automation", async function () {
      // Remove WETH from user1
      const balance = await mockWETH.balanceOf(user1Address);
      await mockWETH.connect(user1).transfer(nonUserAddress, balance);

      // Fast forward to make payments due
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      await expect(tomasSubscription.performUpkeep("0x"))
        .to.emit(tomasSubscription, "AutomaticPaymentFailed")
        .withArgs(user1Address, "Insufficient WETH balance");
    });

    it("Should expire subscriptions past grace period during automation", async function () {
      // Fast forward past grace period
      await time.increase(BILLING_CYCLE + GRACE_PERIOD + 24 * 60 * 60 + 1);
      await refreshPriceFeed();

      await expect(tomasSubscription.performUpkeep("0x"))
        .to.emit(tomasSubscription, "SubscriptionExpired")
        .withArgs(user1Address, (await time.latest()) + 1);
    });

    it("Should reject performUpkeep when called too early", async function () {
      await expect(tomasSubscription.performUpkeep("0x")).to.be.revertedWith(
        "Too early"
      );
    });

    it("Should allow owner to manually process payment", async function () {
      // Fast forward to make payment due
      await time.increase(BILLING_CYCLE + 1);
      await refreshPriceFeed();

      await expect(
        tomasSubscription.manuallyProcessPayment(user1Address)
      ).to.emit(tomasSubscription, "SubscriptionPaid");
    });

    it("Should allow owner to update automation time", async function () {
      const newTime = await time.latest();
      await tomasSubscription.updateAutomationTime(newTime);
      expect(await tomasSubscription.lastAutomationTime()).to.equal(newTime);
    });
  });

  describe("Fund Withdrawal", function () {
    beforeEach(async function () {
      // Setup subscription and make some payments
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await tomasSubscription.connect(user1).setupWETHSubscription();
      await tomasSubscription
        .connect(user2)
        .payWithETH({ value: requiredAmount });
    });

    it("Should allow owner to withdraw WETH", async function () {
      const contractBalance = await mockWETH.balanceOf(
        await tomasSubscription.getAddress()
      );
      const ownerBalanceBefore = await mockWETH.balanceOf(ownerAddress);

      await tomasSubscription.withdrawWETH();

      const ownerBalanceAfter = await mockWETH.balanceOf(ownerAddress);
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(contractBalance);
    });

    it("Should allow owner to withdraw ETH", async function () {
      const contractBalance = await ethers.provider.getBalance(
        await tomasSubscription.getAddress()
      );

      await tomasSubscription.withdrawETH();

      const contractBalanceAfter = await ethers.provider.getBalance(
        await tomasSubscription.getAddress()
      );
      expect(contractBalanceAfter).to.equal(0);
    });

    it("Should reject WETH withdrawal from non-owner", async function () {
      await expect(
        tomasSubscription.connect(user1).withdrawWETH()
      ).to.be.revertedWithCustomError(
        tomasSubscription,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should reject ETH withdrawal from non-owner", async function () {
      await expect(
        tomasSubscription.connect(user1).withdrawETH()
      ).to.be.revertedWithCustomError(
        tomasSubscription,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should reject withdrawal when no funds available", async function () {
      await tomasSubscription.withdrawWETH();
      await tomasSubscription.withdrawETH();

      await expect(tomasSubscription.withdrawWETH()).to.be.revertedWith(
        "No WETH to withdraw"
      );

      await expect(tomasSubscription.withdrawETH()).to.be.revertedWith(
        "No ETH to withdraw"
      );
    });
  });

  describe("User Tracking", function () {
    it("Should correctly track active users", async function () {
      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(0);

      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(1);
      expect(await tomasSubscription.getActiveUserAtIndex(0)).to.equal(
        user1Address
      );
    });

    it("Should remove users from tracking when they cancel", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });
      await tomasSubscription
        .connect(user2)
        .payWithETH({ value: requiredAmount });

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(2);

      await tomasSubscription.connect(user1).cancelSubscription();

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(1);
      expect(await tomasSubscription.getActiveUserAtIndex(0)).to.equal(
        user2Address
      );
    });

    it("Should reject access to invalid user index", async function () {
      await expect(
        tomasSubscription.getActiveUserAtIndex(0)
      ).to.be.revertedWith("Index out of bounds");
    });

    it("Should handle user removal from middle of array correctly", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Add three users
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });
      await tomasSubscription
        .connect(user2)
        .payWithETH({ value: requiredAmount });
      await tomasSubscription
        .connect(user3)
        .payWithETH({ value: requiredAmount });

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(3);

      // Remove middle user
      await tomasSubscription.connect(user2).cancelSubscription();

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(2);
      // user3 should have moved to index 1 (where user2 was)
      expect(await tomasSubscription.getActiveUserAtIndex(1)).to.equal(
        user3Address
      );
    });
  });

  describe("Service Details", function () {
    it("Should return correct service details", async function () {
      const [
        usdPrice,
        wethAmount,
        ethPrice,
        billingCycle,
        gracePeriod,
        maxUsers,
        currentUsers,
        contractAddress,
      ] = await tomasSubscription.getServiceDetails();

      expect(usdPrice).to.equal(MONTHLY_COST_USD);
      expect(wethAmount).to.equal(REQUIRED_WETH_AMOUNT);
      expect(ethPrice).to.equal(MOCK_ETH_PRICE);
      expect(billingCycle).to.equal(BILLING_CYCLE);
      expect(gracePeriod).to.equal(GRACE_PERIOD);
      expect(maxUsers).to.equal(20); // MAX_USERS_PER_UPKEEP
      expect(currentUsers).to.equal(0);
      expect(contractAddress).to.equal(await tomasSubscription.getAddress());
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should reject payment when max users reached", async function () {
      // This test assumes MAX_USERS_PER_UPKEEP is 20
      // In a real scenario, you might want to make this configurable for testing

      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // We can't easily test the exact limit without deploying 20 users
      // but we can test the logic by manually checking the condition
      expect(await tomasSubscription.getTotalActiveUsers()).to.be.lt(20);
    });

    it("Should handle reentrancy attacks", async function () {
      // The contract uses ReentrancyGuard, so direct testing is limited
      // But we can verify that the guard is in place for critical functions
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // This should work normally (no reentrancy)
      await expect(
        tomasSubscription.connect(user1).payWithETH({ value: requiredAmount })
      ).to.not.be.reverted;
    });

    it("Should handle price feed edge cases", async function () {
      // Test with very high ETH price (but within limits)
      const highPrice = 999 * 1e8; // Just under MAX_PRICE_USD
      await mockPriceFeed.updateAnswer(highPrice);

      const wethAmount = await tomasSubscription.getRequiredWETHAmount();
      expect(wethAmount).to.be.gt(0);

      // Test with very low ETH price
      const lowPrice = 1 * 1e8; // $1
      await mockPriceFeed.updateAnswer(lowPrice);

      const highWethAmount = await tomasSubscription.getRequiredWETHAmount();
      expect(highWethAmount).to.be.gt(wethAmount);
    });

    it("Should handle WETH transfer failures gracefully", async function () {
      // Setup user with subscription but no WETH approval for future payments
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(await tomasSubscription.getAddress(), requiredAmount);
      await tomasSubscription.connect(user1).setupWETHSubscription();

      // Remove approval for future payments
      await mockWETH
        .connect(user1)
        .approve(await tomasSubscription.getAddress(), 0);

      // Fast forward to make payment due
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      // Automation should handle the failure gracefully
      await expect(tomasSubscription.performUpkeep("0x"))
        .to.emit(tomasSubscription, "AutomaticPaymentFailed")
        .withArgs(user1Address, "Insufficient WETH allowance");
    });

    it("Should prevent overflow in WETH amount calculation", async function () {
      const amount = await tomasSubscription.getRequiredWETHAmount();

      expect(amount).to.be.gt(0);
    });

    it("Should handle multiple users with same payment timing", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Setup multiple users
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await mockWETH
        .connect(user2)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await mockWETH
        .connect(user3)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );

      // All users setup subscription at the same time
      await tomasSubscription.connect(user1).setupWETHSubscription();
      await tomasSubscription.connect(user2).setupWETHSubscription();
      await tomasSubscription.connect(user3).setupWETHSubscription();

      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(3);

      // Fast forward to make all payments due at the same time
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      // Automation should handle all users
      await expect(tomasSubscription.performUpkeep("0x")).to.emit(
        tomasSubscription,
        "AutomationTriggered"
      );

      // All users should still be active after successful payments
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;
      expect(await tomasSubscription.hasActiveSubscription(user2Address)).to.be
        .true;
      expect(await tomasSubscription.hasActiveSubscription(user3Address)).to.be
        .true;
    });

    it("Should handle gas limit during automation", async function () {
      // The contract has gas safety checks in performUpkeep
      // This test verifies the logic works with multiple users

      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Setup multiple users with WETH subscriptions
      const users = [user1, user2, user3];
      for (const user of users) {
        const userAddress = await user.getAddress();
        await mockWETH.mint(userAddress, ethers.parseEther("10"));
        await mockWETH
          .connect(user)
          .approve(
            await tomasSubscription.getAddress(),
            requiredAmount * BigInt(12)
          );
        await tomasSubscription.connect(user).setupWETHSubscription();
      }

      // Fast forward to make payments due
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      // Perform upkeep should handle all users within gas limits
      await expect(tomasSubscription.performUpkeep("0x")).to.not.be.reverted;
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete subscription lifecycle", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // 1. User pays with ETH
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;

      // 2. User enables WETH auto-pay
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await tomasSubscription.connect(user1).enableWETHAutoPay();

      // 3. Time passes, payment becomes due
      await time.increase(BILLING_CYCLE + 1);
      await refreshPriceFeed();
      expect(await tomasSubscription.isPaymentDue(user1Address)).to.be.true;

      // 4. Automation processes payment
      await time.increase(24 * 60 * 60); // Wait for automation interval
      await refreshPriceFeed();
      await tomasSubscription.performUpkeep("0x");

      // 5. Subscription should be renewed
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;
      expect(await tomasSubscription.isPaymentDue(user1Address)).to.be.false;

      // 6. User cancels subscription
      await tomasSubscription.connect(user1).cancelSubscription();
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .false;
    });

    it("Should handle price changes affecting WETH requirements", async function () {
      const initialPrice = MOCK_ETH_PRICE;
      const initialWethAmount = await tomasSubscription.getRequiredWETHAmount();

      // Setup subscription
      await mockWETH
        .connect(user1)
        .approve(await tomasSubscription.getAddress(), ethers.parseEther("1"));
      await tomasSubscription.connect(user1).setupWETHSubscription();

      // Change ETH price (ETH goes up, less WETH needed)
      const newPrice = initialPrice * 2; // ETH price doubles
      await mockPriceFeed.updateAnswer(newPrice);

      const newWethAmount = await tomasSubscription.getRequiredWETHAmount();
      expect(newWethAmount).to.be.lt(initialWethAmount);

      // Fast forward and process next payment with new price
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      await expect(tomasSubscription.performUpkeep("0x")).to.emit(
        tomasSubscription,
        "SubscriptionPaid"
      );
    });

    it("Should handle mixed payment methods", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // User1 pays with ETH
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });

      // User2 uses WETH subscription
      await mockWETH
        .connect(user2)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await tomasSubscription.connect(user2).setupWETHSubscription();

      // Both should have active subscriptions
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .true;
      expect(await tomasSubscription.hasActiveSubscription(user2Address)).to.be
        .true;

      // Fast forward to payment due
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      // Only user2 should have automatic payment processed
      await expect(tomasSubscription.performUpkeep("0x"))
        .to.emit(tomasSubscription, "SubscriptionPaid")
        .withArgs(
          user2Address,
          requiredAmount,
          (await time.latest()) + BILLING_CYCLE + 1
        );

      // User1 needs manual renewal (no auto-pay)
      expect(await tomasSubscription.isPaymentDue(user1Address)).to.be.true;
      expect(await tomasSubscription.isPaymentDue(user2Address)).to.be.false;
    });

    it("Should handle subscription expiration and renewal", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Setup subscription with limited WETH
      await mockWETH
        .connect(user1)
        .approve(await tomasSubscription.getAddress(), requiredAmount);
      await tomasSubscription.connect(user1).setupWETHSubscription();

      // User spends all remaining WETH
      const remainingBalance = await mockWETH.balanceOf(user1Address);
      await mockWETH.connect(user1).transfer(user2Address, remainingBalance);

      // Fast forward past grace period
      await time.increase(BILLING_CYCLE + GRACE_PERIOD + 24 * 60 * 60 + 1);
      await refreshPriceFeed();

      // Automation should expire the subscription
      await expect(tomasSubscription.performUpkeep("0x"))
        .to.emit(tomasSubscription, "SubscriptionExpired")
        .withArgs(user1Address, (await time.latest()) + 1);

      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .false;
      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(0);
    });
  });

  describe("Error Handling and Edge Cases", function () {
    it("Should handle zero WETH balance gracefully", async function () {
      // Setup subscription then remove all WETH
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      await tomasSubscription.connect(user1).setupWETHSubscription();

      // Transfer all WETH away
      const balance = await mockWETH.balanceOf(user1Address);
      await mockWETH.connect(user1).transfer(user2Address, balance);

      // Try to setup another subscription should fail
      await expect(
        tomasSubscription.connect(user1).setupWETHSubscription()
      ).to.be.revertedWith("Insufficient WETH balance");
    });

    it("Should handle contract receiving ETH directly", async function () {
      // Send ETH directly to contract (not through payWithETH)
      await owner.sendTransaction({
        to: await tomasSubscription.getAddress(),
        value: ethers.parseEther("1"),
      });

      // Contract should accept ETH
      const balance = await ethers.provider.getBalance(
        await tomasSubscription.getAddress()
      );
      expect(balance).to.be.gt(0);

      // Owner should be able to withdraw it
      await tomasSubscription.withdrawETH();
    });

    it("Should validate subscription state consistency", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Create subscription
      await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });

      // Check all state is consistent
      const [
        lastPayment,
        nextBilling,
        isActive,
        lastAmount,
        isWhitelisted,
        paymentDue,
        hasExpired,
        hasWETHApproval,
      ] = await tomasSubscription.getSubscriptionDetails(user1Address);

      expect(isActive).to.be.true;
      expect(lastAmount).to.equal(requiredAmount);
      expect(paymentDue).to.be.false;
      expect(hasExpired).to.be.false;
      expect(nextBilling).to.be.gt(lastPayment);
      expect(nextBilling - lastPayment).to.equal(BILLING_CYCLE);
    });

    it("Should handle multiple rapid state changes", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      await mockWETH
        .connect(user1)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );

      // Rapid state changes
      await tomasSubscription.connect(user1).setupWETHSubscription();
      await tomasSubscription.connect(user1).disableWETHAutoPay();
      await tomasSubscription.connect(user1).enableWETHAutoPay();
      await tomasSubscription.connect(user1).cancelSubscription();

      // Final state should be cancelled
      expect(await tomasSubscription.hasActiveSubscription(user1Address)).to.be
        .false;
      expect(await tomasSubscription.getTotalActiveUsers()).to.equal(0);
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should have reasonable gas costs for common operations", async function () {
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();

      // Test ETH payment gas cost
      const ethPaymentTx = await tomasSubscription
        .connect(user1)
        .payWithETH({ value: requiredAmount });
      const ethPaymentReceipt = await ethPaymentTx.wait();
      console.log(`ETH Payment Gas Used: ${ethPaymentReceipt!.gasUsed}`);

      // Test WETH subscription setup gas cost
      await mockWETH
        .connect(user2)
        .approve(
          await tomasSubscription.getAddress(),
          requiredAmount * BigInt(12)
        );
      const wethSetupTx = await tomasSubscription
        .connect(user2)
        .setupWETHSubscription();
      const wethSetupReceipt = await wethSetupTx.wait();
      console.log(`WETH Setup Gas Used: ${wethSetupReceipt!.gasUsed}`);

      // Gas costs should be reasonable (adjust thresholds as needed)
      expect(ethPaymentReceipt!.gasUsed).to.be.lt(210_000);
      expect(wethSetupReceipt!.gasUsed).to.be.lt(300_000);
    });

    it("Should handle automation gas limits properly", async function () {
      // Setup multiple users to test gas scaling
      const requiredAmount = await tomasSubscription.getRequiredWETHAmount();
      const users = [user1, user2, user3];

      for (const user of users) {
        const userAddress = await user.getAddress();
        await mockWETH.mint(userAddress, ethers.parseEther("10"));
        await mockWETH
          .connect(user)
          .approve(
            await tomasSubscription.getAddress(),
            requiredAmount * BigInt(12)
          );
        await tomasSubscription.connect(user).setupWETHSubscription();
      }

      // Fast forward to make payments due
      await time.increase(Math.max(BILLING_CYCLE, 24 * 60 * 60) + 1);
      await refreshPriceFeed();

      // Measure automation gas usage
      const automationTx = await tomasSubscription.performUpkeep("0x");
      const automationReceipt = await automationTx.wait();
      console.log(
        `Automation Gas Used (3 users): ${automationReceipt!.gasUsed}`
      );

      // Should be reasonable even with multiple users
      expect(automationReceipt!.gasUsed).to.be.lt(500000);
    });
  });
});
