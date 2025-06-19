// hono
import { Hono } from "hono";

// controllers
import { tomasController } from "./tomas.controller.js";

const tomasRoutes = new Hono();

// Talk with tomas praefatio endpoint
tomasRoutes.post(
  "/talk-with-tomas-praefatio",
  tomasController.talkWithTomasPraefatio
);

export { tomasRoutes };
