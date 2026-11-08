import { Router } from "express";

import {
  createUserRoute,
  deleteUserRoute,
  getUserRoute,
  listUserRoutes,
  updateUserRoute,
} from "../../services/routes.js";

const router = Router();

router.post("/", saveRoute);
router.get("/", listMyRoutes);
router.get("/:id", getMyRoute);
router.put("/:id", updateMyRoute);
router.delete("/:id", deleteMyRoute);

export default router;

async function saveRoute(req, res) {
  res.status(201).json(await createUserRoute(req.user.id, req.body));
}

async function listMyRoutes(req, res) {
  res.json(await listUserRoutes(req.user.id));
}

async function getMyRoute(req, res) {
  res.json(await getUserRoute(req.user.id, req.params.id));
}

async function updateMyRoute(req, res) {
  res.json(await updateUserRoute(req.user.id, req.params.id, req.body));
}

async function deleteMyRoute(req, res) {
  await deleteUserRoute(req.user.id, req.params.id);
  res.status(204).end();
}
