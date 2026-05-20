import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createProjectCommandBusV842 } from "../../src/runtime/projectCommandBusV842.js";
import { PROJECT_COMMAND_TYPES_V841, createProjectCommandV841 } from "../../src/runtime/projectCommandModelV841.js";

const sequence = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_command_sequence.json", import.meta.url), "utf8"));
const okProject = JSON.parse(readFileSync(new URL("../fixtures/v821_v920/orchestration_project_ok.json", import.meta.url), "utf8"));

const bus = createProjectCommandBusV842();
for (const command of sequence) {
  const result = bus.execute(command);
  assert.equal(Array.isArray(result.operationLog), true);
}

assert.equal(bus.getHistory().length, sequence.length);
assert.equal(bus.getState().snapshots.length, 1);

const qaBus = createProjectCommandBusV842({ project: okProject });
const qa = qaBus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.QA_RUN_ALL, { project: okProject }));
assert.equal(qa.ok, true);
assert.equal(qa.data.highestSeverity, "NONE");

const bad = qaBus.execute({ type: "UNKNOWN_COMMAND", payload: {} });
assert.equal(bad.ok, false);
assert.equal(bad.errors[0].code, "COMMAND_TYPE_UNKNOWN");

console.log("V841_COMMAND_RUNTIME_TEST=PASS");
