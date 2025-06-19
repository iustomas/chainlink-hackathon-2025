// hono
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

// routes
import { healthRoutes } from "./api/health/health.routes.js";

const app = new Hono();

// middleware
app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());

// Routes
app.route("/health", healthRoutes);

export default app;
