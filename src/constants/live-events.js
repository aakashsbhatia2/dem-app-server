export const LIVE_EVENTS = {
  joinGroupRun: "group-run:join",
  leaveGroupRun: "group-run:leave",
  membersChanged: "group-run:members",
  started: "group-run:started",
  ended: "group-run:ended",
  runnerMoved: "runner:moved",
};

export const groupRunRoom = (groupRunId) => `group-run:${groupRunId}`;
