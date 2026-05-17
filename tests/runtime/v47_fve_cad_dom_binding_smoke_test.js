import assert from "node:assert/strict";

import {
  FVE_CAD_DOM_BINDING_VERSION,
  createRuntimeBootstrap,
  createFveCadDomBinding,
  safeFveCadDomBinding
} from "../../src/runtime/index.js";

function createProject() {
  return {
    projectId: "v47-fve-cad-dom-binding-project",
    name: "v47 FVE CAD DOM Binding smoke project",
    fve: {
      panels: [
        { id: "P1", x: 10, y: 20, width: 30, height: 20, row: 1, col: 1 },
        { id: "P2", x: 50, y: 20, width: 30, height: 20, row: 1, col: 2 },
        { id: "P3", x: 10, y: 60, width: 30, height: 20, row: 2, col: 1 },
        { id: "P4", position: { x: 50, y: 60 }, dimensions: { width: 30, height: 20 }, row: 2, col: 2 }
      ],
      strings: []
    }
  };
}

function createMockNode(dataset = {}) {
  return {
    dataset,
    listeners: new Map(),
    addEventListener(eventName, handler) {
      const list = this.listeners.get(eventName) || [];
      list.push(handler);
      this.listeners.set(eventName, list);
    },
    removeEventListener(eventName, handler) {
      const list = this.listeners.get(eventName) || [];
      this.listeners.set(eventName, list.filter((item) => item !== handler));
    },
    dispatch(eventName, payload = {}) {
      for (const handler of this.listeners.get(eventName) || []) {
        handler(payload);
      }
    },
    getAttribute(name) {
      if (name === "data-panel-id") return dataset.panelId || "";
      if (name === "data-selected") return dataset.selected || "";
      if (name === "data-string-id") return dataset.stringId || "";
      return "";
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 640, height: 360 };
    }
  };
}

function createMockContainer(panelIds = ["P1", "P2", "P3", "P4"]) {
  const root = createMockNode({});
  const panels = panelIds.map((panelId) => createMockNode({ panelId }));
  const container = createMockNode({});
  container.innerHTML = "";
  container.root = root;
  container.panels = panels;
  container.querySelector = (selector) => selector === ".loskot-cad-svg-root" ? root : null;
  container.querySelectorAll = (selector) => selector === "[data-panel-id]" ? panels : [];
  return container;
}

function selectedIds(binding) {
  const snapshot = binding.getSnapshot();
  assert.equal(snapshot.ok, true);
  return snapshot.data.packet.selection.selectedPanelIds;
}

function panelById(binding, id) {
  const snapshot = binding.getSnapshot();
  assert.equal(snapshot.ok, true);
  return snapshot.data.packet.panels.find((panel) => panel.id === id);
}

const bootstrap = createRuntimeBootstrap({ project: createProject() });
assert.equal(bootstrap.ok, true);

const binding = createFveCadDomBinding({
  controller: bootstrap.data.controller,
  keyboardNudgeAmount: 4
});

assert.equal(binding.version, FVE_CAD_DOM_BINDING_VERSION);

const snapshot = binding.getSnapshot();
assert.equal(snapshot.ok, true);
assert.equal(snapshot.data.version, FVE_CAD_DOM_BINDING_VERSION);
assert.equal(snapshot.data.classicProUnchanged, true);
assert.equal(snapshot.data.packet.counts.panels, 4);
assert.match(snapshot.data.svg, /<svg/);
assert.match(snapshot.data.svg, /data-panel-id="P1"/);
assert.equal(snapshot.data.inspector.selectedPanelIds.length, 0);
assert.equal(snapshot.data.domPlan.panelSelector, "[data-panel-id]");

const domPlan = binding.getDomPlan();
assert.equal(domPlan.ok, true);
assert.equal(domPlan.data.domPlan.events.length >= 5, true);

const container = createMockContainer();
const mount = binding.mount({ container });
assert.equal(mount.ok, true);
assert.equal(mount.data.mounted.isMounted, true);
assert.equal(container.innerHTML.includes("loskot-cad-svg-root"), true);
assert.equal(mount.data.mounted.eventBindingCount >= 4, true);

container.panels[1].dispatch("click", { ctrlKey: false, shiftKey: false });
assert.deepEqual(selectedIds(binding), ["P2"]);

const clickP3 = binding.dispatchDomEvent("panelClick", { panelId: "P3", mode: "replace" });
assert.equal(clickP3.ok, true);
assert.deepEqual(selectedIds(binding), ["P3"]);

const beforeNudge = panelById(binding, "P3");
const keyResult = binding.dispatchDomEvent("keyDown", { key: "ArrowRight", amount: 4 });
assert.equal(keyResult.ok, true);
const afterNudge = panelById(binding, "P3");
assert.equal(afterNudge.x, beforeNudge.x + 4);
assert.equal(afterNudge.y, beforeNudge.y);

const rectangle = binding.dispatchDomEvent("selection.rectangle", {
  x1: 0,
  y1: 0,
  x2: 90,
  y2: 50,
  mode: "replace"
});
assert.equal(rectangle.ok, true);
assert.deepEqual(selectedIds(binding), ["P1", "P2"]);

const stringPrepare = binding.dispatchDomEvent("strings.prepare", {
  stringPrefix: "DOM",
  maxPanelsPerString: 2
});
assert.equal(stringPrepare.ok, true);
const stringSnapshot = binding.getSnapshot();
assert.equal(stringSnapshot.data.packet.counts.strings, 1);
assert.match(stringSnapshot.data.svg, /loskot-cad-string-path/);

const pointerDown = binding.dispatchDomEvent("pointerDown", { x: 15, y: 25 });
assert.equal(pointerDown.ok, true);
assert.deepEqual(selectedIds(binding), ["P1"]);
const p1BeforeDrag = panelById(binding, "P1");
const pointerMove = binding.dispatchDomEvent("pointerMove", { dx: 6, dy: 3 });
assert.equal(pointerMove.ok, true);
const p1AfterDrag = panelById(binding, "P1");
assert.equal(p1AfterDrag.x, p1BeforeDrag.x + 6);
assert.equal(p1AfterDrag.y, p1BeforeDrag.y + 3);
const pointerUp = binding.dispatchDomEvent("pointerUp", {});
assert.equal(pointerUp.ok, true);

const mountedState = binding.getMountedState();
assert.equal(mountedState.ok, true);
assert.equal(mountedState.data.mounted.isMounted, true);
assert.equal(mountedState.data.mounted.hasLastPacket, true);

const refresh = binding.refresh();
assert.equal(refresh.ok, true);
assert.equal(refresh.data.mounted.isMounted, true);

const unmount = binding.unmount();
assert.equal(unmount.ok, true);
assert.equal(unmount.data.mounted.isMounted, false);

const missingContainer = createFveCadDomBinding({ controller: bootstrap.data.controller }).mount({ container: null });
assert.equal(missingContainer.ok, false);
assert.equal(Array.isArray(missingContainer.errors), true);

const unsupported = binding.run("missingCommand", {});
assert.equal(unsupported.ok, false);
assert.equal(Array.isArray(unsupported.errors), true);

const safe = safeFveCadDomBinding({ project: createProject() });
assert.equal(safe.ok, true);
assert.equal(safe.data.version, FVE_CAD_DOM_BINDING_VERSION);
assert.equal(typeof safe.data.binding.getSnapshot, "function");

const throwingVisual = {
  getRenderPacket() {
    throw new Error("Injected v47 render failure");
  }
};
const safeFailure = createFveCadDomBinding({
  controller: bootstrap.data.controller,
  visual: throwingVisual
}).getSnapshot();
assert.equal(safeFailure.ok, false);
assert.equal(Array.isArray(safeFailure.errors), true);

console.log("All v47 FVE CAD DOM Binding smoke tests passed.");
