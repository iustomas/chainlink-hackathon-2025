// chai for testing
import { expect } from "chai";

// ethers from hardhat
import { ethers } from "hardhat";

// signers from hardhat
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// typechain-types
import { ConsumerSimple, MockFunctionsRouter } from "../typechain-types";

// Helper function to convert string to bytes
function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

describe("ConsumerSimple", function () {
  let consumerSimple: ConsumerSimple;
  let mockRouter: MockFunctionsRouter;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  // Test configuration
  const donId =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  const subscriptionId = 1n;
  const gasLimit = 300000n;

  beforeEach(async function () {
    // Get signers
    [owner, user] = await ethers.getSigners();

    // Deploy mock Functions Router
    const MockFunctionsRouter = await ethers.getContractFactory(
      "MockFunctionsRouter"
    );
    mockRouter = await MockFunctionsRouter.deploy();

    // Deploy ConsumerSimple contract
    const ConsumerSimple = await ethers.getContractFactory("ConsumerSimple");
    consumerSimple = await ConsumerSimple.deploy(
      (mockRouter as any).address,
      donId,
      subscriptionId,
      gasLimit
    );
  });

  it("execute actualiza lastId", async function () {
    const source = stringToBytes("return Functions.encodeString('Hola');");
    await consumerSimple.connect(user).execute(source);
    const lastId = await consumerSimple.lastId();
    expect(lastId).to.not.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("fulfillRequest actualiza lastResponse", async function () {
    const source = stringToBytes(
      "return Functions.encodeString('Hola fulfill');"
    );
    await consumerSimple.connect(user).execute(source);
    const lastId = await consumerSimple.lastId();
    const resp = stringToBytes("respuesta mock");
    await mockRouter.mockFulfillRequest(lastId, resp, stringToBytes(""));
    expect(await consumerSimple.lastResponse()).to.equal("respuesta mock");
  });

  describe("Deployment", function () {
    it("Should set the correct DON ID", async function () {
      expect(await consumerSimple.donId()).to.equal(donId);
    });

    it("Should set the correct subscription ID", async function () {
      const subId = await consumerSimple.subscriptionId();
      expect(BigInt(subId.toString())).to.equal(subscriptionId);
    });

    it("Should set the correct gas limit", async function () {
      expect(await consumerSimple.gasLimit()).to.equal(gasLimit);
    });

    it("Should initialize lastId and lastResponse as empty", async function () {
      expect(await consumerSimple.lastId()).to.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
      expect(await consumerSimple.lastResponse()).to.equal("");
    });
  });

  describe("Request Execution", function () {
    it("Should execute a request with JavaScript source code", async function () {
      const sourceCode = "return Functions.encodeString('Hello World');";
      const sourceBytes = stringToBytes(sourceCode);

      const tx = await consumerSimple.connect(user).execute(sourceBytes);
      const receipt = await tx.wait();

      // Check that a request was made
      const counter = await mockRouter.getRequestCounter();
      expect(BigInt(counter.toString())).to.equal(1n);
    });

    it("Should store the request ID after execution", async function () {
      const sourceCode = "return Functions.encodeString('Test Response');";
      const sourceBytes = stringToBytes(sourceCode);

      await consumerSimple.connect(user).execute(sourceBytes);

      // The request ID should not be empty after execution
      const lastId = await consumerSimple.lastId();
      expect(lastId).to.not.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });

    it("Should allow multiple requests from different users", async function () {
      const sourceCode1 = "return Functions.encodeString('User 1');";
      const sourceCode2 = "return Functions.encodeString('User 2');";
      const sourceBytes1 = stringToBytes(sourceCode1);
      const sourceBytes2 = stringToBytes(sourceCode2);

      await consumerSimple.connect(owner).execute(sourceBytes1);
      await consumerSimple.connect(user).execute(sourceBytes2);

      const counter = await mockRouter.getRequestCounter();
      expect(BigInt(counter.toString())).to.equal(2n);
    });
  });

  describe("Request Fulfillment", function () {
    it("Should fulfill a request and update lastResponse", async function () {
      const sourceCode = "return Functions.encodeString('Test Request');";
      const sourceBytes = stringToBytes(sourceCode);

      // Execute the request
      await consumerSimple.connect(user).execute(sourceBytes);

      // Get the request ID
      const requestId = await consumerSimple.lastId();

      // Mock the fulfillment with a response
      const mockResponse = "Mock API Response";
      const mockResponseBytes = stringToBytes(mockResponse);
      const mockError = stringToBytes("");

      await mockRouter.mockFulfillRequest(
        requestId,
        mockResponseBytes,
        mockError
      );

      // Check that the response was stored
      expect(await consumerSimple.lastResponse()).to.equal("Mock API Response");
    });

    it("Should handle empty response", async function () {
      const sourceCode = "return Functions.encodeString('Empty Test');";
      const sourceBytes = stringToBytes(sourceCode);

      await consumerSimple.connect(user).execute(sourceBytes);
      const requestId = await consumerSimple.lastId();

      const mockResponse = stringToBytes("");
      const mockError = stringToBytes("");

      await mockRouter.mockFulfillRequest(requestId, mockResponse, mockError);

      expect(await consumerSimple.lastResponse()).to.equal("");
    });

    it("Should handle error responses", async function () {
      const sourceCode = "return Functions.encodeString('Error Test');";
      const sourceBytes = stringToBytes(sourceCode);

      await consumerSimple.connect(user).execute(sourceBytes);
      const requestId = await consumerSimple.lastId();

      const mockResponse = stringToBytes("");
      const mockError = stringToBytes("API Error");

      await mockRouter.mockFulfillRequest(requestId, mockResponse, mockError);

      // The contract should still store the response (even if empty due to error)
      expect(await consumerSimple.lastResponse()).to.equal("");
    });

    it("Should update lastResponse for each new fulfillment", async function () {
      const sourceCode = "return Functions.encodeString('Multiple Test');";
      const sourceBytes = stringToBytes(sourceCode);

      // First request
      await consumerSimple.connect(user).execute(sourceBytes);
      const requestId1 = await consumerSimple.lastId();
      await mockRouter.mockFulfillRequest(
        requestId1,
        stringToBytes("First Response"),
        stringToBytes("")
      );
      expect(await consumerSimple.lastResponse()).to.equal("First Response");

      // Second request
      await consumerSimple.connect(user).execute(sourceBytes);
      const requestId2 = await consumerSimple.lastId();
      await mockRouter.mockFulfillRequest(
        requestId2,
        stringToBytes("Second Response"),
        stringToBytes("")
      );
      expect(await consumerSimple.lastResponse()).to.equal("Second Response");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very long source code", async function () {
      const longSourceCode = "return Functions.encodeString('A'.repeat(1000));";
      const sourceBytes = stringToBytes(longSourceCode);

      await expect(consumerSimple.connect(user).execute(sourceBytes)).to.not.be
        .reverted;
    });

    it("Should handle special characters in source code", async function () {
      const specialSourceCode =
        "return Functions.encodeString('Test with special chars: !@#$%^&*()');";
      const sourceBytes = stringToBytes(specialSourceCode);

      await expect(consumerSimple.connect(user).execute(sourceBytes)).to.not.be
        .reverted;
    });

    it("Should handle fulfillment for non-existent request ID", async function () {
      const fakeRequestId =
        "0x0000000000000000000000000000000000000000000000000000000000000001";
      const mockResponse = stringToBytes("Fake Response");
      const mockError = stringToBytes("");

      await expect(
        mockRouter.mockFulfillRequest(fakeRequestId, mockResponse, mockError)
      ).to.be.revertedWith("Request ID does not exist");
    });
  });

  describe("Access Control", function () {
    it("Should allow any address to execute requests", async function () {
      const sourceCode = "return Functions.encodeString('Access Test');";
      const sourceBytes = stringToBytes(sourceCode);

      // Should work for owner
      await expect(consumerSimple.connect(owner).execute(sourceBytes)).to.not.be
        .reverted;

      // Should work for user
      await expect(consumerSimple.connect(user).execute(sourceBytes)).to.not.be
        .reverted;
    });

    it("Should allow any address to receive fulfillments", async function () {
      const sourceCode = "return Functions.encodeString('Fulfillment Test');";
      const sourceBytes = stringToBytes(sourceCode);

      await consumerSimple.connect(user).execute(sourceBytes);
      const requestId = await consumerSimple.lastId();

      // Mock router should be able to fulfill the request
      await expect(
        mockRouter.mockFulfillRequest(
          requestId,
          stringToBytes("Test Response"),
          stringToBytes("")
        )
      ).to.not.be.reverted;
    });
  });
});
