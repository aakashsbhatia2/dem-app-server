import { ERRORS } from "../constants/errors.js";
import { MAX_TRACK_POINTS } from "../constants/limits.js";
import { isLatLng } from "./lat-lng.js";

export function validateRunInput(input) {
  const { startedAt, finishedAt, durationMs, track } = input ?? {};

  const start = toTime(startedAt);
  const finish = toTime(finishedAt);
  if (
    start === null ||
    finish === null ||
    finish < start ||
    typeof durationMs !== "number" ||
    !Number.isFinite(durationMs) ||
    durationMs < 0 ||
    durationMs > finish - start
  ) {
    return ERRORS.INVALID_RUN_TIMES;
  }

  if (!Array.isArray(track) || !track.every(isTrackSegment)) return ERRORS.INVALID_TRACK;

  const pointCount = track.reduce((total, segment) => total + segment.length, 0);
  if (pointCount > MAX_TRACK_POINTS) return ERRORS.TRACK_TOO_LONG;

  return null;
}

export function toTime(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function isTrackSegment(segment) {
  return Array.isArray(segment) && segment.every(isTrackPoint);
}

function isTrackPoint(point) {
  return isLatLng(point) && typeof point.timestamp === "number" && Number.isFinite(point.timestamp);
}
