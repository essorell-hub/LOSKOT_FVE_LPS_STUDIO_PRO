
import assert from "node:assert/strict";
import { PROJECT_PACKAGE_BUILDER_VERSION, createProjectPackageBuilder, safeProjectPackageBuilder } from "../../src/runtime/projectPackageBuilder.js";

assert.equal(PROJECT_PACKAGE_BUILDER_VERSION, "v59-project-package-builder");
const builder = createProjectPackageBuilder();

const project = { id: "PRJ1", name: "Zakázka", documents: [{ id: "D1", title: "QA", path: "qa.pdf" }], datasheets: [{ id: "DS1", model: "Panel", path: "panel.pdf" }], qa: { status: "PASS" } };
const manifest = builder.buildPackageManifest(project, { packageType: "CLIENT_HANDOFF" });
assert.equal(manifest.ok, true);
assert.equal(manifest.data.projectId, "PRJ1");

const readiness = builder.validatePackageReadiness(project, {});
assert.equal(readiness.ok, true);
assert.equal(readiness.data.status, "PASS");

const plan = builder.buildExportPlan(project, {});
assert.equal(plan.ok, true);
assert.ok(plan.data.steps.length >= 4);

assert.equal(builder.buildHandoffChecklist(project, {}).ok, true);
assert.equal(builder.run("missing", {}).ok, false);
assert.equal(safeProjectPackageBuilder().run("listPackageTypes").ok, true);

console.log("v59 project package builder smoke test OK");

