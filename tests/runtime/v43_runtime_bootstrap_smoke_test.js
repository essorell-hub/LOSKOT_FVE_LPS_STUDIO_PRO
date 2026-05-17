import {
  RUNTIME_BOOTSTRAP_VERSION,
  createRuntimeBootstrap,
  safeRuntimeBootstrap
} from "../../src/runtime/index.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runTest(name, fn) {
  console.log(`--- Running Test: ${name} ---`);
  const result = fn();
  console.log(`--- Test Passed: ${name} ---`);
  return result;
}

console.log("Starting v43 Safe Runtime Bootstrap Smoke Tests...");

runTest("version export", () => {
  assert(RUNTIME_BOOTSTRAP_VERSION === "v43-safe-runtime-bootstrap", "Runtime bootstrap version mismatch.");
});

runTest("create bootstrap with minimal project", () => {
  const result = createRuntimeBootstrap({ project: { name: "v43 Bootstrap Project" } });
  assert(result.ok === true, "Bootstrap must return ok.");
  assert(result.data.runtimeReady === true, "Runtime must be marked ready.");
  assert(result.data.state.project.name === "v43 Bootstrap Project", "Project name mismatch.");
  assert(result.data.adapters.classicUi.version === "v42-classic-ui-runtime-adapter", "Classic UI adapter version mismatch.");
});

runTest("safeRuntimeBootstrap alias", () => {
  const result = safeRuntimeBootstrap({ project: { name: "v43 Safe Alias" } });
  assert(result.ok === true, "safeRuntimeBootstrap must return ok.");
  assert(result.data.state.project.name === "v43 Safe Alias", "safeRuntimeBootstrap project mismatch.");
});

runTest("classic UI adapter is usable after bootstrap", () => {
  const result = createRuntimeBootstrap({ project: { name: "Adapter Usability" } });
  const adapter = result.data.adapters.classicUi.instance;
  const projectName = adapter.getValue("projectName");
  assert(projectName.ok === true, "Adapter getValue must return ok.");
  assert(projectName.data.value === "Adapter Usability", "Adapter projectName value mismatch.");
});

runTest("controller is usable after bootstrap", () => {
  const result = createRuntimeBootstrap({ project: { name: "Controller Usability" } });
  const controller = result.data.controller;
  const screen = controller.setActiveScreen("cad");
  const state = controller.getState();
  assert(screen.ok === true, "Controller setActiveScreen must return ok.");
  assert(state.data.activeScreen === "cad", "Controller active screen mismatch.");
});

runTest("dispatch UI action through adapter", () => {
  const result = createRuntimeBootstrap({ project: { name: "Adapter Dispatch" } });
  const adapter = result.data.adapters.classicUi.instance;
  const action = adapter.dispatchUiAction("navigate", { screen: "documents" });
  assert(action.ok === true, "Adapter dispatchUiAction must return ok.");
  assert(adapter.getState().data.activeScreen === "documents", "Adapter dispatch active screen mismatch.");
});

runTest("broken controller returns structured error", () => {
  const result = createRuntimeBootstrap({
    controller: { getState() { throw new Error("Injected controller failure"); } },
    project: { name: "Broken Controller" }
  });
  assert(result.ok === false, "Broken controller must return ok=false.");
  assert(Array.isArray(result.errors), "Broken controller must return errors array.");
  assert(result.errors.length === 1, "Broken controller must return one error.");
  assert(result.errors[0].message.includes("Injected controller failure"), "Broken controller error message mismatch.");
});

runTest("missing controller getState returns structured error", () => {
  const result = createRuntimeBootstrap({ controller: {}, project: { name: "Missing getState" } });
  assert(result.ok === false, "Missing getState must return ok=false.");
  assert(result.errors[0].message.includes("getState"), "Missing getState error message mismatch.");
});

console.log("");
console.log("All v43 safe runtime bootstrap smoke tests passed.");
