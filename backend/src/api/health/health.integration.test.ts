// vitest
import { describe, it, expect } from "vitest";

// supertest
import request from "supertest";

// app
import app from "../../app.js";

describe("Health Endpoints Integration Tests", () => {
  describe("GET /health", () => {
    it("should return 200 status code", async () => {
      // Act
      const response = await app.request("/health");

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return basic health status with correct structure", async () => {
      // Act
      const response = await app.request("/health");
      const body = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("timestamp");
      expect(body).toHaveProperty("uptime");
      expect(body.status).toBe("ok");
      expect(typeof body.timestamp).toBe("string");
      expect(typeof body.uptime).toBe("number");
    });

    it("should return a valid ISO timestamp", async () => {
      // Act
      const response = await app.request("/health");
      const body = await response.json();

      // Assert
      expect(() => new Date(body.timestamp)).not.toThrow();
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
    });

    it("should return uptime as a positive number", async () => {
      // Act
      const response = await app.request("/health");
      const body = await response.json();

      // Assert
      expect(body.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should have correct content type", async () => {
      // Act
      const response = await app.request("/health");

      // Assert
      expect(response.headers.get("content-type")).toContain(
        "application/json"
      );
    });
  });

  describe("GET /health/details", () => {
    it("should return 200 status code", async () => {
      // Act
      const response = await app.request("/health/details");

      // Assert
      expect(response.status).toBe(200);
    });

    it("should return detailed health information with correct structure", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("timestamp");
      expect(body).toHaveProperty("uptime");
      expect(body).toHaveProperty("system");
      expect(body.status).toBe("ok");
    });

    it("should return system information with memory details", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(body.system).toHaveProperty("memory");
      expect(body.system.memory).toHaveProperty("total");
      expect(body.system.memory).toHaveProperty("used");
      expect(body.system.memory).toHaveProperty("external");
      expect(typeof body.system.memory.total).toBe("number");
      expect(typeof body.system.memory.used).toBe("number");
      expect(typeof body.system.memory.external).toBe("number");
    });

    it("should return system information with CPU details", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(body.system).toHaveProperty("cpu");
      expect(body.system.cpu).toHaveProperty("user");
      expect(body.system.cpu).toHaveProperty("system");
      expect(typeof body.system.cpu.user).toBe("number");
      expect(typeof body.system.cpu.system).toBe("number");
    });

    it("should return system information with Node.js details", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(body.system).toHaveProperty("node");
      expect(body.system.node).toHaveProperty("version");
      expect(body.system.node).toHaveProperty("platform");
      expect(body.system.node).toHaveProperty("arch");
      expect(typeof body.system.node.version).toBe("string");
      expect(typeof body.system.node.platform).toBe("string");
      expect(typeof body.system.node.arch).toBe("string");
    });

    it("should return actual Node.js version", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(body.system.node.version).toBe(process.version);
    });

    it("should return actual platform information", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(body.system.node.platform).toBe(process.platform);
    });

    it("should return actual architecture information", async () => {
      // Act
      const response = await app.request("/health/details");
      const body = await response.json();

      // Assert
      expect(body.system.node.arch).toBe(process.arch);
    });

    it("should have correct content type", async () => {
      // Act
      const response = await app.request("/health/details");

      // Assert
      expect(response.headers.get("content-type")).toContain(
        "application/json"
      );
    });
  });

  describe("Error handling", () => {
    it("should return 404 for non-existent endpoint", async () => {
      // Act
      const response = await app.request("/health/non-existent");

      // Assert
      expect(response.status).toBe(404);
    });

    it("should return 404 for root path", async () => {
      // Act
      const response = await app.request("/");

      // Assert
      expect(response.status).toBe(404);
    });
  });
});
