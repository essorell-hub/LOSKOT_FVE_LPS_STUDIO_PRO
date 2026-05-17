import {
  FVE_CAD_PANEL_INTERACTION_VERSION,
  createRuntimeBootstrap,
  createFveCadPanelInteractionBridge,
  safeFveCadPanelInteractionBridge
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

function createProject() {
  return {
    projectId: "v45-fve-cad-panel-interaction-project",
    name: "v45 FVE CAD Panel Interaction Smoke",
    fve: {
      panels: [
        { id: "P1", x: 10, y: 20, width: 30, height: 20, row: 1, col: 1, wattPeak: 450 },
        { id: "P2", x: 50, y: 20, width: 30, height: 20, row: 1, col: 2, wattPeak: 450 },
        { id: "P3", x: 10, y: 60, width: 30, height: 20, row: 2, col: 1, wattPeak: 450 },
        { id: "P4", position: { x: 50, y: 60 }, dimensions: { width: 30, height: 20 }, row: 2, col: 2, wattPeak: 450 }
      ],
      strings: [],
      inverters: [],
      dcRoutes: []
    },
    cad: {
      layers: [],
      objects: []
    }
  };
}

function createBridge() {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  assert(bootstrap.ok === true, "Bootstrap must return ok.");
  return createFveCadPanelInteractionBridge({ controller: bootstrap.data.controller });
}

console.log("Starting v45 FVE CAD Panel Interaction Smoke Tests...");

runTest("version export", () => {
  assert(FVE_CAD_PANEL_INTERACTION_VERSION === "v45-fve-cad-panel-interaction", "v45 version mismatch.");
});

runTest("cad view model returns render-safe panel shapes", () => {
  const bridge = createBridge();
  const view = bridge.getCadViewModel();

  assert(view.ok === true, "getCadViewModel must return ok.");
  assert(view.data.classicProUnchanged === true, "Classic PRO guard must stay true.");
  assert(view.data.counts.panels === 4, "Panel shape count mismatch.");
  assert(view.data.layerModel.layers[0].id === "fve-panels", "FVE panel layer missing.");
  assert(view.data.panels[0].cadObjectId === "fve-panel:P1", "CAD object ID mismatch.");
  assert(view.data.panels[3].x === 50, "Position normalization mismatch.");
  assert(view.data.panels[3].width === 30, "Dimension normalization mismatch.");
  assert(view.data.viewBox.width > 0, "ViewBox width must be positive.");
  assert(view.data.uiBindings.fveCadStatusText === "0/4 FVE panelů vybráno", "Initial UI status mismatch.");
});

runTest("hit test finds top panel from CAD coordinates", () => {
  const bridge = createBridge();
  const hit = bridge.hitTestPanel({ x: 55, y: 25 });

  assert(hit.ok === true, "hitTestPanel must return ok.");
  assert(hit.data.hit === true, "hitTestPanel should hit P2.");
  assert(hit.data.panelId === "P2", "hitTestPanel panel mismatch.");

  const miss = bridge.hitTestPanel({ x: 200, y: 200 });
  assert(miss.ok === true, "hitTestPanel miss must still return ok.");
  assert(miss.data.hit === false, "hitTestPanel miss mismatch.");
});

runTest("select at point updates runtime selection and view model", () => {
  const bridge = createBridge();
  const selected = bridge.selectAtPoint({ x: 12, y: 25 });

  assert(selected.ok === true, "selectAtPoint must return ok.");
  assert(selected.data.viewModel.selection.selectedCount === 1, "selectAtPoint count mismatch.");
  assert(selected.data.viewModel.selection.selectedPanelIds[0] === "P1", "selectAtPoint selected ID mismatch.");
  assert(selected.data.viewModel.panels.find((panel) => panel.id === "P1").selected === true, "Selected panel shape flag mismatch.");
});

runTest("rectangle selection supports multi-panel CAD selection", () => {
  const bridge = createBridge();
  const selected = bridge.selectByRectangle({ x1: 0, y1: 0, x2: 95, y2: 45 });

  assert(selected.ok === true, "selectByRectangle must return ok.");
  assert(selected.data.matchedPanelIds.join(",") === "P1,P2", "Rectangle matched panel IDs mismatch.");
  assert(selected.data.viewModel.selection.selectedPanelIds.join(",") === "P1,P2", "Rectangle selected panel IDs mismatch.");
});

runTest("nudge selection moves selected panels through v44 editor", () => {
  const bridge = createBridge();
  bridge.selectByRectangle({ x1: 0, y1: 0, x2: 95, y2: 45 });
  const moved = bridge.nudgeSelection({ direction: "right", amount: 7 });

  assert(moved.ok === true, "nudgeSelection must return ok.");
  const p1 = moved.data.viewModel.panels.find((panel) => panel.id === "P1");
  const p2 = moved.data.viewModel.panels.find((panel) => panel.id === "P2");
  assert(p1.x === 17, "P1 nudge x mismatch.");
  assert(p2.x === 57, "P2 nudge x mismatch.");
});

runTest("drag session moves selected panel and can be ended safely", () => {
  const bridge = createBridge();
  const started = bridge.startDrag({ x: 55, y: 25 });
  assert(started.ok === true, "startDrag must return ok.");
  assert(started.data.dragSession.selectedPanelIds.join(",") === "P2", "startDrag selection mismatch.");

  const dragged = bridge.dragBy({ dx: -5, dy: 10 });
  assert(dragged.ok === true, "dragBy must return ok.");
  const p2 = dragged.data.viewModel.panels.find((panel) => panel.id === "P2");
  assert(p2.x === 45, "dragBy x mismatch.");
  assert(p2.y === 30, "dragBy y mismatch.");

  const ended = bridge.endDrag();
  assert(ended.ok === true, "endDrag must return ok.");
  assert(ended.data.dragActive === false, "endDrag active flag mismatch.");
});

runTest("dragBy without active session returns structured error", () => {
  const bridge = createBridge();
  const dragged = bridge.dragBy({ dx: 1, dy: 1 });

  assert(dragged.ok === false, "dragBy without session must fail structurally.");
  assert(Array.isArray(dragged.errors) && dragged.errors.length === 1, "dragBy error list missing.");
});

runTest("prepare strings from CAD selection updates view model", () => {
  const bridge = createBridge();
  bridge.selectByRectangle({ x1: 0, y1: 0, x2: 95, y2: 85 });
  const prepared = bridge.prepareStringsFromSelection({ stringPrefix: "CAD", maxPanelsPerString: 2 });

  assert(prepared.ok === true, "prepareStringsFromSelection must return ok.");
  assert(prepared.data.viewModel.counts.strings === 2, "Prepared string count mismatch.");
  assert(prepared.data.viewModel.panels.find((panel) => panel.id === "P1").stringId === "CAD1", "P1 string assignment mismatch.");
  assert(prepared.data.viewModel.panels.find((panel) => panel.id === "P4").stringId === "CAD2", "P4 string assignment mismatch.");
});

runTest("UI summary is safe for Classic PRO binding", () => {
  const bridge = createBridge();
  bridge.selectAtPoint({ x: 12, y: 25 });
  const summary = bridge.getUiSummary();

  assert(summary.ok === true, "getUiSummary must return ok.");
  assert(summary.data.classicProUnchanged === true, "UI summary Classic PRO guard mismatch.");
  assert(summary.data.fvePanelCount === 4, "UI panel count mismatch.");
  assert(summary.data.fveSelectionCount === 1, "UI selection count mismatch.");
  assert(summary.data.commandCount >= 8, "UI command count mismatch.");
});

runTest("runCommand dispatches and rejects unsupported commands structurally", () => {
  const bridge = createBridge();
  const view = bridge.runCommand("getCadViewModel");
  assert(view.ok === true, "runCommand getCadViewModel must return ok.");

  const unsupported = bridge.runCommand("missingCommand");
  assert(unsupported.ok === false, "Unsupported runCommand must fail structurally.");
  assert(unsupported.errors[0].message.includes("Unsupported FVE CAD panel interaction command"), "Unsupported command error mismatch.");
});

runTest("safe wrapper returns bridge", () => {
  const safe = safeFveCadPanelInteractionBridge({ project: createProject() });
  assert(safe.ok === true, "safeFveCadPanelInteractionBridge must return ok.");
  assert(safe.data.version === FVE_CAD_PANEL_INTERACTION_VERSION, "safe wrapper version mismatch.");
  assert(typeof safe.data.bridge.getCadViewModel === "function", "safe wrapper bridge missing.");
});

runTest("broken controller does not throw white screen error", () => {
  const bridge = createFveCadPanelInteractionBridge({ controller: {} });
  const view = bridge.getCadViewModel();

  assert(view.ok === false, "Broken controller must return structured failure.");
  assert(Array.isArray(view.errors) && view.errors.length === 1, "Broken controller errors missing.");
});

runTest("throwing controller is converted to structured runtime error", () => {
  const bridge = createFveCadPanelInteractionBridge({
    controller: {
      getState() {
        throw new Error("Injected v45 state failure");
      }
    }
  });
  const view = bridge.getCadViewModel();

  assert(view.ok === false, "Throwing controller must return structured failure.");
  assert(view.errors[0].message === "Injected v45 state failure", "Throwing controller error message mismatch.");
});

console.log("All v45 FVE CAD Panel Interaction smoke tests passed.");
