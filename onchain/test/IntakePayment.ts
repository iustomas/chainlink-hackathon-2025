// chai for testing
import { expect } from "chai";

// ethers from hardhat
import { ethers } from "hardhat";

// signers from hardhat
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// typechain-types
import { IntakePayment } from "../typechain-types";

describe("IntakePayment", function () {
  let intakePayment: IntakePayment;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let priceFeed: any;

  beforeEach(async function () {
    // Get signers
    [owner, user] = await ethers.getSigners();

    // Deploy mock price feed
    const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
    priceFeed = await MockPriceFeed.deploy(8, 200000000000); // $2000 USD/ETH

    // Deploy IntakePayment contract
    const IntakePayment = await ethers.getContractFactory("IntakePayment");
    intakePayment = (await IntakePayment.deploy(
      await priceFeed.getAddress()
    )) as IntakePayment;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await intakePayment.owner()).to.equal(owner.address);
    });

    it("Should have the correct intake cost", async function () {
      expect(await intakePayment.INTAKE_COST_USD()).to.equal(
        ethers.parseUnits("0.1", 8)
      );
    });
  });

  describe("Payment", function () {
    it("Should allow user to pay for intake", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();
      console.log(
        "    Required ETH amount:",
        ethers.formatEther(requiredAmount),
        "ETH"
      );

      await expect(
        intakePayment.connect(user).payForIntake({ value: requiredAmount })
      )
        .to.emit(intakePayment, "PaymentReceived")
        .withArgs(user.address, requiredAmount);

      expect(await intakePayment.hasPaid(user.address)).to.be.true;
    });

    it("Should not allow user to pay twice", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();

      await intakePayment.connect(user).payForIntake({ value: requiredAmount });

      await expect(
        intakePayment.connect(user).payForIntake({ value: requiredAmount })
      ).to.be.revertedWith("Already paid");
    });

    it("Should refund excess payment", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();
      const excessAmount = requiredAmount + ethers.parseEther("0.1");

      const initialBalance = await ethers.provider.getBalance(user.address);

      await intakePayment.connect(user).payForIntake({ value: excessAmount });

      const finalBalance = await ethers.provider.getBalance(user.address);
      const expectedBalance = initialBalance - requiredAmount;

      // Allow for gas costs
      expect(finalBalance).to.be.closeTo(
        expectedBalance,
        ethers.parseEther("0.01")
      );
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to withdraw funds", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();
      await intakePayment.connect(user).payForIntake({ value: requiredAmount });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await intakePayment.connect(owner).withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(
        intakePayment.connect(user).withdraw()
      ).to.be.revertedWithCustomError(
        intakePayment,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Payment Details", function () {
    it("Should return correct payment details", async function () {
      const [usdPrice, ethAmount, contractAddress] =
        await intakePayment.getPaymentDetails();

      expect(usdPrice).to.equal(ethers.parseUnits("0.1", 8));
      expect(ethAmount).to.equal(await intakePayment.getRequiredETHAmount());
      expect(contractAddress).to.equal(await intakePayment.getAddress());
    });
  });
});
