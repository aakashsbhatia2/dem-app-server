import { ERRORS } from "../constants/errors.js";
import { MAX_GROUP_RUN_INVITES } from "../constants/limits.js";
import { isLatLng } from "./lat-lng.js";

export function validateGroupRunInput(input) {
  const { routeId, inviteeIds } = input ?? {};
  if (typeof routeId !== "string") return ERRORS.ROUTE_NOT_FOUND;
  if (
    !Array.isArray(inviteeIds) ||
    inviteeIds.length === 0 ||
    inviteeIds.length > MAX_GROUP_RUN_INVITES ||
    !inviteeIds.every((id) => typeof id === "string")
  ) {
    return ERRORS.INVALID_INVITEES;
  }
  return null;
}

export function validateLocation(input) {
  if (
    !isLatLng(input) ||
    !isFiniteNumber(input.timestamp) ||
    !isFiniteNumber(input.distanceMeters) ||
    input.distanceMeters < 0
  ) {
    return ERRORS.INVALID_LOCATION;
  }
  return null;
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
