import { ERRORS } from "../constants/errors.js";
import { MAX_SEARCH_QUERY_LENGTH, MAX_SEARCH_RESULTS } from "../constants/limits.js";
import * as queries from "../db/queries.js";
import { ApiError } from "../utils/api-error.js";

export function searchForUsers(userId, rawQuery) {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) throw new ApiError(ERRORS.SEARCH_QUERY_REQUIRED);

  return queries.searchUsers({ query, viewerId: userId, limit: MAX_SEARCH_RESULTS });
}

export async function followUser(userId, targetId) {
  await ensureFollowable(userId, targetId);
  await queries.followUser({ followerId: userId, followingId: targetId });
}

export async function unfollowUser(userId, targetId) {
  await queries.unfollowUser({ followerId: userId, followingId: targetId });
}

export function listFollowing(userId) {
  return queries.listFollowing(userId);
}

export function listFollowers(userId) {
  return queries.listFollowers(userId);
}

async function ensureFollowable(userId, targetId) {
  if (targetId === userId) throw new ApiError(ERRORS.CANNOT_FOLLOW_SELF);
  if (!(await queries.userExists(targetId))) throw new ApiError(ERRORS.USER_NOT_FOUND);
}

function normalizeSearchQuery(rawQuery) {
  if (typeof rawQuery !== "string") return "";
  return rawQuery.trim().replace(/^@/, "").replace(/\s+/g, " ").slice(0, MAX_SEARCH_QUERY_LENGTH);
}
