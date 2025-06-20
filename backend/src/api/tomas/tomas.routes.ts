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

// Tomas require help from Eugenio (Our human lawyer)
tomasRoutes.post(
  "/escalate-to-human-lawyer",
  tomasController.escalateToHumanLawyer
);

export { tomasRoutes };
