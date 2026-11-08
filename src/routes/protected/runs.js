import { Router } from "express";

import { createUserRun, getUserRun, listUserRuns } from "../../services/runs.js";

const router = Router();

router.post("/", saveRun);
router.get("/", listMyRuns);
router.get("/:id", getMyRun);

export default router;

async function saveRun(req, res) {
  res.status(201).json(await createUserRun(req.user.id, req.body));
}

async function listMyRuns(req, res) {
  res.json(await listUserRuns(req.user.id));
}

async function getMyRun(req, res) {
  res.json(await getUserRun(req.user.id, req.params.id));
}
