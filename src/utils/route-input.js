import { ERRORS } from "../constants/errors.js";
import {
  MAX_ROUTE_NAME_LENGTH,
  MAX_ROUTE_POINTS,
  MIN_LOOP_POINTS,
  MIN_ROUTE_POINTS,
} from "../constants/limits.js";
import { isLatLng } from "./lat-lng.js";

export function validateRoutePoints(points, isLoop) {
  if (
    !Array.isArray(points) ||
    points.length < MIN_ROUTE_POINTS ||
    points.length > MAX_ROUTE_POINTS
  ) {
    return ERRORS.INVALID_POINTS;
  }
  if (!points.every(isLatLng)) return ERRORS.INVALID_POINT;
  if (typeof isLoop !== "boolean") return ERRORS.INVALID_LOOP_FLAG;
  if (isLoop && points.length < MIN_LOOP_POINTS) return ERRORS.LOOP_TOO_SHORT;
  return null;
}

export function validateRouteName(name) {
  if (typeof name !== "string" || name.trim().length === 0) return ERRORS.ROUTE_NAME_REQUIRED;
  if (name.trim().length > MAX_ROUTE_NAME_LENGTH) return ERRORS.ROUTE_NAME_TOO_LONG;
  return null;
}
