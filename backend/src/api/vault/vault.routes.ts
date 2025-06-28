// hono
import { Hono } from "hono";

// controllers
import { vaultController } from "./vault.controller.js";

const vaultRoutes = new Hono();

// Get user vault files
vaultRoutes.get("/", vaultController.getUserVaultFiles);

export { vaultRoutes };
