import { ERRORS } from "../constants/errors.js";
import * as queries from "../db/queries.js";
import { ApiError } from "../utils/api-error.js";
import { trackDistance } from "../utils/geo.js";
import { toTime, validateRunInput } from "../utils/run-input.js";

export async function createUserRun(userId, input) {
  const inputError = validateRunInput(input);
  if (inputError) throw new ApiError(inputError);

  const { routeId = null, startedAt, finishedAt, durationMs, track } = input;
  const route = await findRunRoute(userId, routeId);
  const cleanTrack = track.map((segment) =>
    segment.map(({ latitude, longitude, timestamp }) => ({ latitude, longitude, timestamp })),
  );

  const run = await queries.createRun({
    userId,
    routeId: route?.id ?? null,
    startedAt: new Date(toTime(startedAt)),
    finishedAt: new Date(toTime(finishedAt)),
    durationMs: Math.round(durationMs),
    distanceMeters: Math.round(trackDistance(cleanTrack)),
    track: cleanTrack,
  });

  return { ...run, routeName: route?.name ?? null };
}

export function listUserRuns(userId) {
  return queries.listRuns(userId);
}

export async function getUserRun(userId, id) {
  const run = await queries.getRun({ id, userId });
  if (!run) throw new ApiError(ERRORS.RUN_NOT_FOUND);
  return run;
}

async function findRunRoute(userId, routeId) {
  if (routeId === null) return null;
  if (typeof routeId !== "string") throw new ApiError(ERRORS.ROUTE_NOT_FOUND);

  const route = await queries.getRunnableRoute({ id: routeId, userId });
  if (!route) throw new ApiError(ERRORS.ROUTE_NOT_FOUND);
  return route;
}
