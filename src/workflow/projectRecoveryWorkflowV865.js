import { createProjectSnapshot } from "../app/projectApplicationServiceV821.js";

export function runProjectRecoveryWorkflowV865(project = {}, snapshot = null) {
  const recoveredProject = snapshot?.project || project;
  const recoverySnapshot = createProjectSnapshot(recoveredProject, { snapshotId: "recovery-v865" });
  return {
    ok: Boolean(recoveredProject),
    data: {
      project: recoveredProject,
      recoverySnapshot,
      restoredFromSnapshot: Boolean(snapshot?.project)
    },
    warnings: snapshot?.project ? [] : ["RECOVERY_USED_CURRENT_PROJECT"],
    errors: [],
    qaFindings: [],
    operationLog: [{ step: "recovery", ok: Boolean(recoveredProject) }]
  };
}
