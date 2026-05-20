import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createProjectCommandBusV842 } from "../../src/runtime/projectCommandBusV842.js";
import { PROJECT_COMMAND_TYPES_V841, createProjectCommandV841 } from "../../src/runtime/projectCommandModelV841.js";
import { runHeadlessProjectPipelineV881 } from "../../src/workflow/headlessProjectPipelineV881.js";

const okProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_ok.json", import.meta.url), "utf8"));
const errorProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_with_errors.json", import.meta.url), "utf8"));

const bus = createProjectCommandBusV842();
const load = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.PROJECT_LOAD, { project: okProject }));
assert.equal(load.ok, true);

const snapshot = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.SNAPSHOT_CREATE, { project: okProject, snapshotId: "integration-snapshot" }));
assert.equal(snapshot.ok, true);

const docs = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.DOCS_BUILD, { project: okProject }));
assert.equal(docs.ok, true);

const pipelineOk = runHeadlessProjectPipelineV881(okProject);
assert.equal(pipelineOk.ok, true);
assert.equal(pipelineOk.operationLog.length, 9);

const pipelineBlocked = runHeadlessProjectPipelineV881(errorProject);
assert.equal(pipelineBlocked.ok, false);
assert.equal(pipelineBlocked.errors.includes("EXPORT_QA_GATE_FAILED") || pipelineBlocked.errors.includes("RELEASE_GATE_CLOSED"), true);

const restore = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.SNAPSHOT_RESTORE, { snapshot: snapshot.data.snapshot }));
assert.equal(restore.ok, true);
assert.equal(restore.data.project.projectId, "orch-ok-001");

console.log("V920_APPLICATION_ORCHESTRATION_INTEGRATION_TEST=PASS");
