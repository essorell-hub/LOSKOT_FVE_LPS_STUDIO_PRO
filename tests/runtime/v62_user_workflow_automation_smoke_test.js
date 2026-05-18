
import assert from "node:assert/strict";
import { USER_WORKFLOW_AUTOMATION_VERSION, createUserWorkflowAutomation, safeUserWorkflowAutomation } from "../../src/runtime/userWorkflowAutomation.js";

assert.equal(USER_WORKFLOW_AUTOMATION_VERSION, "v62-user-workflow-automation");
const engine = createUserWorkflowAutomation();
const project = { id: "PRJ1", name: "Zakázka", site: { address: "Brno" }, fve: { panels: [{ id: "P1" }] } };

assert.equal(engine.listWorkflowSteps().ok, true);
const progress = engine.getProjectProgress(project);
assert.equal(progress.ok, true);
assert.ok(progress.data.percent > 0);

const next = engine.getNextRecommendedAction(project);
assert.equal(next.ok, true);
assert.equal(next.data.completed, false);

const queue = engine.buildCommandQueue(project);
assert.equal(queue.ok, true);
assert.equal(queue.data.classicProUnchanged, true);

const applied = engine.applyWorkflowEvent(project, { key: "test" });
assert.equal(applied.ok, true);
assert.equal(applied.data.eventAccepted, true);

assert.equal(engine.buildOperatorChecklist(project).ok, true);
assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeUserWorkflowAutomation().run("listWorkflowSteps").ok, true);
console.log("v62 user workflow automation smoke test OK");

