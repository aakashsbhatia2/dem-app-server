import { ERRORS } from "../constants/errors.js";
import { GROUP_RUN_STATUS, MEMBER_STATUS } from "../constants/group-runs.js";
import { LIVE_EVENTS } from "../constants/live-events.js";
import * as queries from "../db/queries.js";
import { emitToGroupRun } from "../live/emitter.js";
import { ApiError } from "../utils/api-error.js";
import { validateGroupRunInput, validateLocation } from "../utils/group-run-input.js";

export async function createGroupRun(hostId, input) {
  const inputError = validateGroupRunInput(input);
  if (inputError) throw new ApiError(inputError);

  const route = await queries.getRoute({ id: input.routeId, userId: hostId });
  if (!route) throw new ApiError(ERRORS.ROUTE_NOT_FOUND);

  const inviteeIds = [...new Set(input.inviteeIds)];
  await ensureInvitable(hostId, inviteeIds);

  const id = await queries.createGroupRun({ routeId: route.id, hostId, inviteeIds });
  return getGroupRun(hostId, id);
}

export async function getGroupRun(userId, id) {
  const groupRun = await queries.getGroupRun({ id, userId });
  if (!groupRun) throw new ApiError(ERRORS.GROUP_RUN_NOT_FOUND);

  const members = await queries.listGroupRunMembers(id);
  return { ...groupRun, members };
}

export function listInvites(userId) {
  return queries.listGroupRunInvites(userId);
}

export async function getActiveGroupRun(userId) {
  const id = await queries.findActiveGroupRunId(userId);
  return id ? getGroupRun(userId, id) : null;
}

export async function joinGroupRun(userId, id) {
  const groupRun = await getGroupRun(userId, id);
  if (groupRun.status === GROUP_RUN_STATUS.finished) throw new ApiError(ERRORS.GROUP_RUN_FINISHED);

  await queries.setGroupRunMemberStatus({ groupRunId: id, userId, status: MEMBER_STATUS.joined });
  const updated = await getGroupRun(userId, id);
  emitToGroupRun(id, LIVE_EVENTS.membersChanged, updated.members);
  return updated;
}

export async function declineGroupRun(userId, id) {
  const groupRun = await getGroupRun(userId, id);
  if (groupRun.hostId === userId) throw new ApiError(ERRORS.HOST_CANNOT_DECLINE);

  await queries.setGroupRunMemberStatus({ groupRunId: id, userId, status: MEMBER_STATUS.declined });
  emitToGroupRun(id, LIVE_EVENTS.membersChanged, await queries.listGroupRunMembers(id));
}

export async function startGroupRun(userId, id) {
  const groupRun = await getHostedGroupRun(userId, id);
  if (groupRun.status !== GROUP_RUN_STATUS.waiting) {
    throw new ApiError(ERRORS.GROUP_RUN_ALREADY_STARTED);
  }

  await queries.setGroupRunStatus({ id, status: GROUP_RUN_STATUS.running });
  const updated = await getGroupRun(userId, id);
  emitToGroupRun(id, LIVE_EVENTS.started, updated);
  return updated;
}

export async function endGroupRun(userId, id) {
  const groupRun = await getHostedGroupRun(userId, id);
  if (groupRun.status === GROUP_RUN_STATUS.finished) throw new ApiError(ERRORS.GROUP_RUN_FINISHED);

  await queries.setGroupRunStatus({ id, status: GROUP_RUN_STATUS.finished });
  const updated = await getGroupRun(userId, id);
  emitToGroupRun(id, LIVE_EVENTS.ended, updated);
  return updated;
}

export async function updateLocation(userId, id, input) {
  const inputError = validateLocation(input);
  if (inputError) throw new ApiError(inputError);

  const groupRun = await getGroupRun(userId, id);
  if (groupRun.status !== GROUP_RUN_STATUS.running) {
    throw new ApiError(ERRORS.GROUP_RUN_NOT_RUNNING);
  }
  const me = groupRun.members.find((member) => member.id === userId);
  if (me?.status !== MEMBER_STATUS.joined) throw new ApiError(ERRORS.GROUP_RUN_NOT_JOINED);

  emitToGroupRun(id, LIVE_EVENTS.runnerMoved, {
    userId,
    latitude: input.latitude,
    longitude: input.longitude,
    timestamp: input.timestamp,
    distanceMeters: input.distanceMeters,
  });
}

async function getHostedGroupRun(userId, id) {
  const groupRun = await getGroupRun(userId, id);
  if (groupRun.hostId !== userId) throw new ApiError(ERRORS.GROUP_RUN_HOST_ONLY);
  return groupRun;
}

async function ensureInvitable(hostId, inviteeIds) {
  if (inviteeIds.includes(hostId)) throw new ApiError(ERRORS.INVALID_INVITEES);

  const followingCount = await queries.countFollowing({
    followerId: hostId,
    followingIds: inviteeIds,
  });
  if (followingCount !== inviteeIds.length) throw new ApiError(ERRORS.INVALID_INVITEES);
}
