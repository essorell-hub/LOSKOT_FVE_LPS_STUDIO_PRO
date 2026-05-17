import {
  RUNTIME_BRIDGE_VERSION,
  createRuntimeResult,
  createRuntimeError,
  safeRuntimeCall,
  normalizeRuntimeProject,
  createRuntimeState,
  updateRuntimeProject,
  getRuntimeModuleSummary,
  createModuleRuntimeAdapter,
  createRuntimeBridge
} from "../../src/runtime/index.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runTest(name, fn) {
  console.log(`--- Running Test: ${name} ---`);
  const result = await fn();
  console.log(`--- Test Passed: ${name} ---`);
  return result;
}

console.log("Starting v40 Runtime Bridge Smoke Tests...");

await runTest("Runtime version", async () => {
  assert(RUNTIME_BRIDGE_VERSION === "v40-runtime-bridge", "Runtime version mismatch.");
});

await runTest("createRuntimeResult success", async () => {
  const result = createRuntimeResult({
    module: "test",
    action: "success",
    data: { value: 1 }
  });

  assert(result.ok === true, "Runtime result must be ok.");
  assert(result.data.value === 1, "Runtime result data mismatch.");
  assert(Array.isArray(result.warnings), "Warnings must be an array.");
  assert(Array.isArray(result.errors), "Errors must be an array.");
});

await runTest("createRuntimeError", async () => {
  const result = createRuntimeError(new Error("Test error"), {
    module: "test",
    action: "error"
  });

  assert(result.ok === false, "Runtime error must not be ok.");
  assert(result.errors.length === 1, "Runtime error must contain one error.");
});

await runTest("safeRuntimeCall success", async () => {
  const result = await safeRuntimeCall(
    {
      module: "test",
      action: "safe"
    },
    () => ({ hello: "world" })
  );

  assert(result.ok === true, "safeRuntimeCall must return ok.");
  assert(result.data.hello === "world", "safeRuntimeCall data mismatch.");
});

await runTest("safeRuntimeCall failure", async () => {
  const result = await safeRuntimeCall(
    {
      module: "test",
      action: "fail"
    },
    () => {
      throw new Error("Expected failure");
    }
  );

  assert(result.ok === false, "safeRuntimeCall failure must return ok=false.");
  assert(result.errors.length === 1, "safeRuntimeCall failure must include error.");
});

await runTest("normalizeRuntimeProject", async () => {
  const project = normalizeRuntimeProject({
    name: "Runtime Test Project"
  });

  assert(project.projectId, "Project must have projectId.");
  assert(project.name === "Runtime Test Project", "Project name mismatch.");
  assert(Array.isArray(project.fve.panels), "FVE panels must be array.");
  assert(Array.isArray(project.cad.layers), "CAD layers must be array.");
  assert(Array.isArray(project.lps.objects), "LPS objects must be array.");
});

await runTest("createRuntimeState", async () => {
  const result = createRuntimeState({
    name: "Runtime State Project"
  });

  assert(result.ok === true, "Runtime state result must be ok.");
  assert(result.data.project.name === "Runtime State Project", "Runtime state project name mismatch.");
  assert(result.data.modules.fve.enabled === true, "FVE module must be enabled.");
  assert(result.data.modules.lps.riskAssessmentNormative === false, "LPS risk must remain placeholder.");
});

await runTest("updateRuntimeProject", async () => {
  const state = createRuntimeState({
    name: "Before"
  }).data;

  const result = updateRuntimeProject(state, {
    name: "After",
    fve: {
      panels: [{ id: "P1" }]
    }
  });

  assert(result.ok === true, "Project update must be ok.");
  assert(result.data.project.name === "After", "Project name must be updated.");
  assert(result.data.project.fve.panels.length === 1, "FVE panels must be updated.");
});

await runTest("getRuntimeModuleSummary", async () => {
  const state = createRuntimeState({
    name: "Summary Project",
    fve: {
      panels: [{ id: "P1" }, { id: "P2" }]
    },
    cad: {
      layers: [{ id: "L1" }],
      objects: [{ id: "O1" }]
    },
    lps: {
      objects: [{ id: "A1" }]
    }
  }).data;

  const result = getRuntimeModuleSummary(state);

  assert(result.ok === true, "Summary must be ok.");
  assert(result.data.counts.fvePanels === 2, "FVE panel count mismatch.");
  assert(result.data.counts.cadLayers === 1, "CAD layer count mismatch.");
  assert(result.data.counts.lpsObjects === 1, "LPS object count mismatch.");
});

await runTest("createModuleRuntimeAdapter", async () => {
  const adapter = createModuleRuntimeAdapter("demo", {
    ping: () => ({ pong: true })
  });

  const result = await adapter.run("ping");

  assert(result.ok === true, "Adapter run must be ok.");
  assert(result.data.pong === true, "Adapter result mismatch.");
  assert(adapter.listActions().includes("ping"), "Adapter action list mismatch.");
});

await runTest("createRuntimeBridge", async () => {
  const bridge = createRuntimeBridge({
    name: "Bridge Project"
  });

  const state = bridge.getState();
  const summary = bridge.getSummary();

  assert(state.ok === true, "Bridge getState must be ok.");
  assert(summary.ok === true, "Bridge summary must be ok.");

  const updated = bridge.setProject({
    name: "Bridge Project Updated"
  });

  assert(updated.ok === true, "Bridge setProject must be ok.");
  assert(bridge.getState().data.project.name === "Bridge Project Updated", "Bridge state update mismatch.");
});

console.log("");
console.log("All v40 runtime bridge smoke tests passed.");
