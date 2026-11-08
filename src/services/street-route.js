import { ERRORS } from "../constants/errors.js";
import { ApiError } from "../utils/api-error.js";
import { validateRoutePoints } from "../utils/route-input.js";
import { fetchWalkingRoute } from "./google-routes.js";
import { cacheSegment, getCachedSegment } from "./segment-cache.js";

export async function getStreetRoute(input) {
  const { points, isLoop = false } = input ?? {};
  const inputError = validateRoutePoints(points, isLoop);
  if (inputError) throw new ApiError(inputError);

  return buildStreetRoute({ points, isLoop });
}

export async function buildStreetRoute({ points, isLoop }) {
  const apiKey = getRoutesApiKey();
  const stops = isLoop ? [...points, points[0]] : points;
  const pairs = stops.slice(1).map((to, index) => ({ from: stops[index], to }));

  const segments = await Promise.all(pairs.map((pair) => getSegment(pair, apiKey)));

  return {
    path: joinPaths(segments.map((segment) => segment.path)),
    distanceMeters: segments.reduce((total, segment) => total + segment.distanceMeters, 0),
  };
}

function getRoutesApiKey() {
  const apiKey = process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) throw new ApiError(ERRORS.SERVER_MISCONFIGURED);
  return apiKey;
}

async function getSegment({ from, to }, apiKey) {
  const cached = getCachedSegment(from, to);
  if (cached) return cached;

  const segment = await fetchWalkingRoute({ from, to }, apiKey);
  cacheSegment(from, to, segment);
  return segment;
}

function joinPaths(paths) {
  return paths.flatMap((path, index) => (index === 0 ? path : path.slice(1)));
}
