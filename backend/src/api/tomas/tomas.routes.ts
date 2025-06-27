// hono
import { Hono } from "hono";

// controllers
import { tomasController } from "./tomas.controller.js";

const tomasRoutes = new Hono();

// Talk with tomas praefatio
tomasRoutes.post(
  "/talk-with-tomas-praefatio",
  tomasController.talkWithTomasPraefatio
);

// Scriptum (Cognitio + Investigato + Respondeo)
tomasRoutes.post("/scriptum", tomasController.scriptum);

export { tomasRoutes };
