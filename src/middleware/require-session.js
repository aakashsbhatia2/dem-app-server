import { fromNodeHeaders } from "better-auth/node";

import { ERRORS } from "../constants/errors.js";
import { auth } from "../lib/auth.js";
import { sendError } from "../utils/api-error.js";

export async function requireSession(req, res, next) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!session) {
    return sendError(res, ERRORS.SIGN_IN_REQUIRED);
  }

  req.user = session.user;
  next();
}
