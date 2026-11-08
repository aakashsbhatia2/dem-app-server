import { Router } from "express";

import { requireSession } from "../../middleware/require-session.js";
import routes from "./routes.js";
import runs from "./runs.js";
import streetRoute from "./street-route.js";

const protectedRoutes = Router();

protectedRoutes.use(requireSession);

protectedRoutes.use("/routes", routes);
protectedRoutes.use("/runs", runs);
protectedRoutes.use("/street-route", streetRoute);

export default protectedRoutes;
