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

export default app;
