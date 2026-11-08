import { createServer } from "node:http";

import { toNodeHandler } from "better-auth/node";
import express from "express";

import { JSON_BODY_LIMIT } from "./constants/limits.js";
import { auth } from "./lib/auth.js";
import { attachLiveServer } from "./live/live-server.js";
import { errorHandler } from "./middleware/error-handler.js";
import protectedRoutes from "./routes/protected/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: JSON_BODY_LIMIT }));

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", protectedRoutes);

app.use(errorHandler);

const server = createServer(app);
attachLiveServer(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
