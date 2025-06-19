import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    silent: false,
    env: {
      NODE_ENV: "test",
    },
    reporters: ["verbose"],
  },
});
