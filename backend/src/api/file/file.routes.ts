// hono
import { Hono } from "hono";

// controllers
import { fileController } from "./file.controller.js";

const fileRoutes = new Hono();

// Upload pdf file endpoint
fileRoutes.post("/upload-pdf-file", fileController.uploadPdfFile);

export { fileRoutes };
