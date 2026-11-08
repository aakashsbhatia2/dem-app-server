import { Router } from "express";

import { getStreetRoute } from "../../services/street-route.js";

const router = Router();

router.post("/", createStreetRoute);

export default router;

async function createStreetRoute(req, res) {
  res.json(await getStreetRoute(req.body));
}
