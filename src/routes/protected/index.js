import { Router } from "express";

import { requireSession } from "../../middleware/require-session.js";
import groupRuns from "./group-runs.js";
import routes from "./routes.js";
import runs from "./runs.js";
import streetRoute from "./street-route.js";
import users from "./users.js";

const protectedRoutes = Router();

protectedRoutes.use(requireSession);

protectedRoutes.use("/group-runs", groupRuns);
protectedRoutes.use("/routes", routes);
protectedRoutes.use("/runs", runs);
protectedRoutes.use("/street-route", streetRoute);
protectedRoutes.use("/users", users);

export default protectedRoutes;
