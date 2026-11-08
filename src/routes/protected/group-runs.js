import { Router } from "express";

import {
  createGroupRun,
  declineGroupRun,
  endGroupRun,
  getActiveGroupRun,
  getGroupRun,
  joinGroupRun,
  listInvites,
  startGroupRun,
  updateLocation,
} from "../../services/group-runs.js";

const router = Router();

router.post("/", create);
router.get("/invites", getMyInvites);
router.get("/active", getMyActiveGroupRun);
router.get("/:id", getOne);
router.post("/:id/join", join);
router.post("/:id/decline", decline);
router.post("/:id/start", start);
router.post("/:id/end", end);
router.post("/:id/location", sendLocation);

export default router;

async function create(req, res) {
  res.status(201).json(await createGroupRun(req.user.id, req.body));
}

async function getMyInvites(req, res) {
  res.json(await listInvites(req.user.id));
}

async function getMyActiveGroupRun(req, res) {
  res.json(await getActiveGroupRun(req.user.id));
}

async function getOne(req, res) {
  res.json(await getGroupRun(req.user.id, req.params.id));
}

async function join(req, res) {
  res.json(await joinGroupRun(req.user.id, req.params.id));
}

async function decline(req, res) {
  await declineGroupRun(req.user.id, req.params.id);
  res.status(204).end();
}

async function start(req, res) {
  res.json(await startGroupRun(req.user.id, req.params.id));
}

async function end(req, res) {
  res.json(await endGroupRun(req.user.id, req.params.id));
}

async function sendLocation(req, res) {
  await updateLocation(req.user.id, req.params.id, req.body);
  res.status(204).end();
}
