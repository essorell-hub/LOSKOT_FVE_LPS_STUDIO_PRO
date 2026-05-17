import {
  CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
  createClassicUiRuntimeAdapter
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

console.log("Starting v42 Classic UI Runtime Adapter Smoke Tests...");

runTest("version export", () => {
  assert(CLASSIC_UI_RUNTIME_ADAPTER_VERSION === "v42-classic-ui-runtime-adapter", "Version mismatch.");
});

runTest("create adapter and snapshot", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Classic UI Test"
  });

  const snapshot = adapter.createSnapshot();

  assert(snapshot.ok === true, "Snapshot must return ok.");
  assert(snapshot.data.projectName === "Classic UI Test", "Snapshot project name mismatch.");
  assert(snapshot.data.classicPro === true, "Classic PRO must remain true.");
});

runTest("getValue projectName", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Value Test"
  });

  const result = adapter.getValue("projectName");

  assert(result.ok === true, "getValue must return ok.");
  assert(result.data.value === "Value Test", "getValue projectName mismatch.");
});

runTest("bindText with function target", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Binding Test"
  });

  let value = "";
  const result = adapter.bindText("projectName", (text) => {
    value = text;
  });

  assert(result.ok === true, "bindText must return ok.");
  assert(value === "Binding Test", "Function binding text mismatch.");
});

runTest("bindText with object textContent target", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Object Binding Test"
  });

  const target = { textContent: "" };
  const result = adapter.bindText("projectName", target);

  assert(result.ok === true, "bindText object target must return ok.");
  assert(target.textContent === "Object Binding Test", "Object binding text mismatch.");
});

runTest("dispatch navigate refreshes binding", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Navigation Test"
  });

  const target = { textContent: "" };

  adapter.bindText("activeScreen", target);
  assert(target.textContent === "dashboard", "Initial active screen mismatch.");

  const result = adapter.dispatchUiAction("navigate", {
    screen: "cad"
  });

  assert(result.ok === true, "navigate action must return ok.");
  assert(target.textContent === "cad", "Navigate binding refresh mismatch.");
});

runTest("dispatch updateProject refreshes counts", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Panel Count Test"
  });

  const target = { textContent: "" };

  adapter.bindText("fvePanelCount", target);
  assert(target.textContent === "0", "Initial FVE panel count mismatch.");

  const result = adapter.dispatchUiAction("updateProject", {
    fve: {
      panels: [{ id: "P1" }, { id: "P2" }, { id: "P3" }]
    }
  });

  assert(result.ok === true, "updateProject action must return ok.");
  assert(target.textContent === "3", "Updated FVE panel count mismatch.");
});

runTest("unsupported action returns error", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Error Test"
  });

  const result = adapter.dispatchUiAction("unknownAction", {});

  assert(result.ok === false, "Unsupported action must return ok=false.");
  assert(result.errors.length === 1, "Unsupported action must return one error.");
});

runTest("clear bindings", () => {
  const adapter = createClassicUiRuntimeAdapter({
    name: "Clear Binding Test"
  });

  adapter.bindText("projectName", () => {});
  const result = adapter.clearBindings();

  assert(result.ok === true, "clearBindings must return ok.");
  assert(result.data.bindingCount === 0, "Binding count must be zero.");
});

console.log("");
console.log("All v42 classic UI runtime adapter smoke tests passed.");
