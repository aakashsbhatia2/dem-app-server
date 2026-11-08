import { Server } from "socket.io";

import { authenticateSocket } from "../middleware/authenticate-socket.js";
import { handleConnection } from "./connection.js";
import { setLiveServer } from "./emitter.js";

export function attachLiveServer(httpServer) {
  const io = new Server(httpServer);
  io.use(authenticateSocket);
  io.on("connection", handleConnection);
  setLiveServer(io);
}
