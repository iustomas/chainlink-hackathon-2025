// chai for testing
import { expect } from "chai";

// ethers from hardhat
import { ethers } from "hardhat";
import { parseUnits, formatEther, parseEther } from "ethers";

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
      priceFeed.address
    )) as IntakePayment;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await intakePayment.owner()).to.equal(owner.address);
    });

    it("Should have the correct intake cost", async function () {
      expect((await intakePayment.INTAKE_COST_USD()).toString()).to.equal(
        parseUnits("0.1", 8).toString()
      );
    });
  });

  describe("Payment", function () {
    it("Should allow user to pay for intake", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();
      console.log(
        "    Required ETH amount:",
        formatEther(requiredAmount.toString()),
        "ETH"
      );

      const tx = await intakePayment
        .connect(user)
        .payForIntake({ value: BigInt(requiredAmount.toString()) });

      // Wait for transaction to be mined
      await tx.wait();

      expect(await intakePayment.hasPaid(user.address)).to.be.true;
    });

    it("Should not allow user to pay twice", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();

      await intakePayment
        .connect(user)
        .payForIntake({ value: BigInt(requiredAmount.toString()) });

      await expect(
        intakePayment
          .connect(user)
          .payForIntake({ value: BigInt(requiredAmount.toString()) })
      ).to.be.revertedWith("Already paid");
    });

    it("Should refund excess payment", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();
      const excessAmount =
        BigInt(requiredAmount.toString()) + parseEther("0.1");

      const initialBalance = await ethers.provider.getBalance(user.address);

      await intakePayment.connect(user).payForIntake({ value: excessAmount });

      const finalBalance = await ethers.provider.getBalance(user.address);
      const expectedBalance =
        BigInt(initialBalance.toString()) - BigInt(requiredAmount.toString());

      // Allow for gas costs
      expect(BigInt(finalBalance.toString())).to.be.closeTo(
        expectedBalance,
        parseEther("0.01")
      );
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to withdraw funds", async function () {
      const requiredAmount = await intakePayment.getRequiredETHAmount();
      await intakePayment
        .connect(user)
        .payForIntake({ value: BigInt(requiredAmount.toString()) });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await intakePayment.connect(owner).withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(BigInt(finalBalance.toString())).to.be.gt(
        BigInt(initialBalance.toString())
      );
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(intakePayment.connect(user).withdraw()).to.be.reverted;
    });
  });

  describe("Payment Details", function () {
    it("Should return correct payment details", async function () {
      const [usdPrice, ethAmount, contractAddress] =
        await intakePayment.getPaymentDetails();

      expect(usdPrice.toString()).to.equal(parseUnits("0.1", 8).toString());
      expect(ethAmount.toString()).to.equal(
        (await intakePayment.getRequiredETHAmount()).toString()
      );
      expect(contractAddress).to.equal((intakePayment as any).address);
    });
  });
});
