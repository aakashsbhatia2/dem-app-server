import { toNodeHandler } from "better-auth/node";
import express from "express";

import { JSON_BODY_LIMIT } from "./constants/limits.js";
import { auth } from "./lib/auth.js";
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
