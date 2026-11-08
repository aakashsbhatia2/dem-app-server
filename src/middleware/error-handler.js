import { ERRORS } from "../constants/errors.js";
import { ApiError, sendError } from "../utils/api-error.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof ApiError) return sendError(res, error);
  if (error.type === "entity.parse.failed") return sendError(res, ERRORS.INVALID_JSON);
  if (error.type === "entity.too.large") return sendError(res, ERRORS.BODY_TOO_LARGE);

  console.error(error);
  sendError(res, ERRORS.INTERNAL_ERROR);
}
