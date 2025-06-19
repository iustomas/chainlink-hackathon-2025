// Test setup file
import { beforeAll, afterAll } from "vitest";

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = "test";
});

afterAll(() => {
  // Cleanup after all tests
});
