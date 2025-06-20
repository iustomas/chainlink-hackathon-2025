// chai for testing
import { expect } from "chai";

// hardhat
import { ethers } from "hardhat";

// signers from hardhat
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// typechain-types
import {
  EscalateToHumanLawyer,
  IFunctionsRouter,
  MockFunctionsRouter,
} from "../typechain-types";

describe("EscalateToHumanLawyer", function () {
  let escalator: EscalateToHumanLawyer;
  let mockRouter: MockFunctionsRouter;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  // Test configuration
  const testConfig = {
    donId: "0x0000000000000000000000000000000000000000000000000000000000000000",
    subscriptionId: 0n,
    gasLimit: 300000,
    secretsReference:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    apiUrl: "https://api.example.com/escalate",
  };

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy mock router first
    const MockFunctionsRouterFactory = await ethers.getContractFactory(
      "MockFunctionsRouter"
    );
    mockRouter = await MockFunctionsRouterFactory.deploy();

    // Deploy escalator with mock router
    const EscalateToHumanLawyerFactory = await ethers.getContractFactory(
      "EscalateToHumanLawyer"
    );
    escalator = (await EscalateToHumanLawyerFactory.deploy(
      await mockRouter.getAddress(),
      testConfig.donId,
      testConfig.subscriptionId,
      testConfig.gasLimit,
      testConfig.secretsReference,
      testConfig.apiUrl
    )) as EscalateToHumanLawyer;
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await escalator.owner()).to.equal(owner.address);
    });

    it("Should set the correct configuration", async function () {
      expect(await escalator.donId()).to.equal(testConfig.donId);
      expect(await escalator.subscriptionId()).to.equal(
        testConfig.subscriptionId
      );
      expect(await escalator.gasLimit()).to.equal(testConfig.gasLimit);
      expect(await escalator.secretsReference()).to.equal(
        testConfig.secretsReference
      );
      expect(await escalator.apiUrl()).to.equal(testConfig.apiUrl);
    });
  });

  describe("Configuration Management", function () {
    it("Should allow owner to update configuration", async function () {
      const newDonId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";
      const newSubscriptionId = 123n;
      const newGasLimit = 400000;
      const newSecretsReference =
        "0x2222222222222222222222222222222222222222222222222222222222222222";

      await escalator.updateConfig(
        newDonId,
        newSubscriptionId,
        newGasLimit,
        newSecretsReference
      );

      expect(await escalator.donId()).to.equal(newDonId);
      expect(await escalator.subscriptionId()).to.equal(newSubscriptionId);
      expect(await escalator.gasLimit()).to.equal(newGasLimit);
      expect(await escalator.secretsReference()).to.equal(newSecretsReference);
    });

    it("Should not allow non-owner to update configuration", async function () {
      const newDonId =
        "0x1111111111111111111111111111111111111111111111111111111111111111";

      await expect(
        escalator
          .connect(user)
          .updateConfig(
            newDonId,
            123n,
            400000,
            "0x2222222222222222222222222222222222222222222222222222222222222222"
          )
      ).to.be.revertedWith("Only callable by owner");
    });

    it("Should allow owner to update API URL", async function () {
      const newApiUrl = "https://new-api.example.com/escalate";

      await escalator.updateApiUrl(newApiUrl);

      expect(await escalator.apiUrl()).to.equal(newApiUrl);
    });

    it("Should not allow non-owner to update API URL", async function () {
      const newApiUrl = "https://new-api.example.com/escalate";

      await expect(
        escalator.connect(user).updateApiUrl(newApiUrl)
      ).to.be.revertedWith("Only callable by owner");
    });

    it("Should not allow empty API URL", async function () {
      await expect(escalator.updateApiUrl("")).to.be.revertedWith(
        "API URL cannot be empty"
      );
    });
  });

  describe("Escalation Request", function () {
    it("Should emit EscalationRequested event and create request", async function () {
      const caseId = "0x6914c5b9ab9b49bCF84f980Ff773Bf2ae6186A6D-01";
      const signature = "saldkfj";
      const timestamp = 10n;
      const nonce = "1";

      const tx = await escalator
        .connect(user)
        .requestEscalation(caseId, signature, timestamp, nonce);
      const receipt = await tx.wait();

      // Check that the event was emitted
      expect(receipt?.status).to.equal(1);

      // Get the requestId from the event
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = escalator.interface.parseLog(log as any);
          return parsed?.name === "EscalationRequested";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;

      if (event) {
        const parsedEvent = escalator.interface.parseLog(event as any);
        const requestId = parsedEvent?.args[5];

        // Verify the request was stored correctly
        const request = await escalator.getRequest(requestId);
        expect(request.caseId).to.equal(caseId);
        expect(request.contractAddress).to.equal(user.address);
        expect(request.signature).to.equal(signature);
        expect(request.timestamp).to.equal(timestamp);
        expect(request.nonce).to.equal(nonce);
        expect(request.completed).to.be.false;

        // Verify the mock router recorded the request
        expect(await mockRouter.hasRequestId(requestId)).to.be.true;
      }
    });

    it("Should store request details correctly", async function () {
      const caseId = "0x6914c5b9ab9b49bCF84f980Ff773Bf2ae6186A6D-01";
      const signature = "saldkfj";
      const timestamp = 10n;
      const nonce = "1";

      const tx = await escalator
        .connect(user)
        .requestEscalation(caseId, signature, timestamp, nonce);
      const receipt = await tx.wait();

      // Get the requestId from the event
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = escalator.interface.parseLog(log as any);
          return parsed?.name === "EscalationRequested";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = escalator.interface.parseLog(event as any);
        const requestId = parsedEvent?.args[5]; // requestId is the 6th argument

        const request = await escalator.getRequest(requestId);
        expect(request.caseId).to.equal(caseId);
        expect(request.contractAddress).to.equal(user.address);
        expect(request.signature).to.equal(signature);
        expect(request.timestamp).to.equal(timestamp);
        expect(request.nonce).to.equal(nonce);
        expect(request.completed).to.be.false;
      }
    });

    it("Should handle multiple escalation requests", async function () {
      const caseId1 = "case-001";
      const caseId2 = "case-002";
      const signature = "test-signature";
      const timestamp = 10n;
      const nonce1 = "1";
      const nonce2 = "2";

      const tx1 = await escalator
        .connect(user)
        .requestEscalation(caseId1, signature, timestamp, nonce1);
      const receipt1 = await tx1.wait();

      const tx2 = await escalator
        .connect(user)
        .requestEscalation(caseId2, signature, timestamp, nonce2);
      const receipt2 = await tx2.wait();

      // Both transactions should succeed
      expect(receipt1?.status).to.equal(1);
      expect(receipt2?.status).to.equal(1);

      // Verify both requests were recorded by the mock router
      expect(await mockRouter.getRequestCounter()).to.equal(2);
    });
  });

  describe("Request Management", function () {
    it("Should return correct request details", async function () {
      const caseId = "test-case-123";
      const signature = "test-signature-456";
      const timestamp = 1234567890n;
      const nonce = "nonce-789";

      const tx = await escalator
        .connect(user)
        .requestEscalation(caseId, signature, timestamp, nonce);
      const receipt = await tx.wait();

      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = escalator.interface.parseLog(log as any);
          return parsed?.name === "EscalationRequested";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = escalator.interface.parseLog(event as any);
        const requestId = parsedEvent?.args[5];

        const request = await escalator.getRequest(requestId);
        expect(request.caseId).to.equal(caseId);
        expect(request.contractAddress).to.equal(user.address);
        expect(request.signature).to.equal(signature);
        expect(request.timestamp).to.equal(timestamp);
        expect(request.nonce).to.equal(nonce);
        expect(request.completed).to.be.false;
      }
    });

    it("Should return empty request for non-existent requestId", async function () {
      const nonExistentRequestId =
        "0x0000000000000000000000000000000000000000000000000000000000000001";
      const request = await escalator.getRequest(nonExistentRequestId);

      expect(request.caseId).to.equal("");
      expect(request.contractAddress).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(request.signature).to.equal("");
      expect(request.timestamp).to.equal(0n);
      expect(request.nonce).to.equal("");
      expect(request.completed).to.be.false;
    });
  });

  describe("Mock Router Integration", function () {
    it("Should interact correctly with mock router", async function () {
      const caseId = "mock-test-case";
      const signature = "mock-signature";
      const timestamp = 1000n;
      const nonce = "mock-nonce";

      const initialCounter = await mockRouter.getRequestCounter();

      const tx = await escalator
        .connect(user)
        .requestEscalation(caseId, signature, timestamp, nonce);
      const receipt = await tx.wait();

      // Verify the mock router counter increased
      expect(await mockRouter.getRequestCounter()).to.equal(
        initialCounter + 1n
      );
      // Get the requestId from the event
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = escalator.interface.parseLog(log as any);
          return parsed?.name === "EscalationRequested";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = escalator.interface.parseLog(event as any);
        const requestId = parsedEvent?.args[5];

        // Verify the mock router has the request ID
        expect(await mockRouter.hasRequestId(requestId)).to.be.true;
      }
    });
  });
});
