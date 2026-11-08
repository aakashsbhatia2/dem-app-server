import { fromNodeHeaders } from "better-auth/node";

import { ERRORS } from "../constants/errors.js";
import { auth } from "../lib/auth.js";

export async function authenticateSocket(socket, next) {
  const cookie = socket.handshake.auth?.cookie ?? socket.handshake.headers.cookie;
  const headers = fromNodeHeaders({ ...socket.handshake.headers, cookie });
  const session = await auth.api.getSession({ headers }).catch(() => null);

  if (!session) return next(new Error(ERRORS.SIGN_IN_REQUIRED.code));

  socket.data.user = session.user;
  next();
}
