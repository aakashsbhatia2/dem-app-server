import { ERRORS } from "../constants/errors.js";
import * as queries from "../db/queries.js";
import { ApiError } from "../utils/api-error.js";
import { validateRouteName, validateRoutePoints } from "../utils/route-input.js";
import { buildStreetRoute } from "./street-route.js";

export async function createUserRoute(userId, input) {
  const route = await prepareRoute(input);
  return queries.createRoute({ userId, ...route });
}

export function listUserRoutes(userId) {
  return queries.listRoutes(userId);
}

export async function getUserRoute(userId, id) {
  const route = await queries.getRoute({ id, userId });
  if (!route) throw new ApiError(ERRORS.ROUTE_NOT_FOUND);
  return route;
}

export async function updateUserRoute(userId, id, input) {
  await getUserRoute(userId, id);
  const route = await prepareRoute(input);
  const updated = await queries.updateRoute({ id, userId, ...route });
  if (!updated) throw new ApiError(ERRORS.ROUTE_NOT_FOUND);
  return updated;
}

export async function deleteUserRoute(userId, id) {
  const deleted = await queries.deleteRoute({ id, userId });
  if (!deleted) throw new ApiError(ERRORS.ROUTE_NOT_FOUND);
}

async function prepareRoute(input) {
  const { name, points, isLoop = false } = input ?? {};
  const inputError = validateRouteName(name) ?? validateRoutePoints(points, isLoop);
  if (inputError) throw new ApiError(inputError);

  const streetRoute = await buildStreetRoute({ points, isLoop });
  return {
    name: name.trim(),
    points,
    path: streetRoute.path,
    distanceMeters: Math.round(streetRoute.distanceMeters),
    isLoop,
  };
}
