// hono
import { Context } from "hono";

// vitest
import { describe, it, expect, beforeEach, vi } from "vitest";

// controllers
import { healthController } from "./health.controller.js";

// mock context for testing
const createMockContext = (): Partial<Context> => {
  const mockJson = vi.fn();
  return {
    json: mockJson,
  } as Partial<Context>;
};

describe("Health Controller", () => {
  let mockContext: Partial<Context>;

  beforeEach(() => {
    mockContext = createMockContext();
    vi.clearAllMocks();
  });

  describe("getStatus", () => {
    it("should return basic health status with correct structure", () => {
      // Act
      healthController.getStatus(mockContext as Context);

      // Assert
      expect(mockContext.json).toHaveBeenCalledWith({
        status: "ok",
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });

    it('should return status as "ok"', () => {
      // Act
      healthController.getStatus(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.status).toBe("ok");
    });

    it("should return a valid ISO timestamp", () => {
      // Act
      healthController.getStatus(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(() => new Date(callArgs.timestamp)).not.toThrow();
      expect(new Date(callArgs.timestamp).toISOString()).toBe(
        callArgs.timestamp
      );
    });

    it("should return uptime as a number", () => {
      // Act
      healthController.getStatus(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(typeof callArgs.uptime).toBe("number");
      expect(callArgs.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getDetails", () => {
    it("should return detailed health information with correct structure", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      expect(mockContext.json).toHaveBeenCalledWith({
        status: "ok",
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        system: {
          memory: {
            total: expect.any(Number),
            used: expect.any(Number),
            external: expect.any(Number),
          },
          cpu: {
            user: expect.any(Number),
            system: expect.any(Number),
          },
          node: {
            version: expect.any(String),
            platform: expect.any(String),
            arch: expect.any(String),
          },
        },
      });
    });

    it('should return status as "ok"', () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.status).toBe("ok");
    });

    it("should return a valid ISO timestamp", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(() => new Date(callArgs.timestamp)).not.toThrow();
      expect(new Date(callArgs.timestamp).toISOString()).toBe(
        callArgs.timestamp
      );
    });

    it("should return uptime as a number", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(typeof callArgs.uptime).toBe("number");
      expect(callArgs.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should return memory information with correct structure", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.system.memory).toHaveProperty("total");
      expect(callArgs.system.memory).toHaveProperty("used");
      expect(callArgs.system.memory).toHaveProperty("external");
      expect(typeof callArgs.system.memory.total).toBe("number");
      expect(typeof callArgs.system.memory.used).toBe("number");
      expect(typeof callArgs.system.memory.external).toBe("number");
    });

    it("should return CPU information with correct structure", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.system.cpu).toHaveProperty("user");
      expect(callArgs.system.cpu).toHaveProperty("system");
      expect(typeof callArgs.system.cpu.user).toBe("number");
      expect(typeof callArgs.system.cpu.system).toBe("number");
    });

    it("should return Node.js information with correct structure", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.system.node).toHaveProperty("version");
      expect(callArgs.system.node).toHaveProperty("platform");
      expect(callArgs.system.node).toHaveProperty("arch");
      expect(typeof callArgs.system.node.version).toBe("string");
      expect(typeof callArgs.system.node.platform).toBe("string");
      expect(typeof callArgs.system.node.arch).toBe("string");
    });

    it("should return actual Node.js version", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.system.node.version).toBe(process.version);
    });

    it("should return actual platform information", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.system.node.platform).toBe(process.platform);
    });

    it("should return actual architecture information", () => {
      // Act
      healthController.getDetails(mockContext as Context);

      // Assert
      const callArgs = (mockContext.json as any).mock.calls[0][0];
      expect(callArgs.system.node.arch).toBe(process.arch);
    });
  });
});
