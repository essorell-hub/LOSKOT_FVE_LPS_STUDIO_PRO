import {
  FVE_PANEL_EDITOR_VERSION,
  createRuntimeBootstrap,
  createFvePanelEditor,
  safeFvePanelEditor
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
    projectId: "v44-fve-editor-project",
    name: "v44 FVE Panel Editor Smoke",
    fve: {
      panels: [
        { id: "P1", x: 10, y: 20, row: 1, col: 1, wattPeak: 450 },
        { id: "P2", x: 40, y: 20, row: 1, col: 2, wattPeak: 450 },
        { id: "P3", x: 10, y: 70, row: 2, col: 1, wattPeak: 450 },
        { id: "P4", position: { x: 40, y: 70 }, row: 2, col: 2, wattPeak: 450 }
      ],
      strings: [],
      inverters: [],
      dcRoutes: []
    }
  };
}

console.log("Starting v44 FVE Panel Editor Smoke Tests...");

runTest("version export", () => {
  assert(FVE_PANEL_EDITOR_VERSION === "v44-fve-panel-editor", "FVE panel editor version mismatch.");
});

runTest("create editor from runtime bootstrap", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  assert(bootstrap.ok === true, "Bootstrap must return ok.");
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });
  const list = editor.listPanels();
  assert(list.ok === true, "listPanels must return ok.");
  assert(list.data.panelCount === 4, "Panel count mismatch.");
  assert(list.data.panels[3].x === 40, "Panel position normalization mismatch.");
});

runTest("select panels replace/add/remove/toggle", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });

  const replace = editor.selectPanels({ panelIds: ["P1", "P2"] });
  assert(replace.ok === true, "selectPanels replace must return ok.");
  assert(replace.data.selectedCount === 2, "replace selection count mismatch.");

  const add = editor.selectPanels({ panelIds: ["P3"], mode: "add" });
  assert(add.data.selectedPanelIds.join(",") === "P1,P2,P3", "add selection mismatch.");

  const remove = editor.selectPanels({ panelIds: ["P2"], mode: "remove" });
  assert(remove.data.selectedPanelIds.join(",") === "P1,P3", "remove selection mismatch.");

  const toggle = editor.selectPanels({ panelIds: ["P3", "P4"], mode: "toggle" });
  assert(toggle.data.selectedPanelIds.join(",") === "P1,P4", "toggle selection mismatch.");
});

runTest("select all and move selected panels", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });

  const selectAll = editor.selectAllPanels();
  assert(selectAll.ok === true, "selectAllPanels must return ok.");
  assert(selectAll.data.selectedCount === 4, "selectAllPanels count mismatch.");

  const moved = editor.moveSelection({ dx: 5, dy: -10 });
  assert(moved.ok === true, "moveSelection must return ok.");
  assert(moved.data.movedCount === 4, "moveSelection count mismatch.");

  const state = bootstrap.data.controller.getState();
  const panel = state.data.project.fve.panels.find((item) => item.id === "P1");
  assert(panel.x === 15, "Moved panel x mismatch.");
  assert(panel.y === 10, "Moved panel y mismatch.");
});

runTest("move explicit panel ids keeps structured warnings", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });

  const moved = editor.movePanels({ panelIds: ["P2", "PX"], dx: -10, dy: 30 });
  assert(moved.ok === true, "movePanels with missing ids must keep ok for existing panels.");
  assert(moved.data.movedPanelIds.join(",") === "P2", "Explicit moved ids mismatch.");
  assert(moved.warnings.length === 1, "Missing panel warning expected.");

  const state = bootstrap.data.controller.getState();
  const panel = state.data.project.fve.panels.find((item) => item.id === "P2");
  assert(panel.x === 30, "Explicit moved panel x mismatch.");
  assert(panel.y === 50, "Explicit moved panel y mismatch.");
});

runTest("prepare strings from all panels", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });

  const prepared = editor.prepareStrings({ stringPrefix: "ST", maxPanelsPerString: 2 });
  assert(prepared.ok === true, "prepareStrings must return ok.");
  assert(prepared.data.stringCount === 2, "Prepared string count mismatch.");
  assert(prepared.data.strings[0].id === "ST1", "First string id mismatch.");
  assert(prepared.data.strings[0].panelIds.join(",") === "P1,P2", "First string panel order mismatch.");
  assert(prepared.data.strings[1].panelIds.join(",") === "P3,P4", "Second string panel order mismatch.");

  const state = bootstrap.data.controller.getState();
  assert(state.data.project.fve.strings.length === 2, "Runtime project string count mismatch.");
  assert(state.data.project.fve.panels.find((panel) => panel.id === "P4").stringId === "ST2", "Panel stringId mismatch.");
});

runTest("clear selection", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });

  editor.selectAllPanels();
  const cleared = editor.clearSelection();
  assert(cleared.ok === true, "clearSelection must return ok.");
  assert(cleared.data.selectedCount === 0, "clearSelection count mismatch.");
});

runTest("invalid move returns structured error", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const editor = createFvePanelEditor({ controller: bootstrap.data.controller });

  const invalid = editor.movePanels({ panelIds: ["P1"], dx: "bad", dy: 1 });
  assert(invalid.ok === false, "Invalid move must return ok=false.");
  assert(Array.isArray(invalid.errors), "Invalid move must return errors array.");
  assert(invalid.errors[0].message.includes("finite dx and dy"), "Invalid move error message mismatch.");
});

runTest("safe editor wrapper and unsupported action", () => {
  const safe = safeFvePanelEditor({ project: createProject() });
  assert(safe.ok === true, "safeFvePanelEditor must return ok.");
  assert(safe.data.editor.version === FVE_PANEL_EDITOR_VERSION, "safeFvePanelEditor version mismatch.");

  const unsupported = safe.data.editor.run("unsupportedAction", {});
  assert(unsupported.ok === false, "Unsupported action must return ok=false.");
  assert(unsupported.errors[0].message.includes("Unsupported FVE panel editor action"), "Unsupported action error mismatch.");
});

runTest("broken controller never throws white screen error", () => {
  const editor = createFvePanelEditor({ controller: {} });
  const result = editor.listPanels();
  assert(result.ok === false, "Broken controller must return ok=false.");
  assert(Array.isArray(result.errors), "Broken controller must return errors array.");
  assert(result.errors[0].message.includes("getState"), "Broken controller error message mismatch.");
});

runTest("throwing controller returns structured error", () => {
  const editor = createFvePanelEditor({
    controller: {
      getState() {
        throw new Error("Injected FVE editor state failure");
      }
    }
  });
  const result = editor.listPanels();
  assert(result.ok === false, "Throwing controller must return ok=false.");
  assert(result.errors[0].message.includes("Injected FVE editor state failure"), "Throwing controller error mismatch.");
});

console.log("");
console.log("All v44 FVE panel editor smoke tests passed.");
