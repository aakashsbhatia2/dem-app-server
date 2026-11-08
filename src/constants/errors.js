import {
  JSON_BODY_LIMIT,
  MAX_GROUP_RUN_INVITES,
  MAX_ROUTE_NAME_LENGTH,
  MAX_ROUTE_POINTS,
  MAX_TRACK_POINTS,
  MIN_LOOP_POINTS,
  MIN_ROUTE_POINTS,
} from "./limits.js";

export const ERRORS = {
  GROUP_RUN_NOT_FOUND: {
    code: "GROUP_RUN_NOT_FOUND",
    status: 404,
    message: "Group run not found",
  },
  INVALID_INVITEES: {
    code: "INVALID_INVITEES",
    status: 400,
    message: `Invite between 1 and ${MAX_GROUP_RUN_INVITES} people you follow`,
  },
  GROUP_RUN_HOST_ONLY: {
    code: "GROUP_RUN_HOST_ONLY",
    status: 403,
    message: "Only the host can do this",
  },
  HOST_CANNOT_DECLINE: {
    code: "HOST_CANNOT_DECLINE",
    status: 400,
    message: "The host can't decline their own group run",
  },
  GROUP_RUN_ALREADY_STARTED: {
    code: "GROUP_RUN_ALREADY_STARTED",
    status: 409,
    message: "This group run has already started",
  },
  GROUP_RUN_FINISHED: {
    code: "GROUP_RUN_FINISHED",
    status: 409,
    message: "This group run has finished",
  },
  GROUP_RUN_NOT_RUNNING: {
    code: "GROUP_RUN_NOT_RUNNING",
    status: 409,
    message: "This group run isn't running",
  },
  GROUP_RUN_NOT_JOINED: {
    code: "GROUP_RUN_NOT_JOINED",
    status: 403,
    message: "Join this group run first",
  },
  INVALID_LOCATION: {
    code: "INVALID_LOCATION",
    status: 400,
    message: "Send a latitude, longitude, timestamp and distance",
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    status: 404,
    message: "User not found",
  },
  CANNOT_FOLLOW_SELF: {
    code: "CANNOT_FOLLOW_SELF",
    status: 400,
    message: "You can't follow yourself",
  },
  SEARCH_QUERY_REQUIRED: {
    code: "SEARCH_QUERY_REQUIRED",
    status: 400,
    message: "Type a name or username to search",
  },
  RUN_NOT_FOUND: {
    code: "RUN_NOT_FOUND",
    status: 404,
    message: "Run not found",
  },
  INVALID_RUN_TIMES: {
    code: "INVALID_RUN_TIMES",
    status: 400,
    message: "Send a valid start time, finish time and moving time",
  },
  INVALID_TRACK: {
    code: "INVALID_TRACK",
    status: 400,
    message: "The track must be a list of sections of points with a latitude, longitude and timestamp",
  },
  TRACK_TOO_LONG: {
    code: "TRACK_TOO_LONG",
    status: 400,
    message: `A run can have up to ${MAX_TRACK_POINTS} points`,
  },
  BODY_TOO_LARGE: {
    code: "BODY_TOO_LARGE",
    status: 413,
    message: `Requests can be up to ${JSON_BODY_LIMIT}`,
  },
  SIGN_IN_REQUIRED: {
    code: "SIGN_IN_REQUIRED",
    status: 401,
    message: "Sign in required",
  },
  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    status: 404,
    message: "Route not found",
  },
  INVALID_POINTS: {
    code: "INVALID_POINTS",
    status: 400,
    message: `Send between ${MIN_ROUTE_POINTS} and ${MAX_ROUTE_POINTS} points`,
  },
  INVALID_POINT: {
    code: "INVALID_POINT",
    status: 400,
    message: "Each point needs a latitude and longitude",
  },
  INVALID_LOOP_FLAG: {
    code: "INVALID_LOOP_FLAG",
    status: 400,
    message: "isLoop must be true or false",
  },
  LOOP_TOO_SHORT: {
    code: "LOOP_TOO_SHORT",
    status: 400,
    message: `A loop needs at least ${MIN_LOOP_POINTS} points`,
  },
  ROUTE_NAME_REQUIRED: {
    code: "ROUTE_NAME_REQUIRED",
    status: 400,
    message: "Give the route a name",
  },
  ROUTE_NAME_TOO_LONG: {
    code: "ROUTE_NAME_TOO_LONG",
    status: 400,
    message: `Route names can be up to ${MAX_ROUTE_NAME_LENGTH} characters`,
  },
  NO_WALKING_ROUTE: {
    code: "NO_WALKING_ROUTE",
    status: 502,
    message: "No walking route found between these two points",
  },
  GOOGLE_ROUTES_TIMEOUT: {
    code: "GOOGLE_ROUTES_TIMEOUT",
    status: 502,
    message: "Google Routes timed out",
  },
  GOOGLE_ROUTES_FAILED: {
    code: "GOOGLE_ROUTES_FAILED",
    status: 502,
    message: "Google Routes failed",
  },
  SERVER_MISCONFIGURED: {
    code: "SERVER_MISCONFIGURED",
    status: 500,
    message: "GOOGLE_ROUTES_API_KEY is not set",
  },
  INVALID_JSON: {
    code: "INVALID_JSON",
    status: 400,
    message: "Request body must be valid JSON",
  },
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: 500,
    message: "Something went wrong",
  },
};

export const BETTER_AUTH_ERROR_CODES = [
  "INVALID_EMAIL",
  "INVALID_EMAIL_OR_PASSWORD",
  "USER_ALREADY_EXISTS",
  "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
  "PASSWORD_TOO_SHORT",
  "PASSWORD_TOO_LONG",
  "MISSING_FIELD",
  "FAILED_TO_CREATE_USER",
  "FAILED_TO_CREATE_SESSION",
  "FAILED_TO_GET_SESSION",
  "SESSION_EXPIRED",
  "INVALID_ORIGIN",
  "MISSING_OR_NULL_ORIGIN",
];
