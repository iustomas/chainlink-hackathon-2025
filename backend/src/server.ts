// server
import { serve } from "@hono/node-server";

// app
import app from "./app.js";

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "development";

console.log("\n====================================");
console.log("🚀 Server is up and running!");
console.log(`🌐 Listening on: http://localhost:${port}`);
console.log(`🔧 Environment: ${env}`);
console.log("====================================\n");

serve({
  fetch: app.fetch,
  port: Number(port),
});
