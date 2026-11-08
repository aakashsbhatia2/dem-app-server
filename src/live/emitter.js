import { groupRunRoom } from "../constants/live-events.js";

let liveServer = null;

export function setLiveServer(server) {
  liveServer = server;
}

export function emitToGroupRun(groupRunId, event, payload) {
  liveServer?.to(groupRunRoom(groupRunId)).emit(event, payload);
}
