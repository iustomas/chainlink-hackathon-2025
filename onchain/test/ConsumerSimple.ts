// chai for testing
import { expect } from "chai";

// ethers from hardhat
import { ethers } from "hardhat";

// signers from hardhat
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// typechain-types

import { ConsumerSimple, MockFunctionsRouter } from "../typechain-types";

// Helper: string → bytes (para mockFulfillRequest)
function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

describe("ConsumerSimple", () => {
  let consumerSimple: ConsumerSimple;
  let mockRouter: MockFunctionsRouter;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  // Config
  const donId =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  const subscriptionId = 1n;
  const gasLimit = 300000n;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    // Deploy mock router
    const MockRouter = await ethers.getContractFactory("MockFunctionsRouter");
    mockRouter = (await MockRouter.deploy()) as MockFunctionsRouter;

    // Deploy consumer
    const Consumer = await ethers.getContractFactory("ConsumerSimple");
    consumerSimple = (await Consumer.deploy(
      (mockRouter as any).address,
      donId,
      subscriptionId,
      gasLimit
    )) as ConsumerSimple;
  });

  /* -------------------------------------------------------------------------- */
  /*                                 BÁSICOS                                    */
  /* -------------------------------------------------------------------------- */

  it("execute actualiza lastId", async () => {
    await consumerSimple
      .connect(user)
      .execute("return Functions.encodeString('Hola');");

    const lastId = await consumerSimple.lastId();
    expect(lastId).to.not.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("fulfillRequest actualiza lastResponse", async () => {
    await consumerSimple
      .connect(user)
      .execute("return Functions.encodeString('Hola fulfill');");

    const lastId = await consumerSimple.lastId();
    await mockRouter.mockFulfillRequest(
      lastId,
      stringToBytes("respuesta mock"),
      stringToBytes("")
    );

    expect(await consumerSimple.lastResponse()).to.equal("respuesta mock");
  });

  /* -------------------------------------------------------------------------- */
  /*                               DEPLOYMENT                                   */
  /* -------------------------------------------------------------------------- */

  describe("Deployment", () => {
    it("Should set the correct DON ID", async () => {
      expect(await consumerSimple.donId()).to.equal(donId);
    });

    it("Should set the correct subscription ID", async () => {
      expect(
        BigInt((await consumerSimple.subscriptionId()).toString())
      ).to.equal(subscriptionId);
    });

    it("Should set the correct gas limit", async () => {
      expect(await consumerSimple.gasLimit()).to.equal(gasLimit);
    });

    it("Should initialize lastId and lastResponse as empty", async () => {
      expect(await consumerSimple.lastId()).to.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
      expect(await consumerSimple.lastResponse()).to.equal("");
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           REQUEST EXECUTION                                */
  /* -------------------------------------------------------------------------- */

  describe("Request Execution", () => {
    it("Should execute a request with JavaScript source code", async () => {
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Hello World');");

      expect(
        BigInt((await mockRouter.getRequestCounter()).toString())
      ).to.equal(1n);
    });

    it("Should store the request ID after execution", async () => {
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Test Response');");

      const lastId = await consumerSimple.lastId();
      expect(lastId).to.not.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });

    it("Should allow multiple requests from different users", async () => {
      await consumerSimple
        .connect(owner)
        .execute("return Functions.encodeString('User 1');");
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('User 2');");

      expect(
        BigInt((await mockRouter.getRequestCounter()).toString())
      ).to.equal(2n);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                          REQUEST FULFILLMENT                               */
  /* -------------------------------------------------------------------------- */

  describe("Request Fulfillment", () => {
    it("Should fulfill a request and update lastResponse", async () => {
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Test Request');");

      const requestId = await consumerSimple.lastId();

      await mockRouter.mockFulfillRequest(
        requestId,
        stringToBytes("Mock API Response"),
        stringToBytes("")
      );

      expect(await consumerSimple.lastResponse()).to.equal("Mock API Response");
    });

    it("Should handle empty response", async () => {
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Empty Test');");

      const requestId = await consumerSimple.lastId();

      await mockRouter.mockFulfillRequest(
        requestId,
        stringToBytes(""),
        stringToBytes("")
      );

      expect(await consumerSimple.lastResponse()).to.equal("");
    });

    it("Should handle error responses", async () => {
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Error Test');");

      const requestId = await consumerSimple.lastId();

      await mockRouter.mockFulfillRequest(
        requestId,
        stringToBytes(""),
        stringToBytes("API Error")
      );

      // response queda vacío porque llegó error
      expect(await consumerSimple.lastResponse()).to.equal("");
    });

    it("Should update lastResponse for each new fulfillment", async () => {
      // 1ª petición
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Multiple Test');");
      const id1 = await consumerSimple.lastId();
      await mockRouter.mockFulfillRequest(
        id1,
        stringToBytes("First Response"),
        stringToBytes("")
      );
      expect(await consumerSimple.lastResponse()).to.equal("First Response");

      // 2ª petición
      await consumerSimple
        .connect(user)
        .execute("return Functions.encodeString('Multiple Test');");
      const id2 = await consumerSimple.lastId();
      await mockRouter.mockFulfillRequest(
        id2,
        stringToBytes("Second Response"),
        stringToBytes("")
      );
      expect(await consumerSimple.lastResponse()).to.equal("Second Response");
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                               EDGE CASES                                   */
  /* -------------------------------------------------------------------------- */

  describe("Edge Cases", () => {
    it("Should handle very long source code", async () => {
      const longSrc = `return Functions.encodeString('${"A".repeat(1000)}');`;
      await expect(consumerSimple.connect(user).execute(longSrc)).to.not.be
        .reverted;
    });

    it("Should handle special characters in source code", async () => {
      const specialSrc =
        "return Functions.encodeString('Test with special chars: !@#$%^&*()');";
      await expect(consumerSimple.connect(user).execute(specialSrc)).to.not.be
        .reverted;
    });

    it("Should handle fulfillment for non-existent request ID", async () => {
      const fakeId =
        "0x0000000000000000000000000000000000000000000000000000000000000001";
      await expect(
        mockRouter.mockFulfillRequest(
          fakeId,
          stringToBytes("Fake"),
          stringToBytes("")
        )
      ).to.be.revertedWith("Request ID does not exist");
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                             ACCESS CONTROL                                 */
  /* -------------------------------------------------------------------------- */

  describe("Access Control", () => {
    it("Should allow any address to execute requests", async () => {
      const src = "return Functions.encodeString('Access Test');";
      await expect(consumerSimple.connect(owner).execute(src)).to.not.be
        .reverted;
      await expect(consumerSimple.connect(user).execute(src)).to.not.be
        .reverted;
    });

    it("Should allow any address to receive fulfillments", async () => {
      const src = "return Functions.encodeString('Fulfillment Test');";
      await consumerSimple.connect(user).execute(src);
      const id = await consumerSimple.lastId();

      await expect(
        mockRouter.mockFulfillRequest(
          id,
          stringToBytes("Test Response"),
          stringToBytes("")
        )
      ).to.not.be.reverted;
    });
  });
});
