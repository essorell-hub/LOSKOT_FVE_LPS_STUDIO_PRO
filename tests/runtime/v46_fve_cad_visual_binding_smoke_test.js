import {
  FVE_CAD_VISUAL_BINDING_VERSION,
  createRuntimeBootstrap,
  createFveCadVisualBinding,
  safeFveCadVisualBinding
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
    projectId: "v46-fve-cad-visual-project",
    name: "v46 FVE CAD Visual Binding Smoke",
    fve: {
      panels: [
        { id: "P1", x: 10, y: 20, row: 1, col: 1, width: 30, height: 18, wattPeak: 450 },
        { id: "P2", x: 50, y: 20, row: 1, col: 2, width: 30, height: 18, wattPeak: 450 },
        { id: "P3", x: 10, y: 55, row: 2, col: 1, width: 30, height: 18, wattPeak: 450 },
        { id: "P4", position: { x: 50, y: 55 }, row: 2, col: 2, width: 30, height: 18, wattPeak: 450 }
      ],
      strings: [],
      inverters: [],
      dcRoutes: []
    }
  };
}

console.log("Starting v46 FVE CAD Visual Binding Smoke Tests...");

runTest("version export", () => {
  assert(FVE_CAD_VISUAL_BINDING_VERSION === "v46-fve-cad-visual-binding", "v46 version mismatch.");
});

runTest("render packet and SVG markup", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  assert(bootstrap.ok === true, "Bootstrap must return ok.");
  const binding = createFveCadVisualBinding({ controller: bootstrap.data.controller });
  const packetResult = binding.getRenderPacket();

  assert(packetResult.ok === true, "getRenderPacket must return ok.");
  assert(packetResult.data.packet.classicProUnchanged === true, "Classic PRO guard mismatch.");
  assert(packetResult.data.packet.panels.length === 4, "Panel count mismatch in render packet.");
  assert(packetResult.data.packet.elements.some((item) => item.type === "rect" && item.panelId === "P1"), "P1 rect not found.");

  const svgResult = binding.getSvgMarkup();
  assert(svgResult.ok === true, "getSvgMarkup must return ok.");
  assert(svgResult.data.svg.includes("<svg"), "SVG root missing.");
  assert(svgResult.data.svg.includes("data-panel-id=\"P1\""), "SVG panel data attribute missing.");
});

runTest("element plan, binding plan and inspector", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const binding = createFveCadVisualBinding({ controller: bootstrap.data.controller });

  const elementPlan = binding.getElementPlan();
  assert(elementPlan.ok === true, "getElementPlan must return ok.");
  assert(elementPlan.data.root.type === "svg", "Element plan root must be svg.");

  const bindingPlan = binding.getEventBindingPlan();
  assert(bindingPlan.ok === true, "getEventBindingPlan must return ok.");
  assert(bindingPlan.data.bindings.length >= 4, "Event binding plan too small.");

  const inspector = binding.getInspectorModel();
  assert(inspector.ok === true, "getInspectorModel must return ok.");
  assert(inspector.data.fields.find((field) => field.key === "fvePanelCount").value === 4, "Inspector panel count mismatch.");
});

runTest("visual panel click action", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const binding = createFveCadVisualBinding({ controller: bootstrap.data.controller });

  const click = binding.dispatchVisualAction("panel.click", { panelId: "P2", mode: "replace" });
  assert(click.ok === true, "Panel click must return ok.");

  const state = bootstrap.data.controller.getState();
  assert(state.data.selection.fvePanelIds.join(",") === "P2", "Panel click selection mismatch.");
});

runTest("visual rectangle selection and nudge", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const binding = createFveCadVisualBinding({ controller: bootstrap.data.controller });

  const select = binding.dispatchVisualAction("selection.rectangle", {
    left: 0,
    top: 0,
    right: 90,
    bottom: 42,
    mode: "replace"
  });
  assert(select.ok === true, "Rectangle selection must return ok.");

  let state = bootstrap.data.controller.getState();
  assert(state.data.selection.fvePanelIds.join(",") === "P1,P2", "Rectangle selection mismatch.");

  const nudge = binding.dispatchVisualAction("selection.nudge", { direction: "right", amount: 10 });
  assert(nudge.ok === true, "Nudge selection must return ok.");

  state = bootstrap.data.controller.getState();
  const p1 = state.data.project.fve.panels.find((panel) => panel.id === "P1");
  const p2 = state.data.project.fve.panels.find((panel) => panel.id === "P2");
  assert(p1.x === 20, "P1 nudge x mismatch.");
  assert(p2.x === 60, "P2 nudge x mismatch.");
});

runTest("drag flow and string preparation", () => {
  const bootstrap = createRuntimeBootstrap({ project: createProject() });
  const binding = createFveCadVisualBinding({ controller: bootstrap.data.controller });

  const select = binding.dispatchVisualAction("selection.rectangle", {
    left: 0,
    top: 0,
    right: 90,
    bottom: 100,
    mode: "replace"
  });
  assert(select.ok === true, "Select all by rectangle must return ok.");

  const start = binding.dispatchVisualAction("cad.pointer.down", {
    x: 15,
    y: 25,
    selectFromPoint: false
  });
  assert(start.ok === true, "Drag start must return ok.");

  const drag = binding.dispatchVisualAction("cad.pointer.move", { dx: 5, dy: 5 });
  assert(drag.ok === true, "Drag move must return ok.");

  const end = binding.dispatchVisualAction("cad.pointer.up", {});
  assert(end.ok === true, "Drag end must return ok.");

  const prepare = binding.dispatchVisualAction("strings.prepare", {
    stringPrefix: "V46",
    maxPanelsPerString: 2
  });
  assert(prepare.ok === true, "String preparation must return ok.");

  const state = bootstrap.data.controller.getState();
  assert(state.data.project.fve.strings.length === 2, "Prepared string count mismatch.");
});

runTest("safe wrapper and unsupported action", () => {
  const safe = safeFveCadVisualBinding({ project: createProject() });
  assert(safe.ok === true, "safeFveCadVisualBinding must return ok.");
  assert(safe.data.binding.version === "v46-fve-cad-visual-binding", "Safe wrapper binding version mismatch.");

  const unsupported = safe.data.binding.dispatchVisualAction("unknown.action", {});
  assert(unsupported.ok === false, "Unsupported action must return structured error.");
  assert(unsupported.errors.length === 1, "Unsupported action must include error.");
});

runTest("broken interaction is structured", () => {
  const binding = createFveCadVisualBinding({
    interaction: {
      getCadViewModel() {
        throw new Error("Injected v46 visual binding failure");
      }
    }
  });

  const result = binding.getRenderPacket();
  assert(result.ok === false, "Broken interaction must return structured error.");
  assert(result.errors.length === 1, "Broken interaction must include error.");
});

console.log("All v46 FVE CAD Visual Binding smoke tests passed.");
