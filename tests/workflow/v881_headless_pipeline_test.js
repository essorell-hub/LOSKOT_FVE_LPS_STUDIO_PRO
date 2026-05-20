import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHeadlessProjectPipelineV881, runHeadlessProjectPipelineV881 } from "../../src/workflow/headlessProjectPipelineV881.js";

const okProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_ok.json", import.meta.url), "utf8"));
const errorProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_with_errors.json", import.meta.url), "utf8"));

const pipeline = createHeadlessProjectPipelineV881();
assert.equal(pipeline.steps.length, 9);

const okRun = pipeline.run(okProject);
assert.equal(okRun.ok, true);
assert.equal(okRun.releaseGo, true);
assert.equal(okRun.exportReady, true);
assert.equal(okRun.data.steps[0].stepId, "validate-project");
assert.equal(okRun.data.steps[8].stepId, "handoff-snapshot");

const blockedRun = runHeadlessProjectPipelineV881(errorProject);
assert.equal(blockedRun.ok, false);
assert.equal(blockedRun.releaseGo, false);
assert.equal(blockedRun.exportReady, false);
assert.equal(blockedRun.qaFindings.some((finding) => finding.code === "FOREIGN_CONTENT_BLOCKER"), true);
assert.equal(blockedRun.qaFindings.some((finding) => finding.code === "PLACEHOLDER_NORMATIVE_BLOCKER"), true);

console.log("V881_HEADLESS_PIPELINE_TEST=PASS");
