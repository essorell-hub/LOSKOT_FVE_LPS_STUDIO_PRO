import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runProjectCreateWorkflowV861 } from "../../src/workflow/projectCreateWorkflowV861.js";
import { runProjectUpdateWorkflowV862 } from "../../src/workflow/projectUpdateWorkflowV862.js";
import { runProjectFullQaWorkflowV863 } from "../../src/workflow/projectFullQaWorkflowV863.js";
import { runProjectExportWorkflowV864 } from "../../src/workflow/projectExportWorkflowV864.js";
import { runProjectRecoveryWorkflowV865 } from "../../src/workflow/projectRecoveryWorkflowV865.js";

const okProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_ok.json", import.meta.url), "utf8"));
const errorProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_with_errors.json", import.meta.url), "utf8"));

const created = runProjectCreateWorkflowV861({ projectId: "workflow-created" });
assert.equal(created.ok, true);
assert.equal(created.data.project.projectId, "workflow-created");

const updated = runProjectUpdateWorkflowV862(okProject, "documents", { technicalReportReady: true });
assert.equal(updated.ok, true);
assert.equal(updated.data.project.documents.technicalReportReady, true);

const qaOk = runProjectFullQaWorkflowV863(okProject);
assert.equal(qaOk.ok, true);

const qaBlocked = runProjectFullQaWorkflowV863(errorProject);
assert.equal(qaBlocked.ok, false);
assert.equal(qaBlocked.qaFindings.some((finding) => finding.severity === "BLOCKER"), true);

const exported = runProjectExportWorkflowV864(okProject);
assert.equal(exported.ok, true);

const recovered = runProjectRecoveryWorkflowV865(okProject, { snapshotId: "input", project: okProject });
assert.equal(recovered.ok, true);
assert.equal(recovered.data.restoredFromSnapshot, true);

console.log("V861_PROJECT_WORKFLOWS_TEST=PASS");
