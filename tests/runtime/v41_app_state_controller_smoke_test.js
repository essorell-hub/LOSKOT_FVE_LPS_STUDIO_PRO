import {
  APP_STATE_CONTROLLER_VERSION,
  createAppStateController
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

console.log("Starting v41 App State Controller Smoke Tests...");

runTest("version export", () => {
  assert(APP_STATE_CONTROLLER_VERSION === "v41-app-state-controller", "Version mismatch.");
});

runTest("create controller", () => {
  const controller = createAppStateController({ name: "v41 Test Project" });
  const state = controller.getState();

  assert(state.ok === true, "getState must return ok.");
  assert(state.data.project.name === "v41 Test Project", "Project name mismatch.");
  assert(state.data.ui.classicPro === true, "Classic PRO flag must remain true.");
});

runTest("screen and module change", () => {
  const controller = createAppStateController({ name: "v41 Navigation" });

  const screen = controller.setActiveScreen("cad");
  const module = controller.setSelectedModule("cad");

  assert(screen.ok === true, "setActiveScreen must return ok.");
  assert(module.ok === true, "setSelectedModule must return ok.");
  assert(controller.getState().data.activeScreen === "cad", "Active screen mismatch.");
  assert(controller.getState().data.selectedModule === "cad", "Selected module mismatch.");
});

runTest("project update", () => {
  const controller = createAppStateController({ name: "Before" });

  const result = controller.updateProject({
    name: "After",
    fve: {
      panels: [{ id: "P1" }, { id: "P2" }]
    }
  });

  assert(result.ok === true, "updateProject must return ok.");
  assert(result.data.project.name === "After", "Updated project name mismatch.");
  assert(result.data.project.fve.panels.length === 2, "FVE panels count mismatch.");
});

runTest("selection update", () => {
  const controller = createAppStateController({ name: "Selection" });

  const result = controller.setSelection({
    cadObjectIds: ["C1"],
    fvePanelIds: ["P1", "P2"],
    lpsObjectIds: ["L1"]
  });

  assert(result.ok === true, "setSelection must return ok.");
  assert(result.data.selection.cadObjectIds.length === 1, "CAD selection mismatch.");
  assert(result.data.selection.fvePanelIds.length === 2, "FVE selection mismatch.");
  assert(result.data.selection.lpsObjectIds.length === 1, "LPS selection mismatch.");
});

runTest("ui update preserves Classic PRO", () => {
  const controller = createAppStateController({
    name: "UI",
    ui: {
      classicPro: true
    }
  });

  const result = controller.updateUi({
    classicPro: false,
    inspectorOpen: false
  });

  assert(result.ok === true, "updateUi must return ok.");
  assert(result.data.ui.classicPro === true, "Classic PRO must stay true.");
  assert(result.data.ui.inspectorOpen === false, "Inspector flag mismatch.");
});

runTest("summary", () => {
  const controller = createAppStateController({ name: "Summary" });

  controller.setSelection({
    cadObjectIds: ["C1"],
    fvePanelIds: ["P1"],
    lpsObjectIds: []
  });

  const summary = controller.getSummary();

  assert(summary.ok === true, "getSummary must return ok.");
  assert(summary.data.projectName === "Summary", "Summary project name mismatch.");
  assert(summary.data.classicPro === true, "Summary Classic PRO mismatch.");
  assert(summary.data.selectionCounts.cad === 1, "Summary CAD selection count mismatch.");
});

runTest("subscribe notification", () => {
  const controller = createAppStateController({ name: "Events" });
  let eventCount = 0;

  const unsubscribe = controller.subscribe(() => {
    eventCount += 1;
  });

  controller.setActiveScreen("documents");
  unsubscribe();
  controller.setActiveScreen("export");

  assert(eventCount === 1, "Subscribe/unsubscribe event count mismatch.");
});

console.log("");
console.log("All v41 app state controller smoke tests passed.");
