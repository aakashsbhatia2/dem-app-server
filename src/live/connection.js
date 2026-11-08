import { groupRunRoom, LIVE_EVENTS } from "../constants/live-events.js";
import { getGroupRun } from "../services/group-runs.js";

export function handleConnection(socket) {
  socket.on(LIVE_EVENTS.joinGroupRun, (groupRunId, reply) =>
    joinRoom(socket, groupRunId, reply),
  );
  socket.on(LIVE_EVENTS.leaveGroupRun, (groupRunId) => socket.leave(groupRunRoom(groupRunId)));
}

async function joinRoom(socket, groupRunId, reply = () => {}) {
  try {
    const groupRun = await getGroupRun(socket.data.user.id, groupRunId);
    await socket.join(groupRunRoom(groupRun.id));
    reply({ groupRun });
  } catch (error) {
    reply({ error: error.code ?? "INTERNAL_ERROR" });
  }
}
