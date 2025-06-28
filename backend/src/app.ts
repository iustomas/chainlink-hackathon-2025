// hono
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

// dotenv
import dotenv from "dotenv";

// routes
import { healthRoutes } from "./api/health/health.routes.js";
import { tomasRoutes } from "./api/tomas/tomas.routes.js";
import { fileRoutes } from "./api/file/file.routes.js";
import { conversationRoutes } from "./api/conversation/conversation.routes.js";
import { vaultRoutes } from "./api/vault/vault.routes.js";

// LLM services
import { initializeLLMServices } from "./services/llm/llm.init.js";

// load env
dotenv.config();

// Initialize services
initializeLLMServices();

const app = new Hono();

// middleware - only use logger in non-test environments
if (process.env.NODE_ENV !== "test") {
  app.use("*", logger());
}
app.use("*", cors());
app.use("*", prettyJSON());

// Routes
app.route("/health", healthRoutes);
app.route("/tomas", tomasRoutes);
app.route("/file", fileRoutes);
app.route("/conversation", conversationRoutes);
app.route("/vault", vaultRoutes);

export default app;
