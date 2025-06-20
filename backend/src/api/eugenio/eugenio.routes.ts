// hono
import { Hono } from "hono";

// controllers
import { eugenioController } from "./eugenio.controller.js";

const eugenioRoutes = new Hono();

eugenioRoutes.post("/just-talk-with-llm", eugenioController.justTalkWithLLM);

export { eugenioRoutes };
