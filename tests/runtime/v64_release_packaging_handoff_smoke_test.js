
import assert from "node:assert/strict";
import { RELEASE_PACKAGING_HANDOFF_VERSION, createReleasePackagingHandoff, safeReleasePackagingHandoff } from "../../src/runtime/releasePackagingHandoff.js";

assert.equal(RELEASE_PACKAGING_HANDOFF_VERSION, "v64-release-packaging-handoff");
const engine = createReleasePackagingHandoff();
assert.equal(engine.listReleaseStages().ok, true);

const project = { id: "PRJ1", name: "Zakázka", qa: { status: "PASS" } };
const checklist = engine.buildReleaseChecklist(project, { stage: "INTERNAL_PREVIEW" });
assert.equal(checklist.ok, true);
assert.equal(checklist.data.classicProUnchanged, true);

const readiness = engine.validateReleaseReadiness(project, { stage: "INTERNAL_PREVIEW" });
assert.equal(readiness.ok, true);
assert.equal(readiness.data.status, "PASS");

const manifest = engine.buildReleaseManifest(project, { stage: "INTERNAL_PREVIEW" });
assert.equal(manifest.ok, true);
assert.equal(manifest.data.projectId, "PRJ1");

const plan = engine.buildWindowsHandoffPlan(project);
assert.equal(plan.ok, true);
assert.ok(plan.data.steps.length >= 5);

assert.equal(engine.getReleaseSummary(project, { stage: "INTERNAL_PREVIEW" }).ok, true);
assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeReleasePackagingHandoff().run("listReleaseStages").ok, true);
console.log("v64 release packaging handoff smoke test OK");

