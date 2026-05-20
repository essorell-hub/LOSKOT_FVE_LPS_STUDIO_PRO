import { createProjectSnapshot } from "../app/projectApplicationServiceV821.js";

export function createProjectPipelineHandoffGateV885(project = {}, context = {}) {
  const releaseGo = context.releaseGo === true;
  const snapshot = createProjectSnapshot(project, { snapshotId: context.snapshotId || "handoff-v885" });
  return {
    ok: releaseGo,
    data: {
      releaseGo,
      handoffSnapshot: snapshot
    },
    warnings: releaseGo ? [] : ["HANDOFF_BLOCKED_RELEASE_GATE"],
    errors: [],
    qaFindings: context.qaFindings || []
  };
}
