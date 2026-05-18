
import assert from "node:assert/strict";
import { ERROR_RECOVERY_DIAGNOSTICS_VERSION, createErrorRecoveryDiagnostics, safeErrorRecoveryDiagnostics } from "../../src/runtime/errorRecoveryDiagnostics.js";

assert.equal(ERROR_RECOVERY_DIAGNOSTICS_VERSION, "v63-error-recovery-diagnostics");
const engine = createErrorRecoveryDiagnostics();

assert.equal(engine.listErrorPatterns().ok, true);
const pass = engine.scanLogText("all good");
assert.equal(pass.ok, true);
assert.equal(pass.data.status, "PASS");

const fail = engine.scanLogText("ReferenceError: x is not defined");
assert.equal(fail.ok, true);
assert.equal(fail.data.status, "FAIL");

const snapshot = engine.buildDiagnosticSnapshot({ project: { id: "P1", fve: { panels: [{ id: "P" }] } }, modules: { fve: { status: "READY" } } });
assert.equal(snapshot.ok, true);
assert.equal(snapshot.data.counts.fvePanels, 1);

assert.equal(engine.buildRecoveryPlan(fail.data).ok, true);
assert.equal(engine.wrapModuleResult({ ok: true, data: 1 }).ok, true);
assert.equal(engine.getWhiteScreenGuardStatus({}).data.safeRenderRequired, true);
assert.equal(engine.run("missing", {}).ok, false);
assert.equal(safeErrorRecoveryDiagnostics().run("listErrorPatterns").ok, true);
console.log("v63 error recovery diagnostics smoke test OK");

