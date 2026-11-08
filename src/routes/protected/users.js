import { Router } from "express";

import {
  followUser,
  listFollowers,
  listFollowing,
  searchForUsers,
  unfollowUser,
} from "../../services/users.js";

const router = Router();

router.get("/search", searchUsers);
router.get("/me/following", getMyFollowing);
router.get("/me/followers", getMyFollowers);
router.post("/:id/follow", follow);
router.delete("/:id/follow", unfollow);

export default router;

async function searchUsers(req, res) {
  res.json(await searchForUsers(req.user.id, req.query.q));
}

async function getMyFollowing(req, res) {
  res.json(await listFollowing(req.user.id));
}

async function getMyFollowers(req, res) {
  res.json(await listFollowers(req.user.id));
}

async function follow(req, res) {
  await followUser(req.user.id, req.params.id);
  res.status(204).end();
}

async function unfollow(req, res) {
  await unfollowUser(req.user.id, req.params.id);
  res.status(204).end();
}
