import { ERRORS } from "../constants/errors.js";
import { ApiError } from "../utils/api-error.js";

const GOOGLE_ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
const GOOGLE_FIELDS = "routes.distanceMeters,routes.polyline.geoJsonLinestring";
const TRAVEL_MODE = "WALK";
const POLYLINE_FORMAT = "GEO_JSON_LINESTRING";
const REQUEST_TIMEOUT_MS = 10_000;

export async function fetchWalkingRoute({ from, to }, apiKey) {
  const response = await requestGoogleRoute(from, to, apiKey);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(ERRORS.GOOGLE_ROUTES_FAILED, data?.error?.message);
  }

  const route = data?.routes?.[0];
  const coordinates = route?.polyline?.geoJsonLinestring?.coordinates;
  if (!coordinates || route?.distanceMeters == null) {
    throw new ApiError(ERRORS.NO_WALKING_ROUTE);
  }

  return {
    path: coordinates.map(([longitude, latitude]) => ({ latitude, longitude })),
    distanceMeters: route.distanceMeters,
  };
}

async function requestGoogleRoute(from, to, apiKey) {
  try {
    return await fetch(GOOGLE_ROUTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": GOOGLE_FIELDS,
      },
      body: JSON.stringify({
        origin: toWaypoint(from),
        destination: toWaypoint(to),
        travelMode: TRAVEL_MODE,
        polylineEncoding: POLYLINE_FORMAT,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error.name === "TimeoutError") throw new ApiError(ERRORS.GOOGLE_ROUTES_TIMEOUT);
    throw new ApiError(ERRORS.GOOGLE_ROUTES_FAILED);
  }
}

function toWaypoint({ latitude, longitude }) {
  return { location: { latLng: { latitude, longitude } } };
}
