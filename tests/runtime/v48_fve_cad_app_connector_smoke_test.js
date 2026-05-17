import assert from "node:assert/strict";

import {
  FVE_CAD_APP_CONNECTOR_VERSION,
  createFveCadAppConnector,
  safeFveCadAppConnector
} from "../../src/runtime/index.js";

function createProject() {
  return {
    projectId: "v48-fve-cad-app-connector-project",
    name: "v48 FVE CAD App Connector smoke project",
    fve: {
      panels: [
        { id: "P1", x: 10, y: 20, width: 30, height: 20, row: 1, col: 1 },
        { id: "P2", x: 50, y: 20, width: 30, height: 20, row: 1, col: 2 },
        { id: "P3", x: 10, y: 60, width: 30, height: 20, row: 2, col: 1 }
      ],
      strings: []
    }
  };
}

function dataKey(name) {
  return String(name).slice(5).replace(/-([a-z])/g, (_match, char) => char.toUpperCase());
}

class MockElement {
  constructor(tagName = "div") {
    this.tagName = String(tagName).toUpperCase();
    this.nodeName = this.tagName;
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.listeners = {};
    this.className = "";
    this.id = "";
    this.parentNode = null;
    this.syntheticNodes = [];
    this._innerHTML = "";
  }

  setAttribute(name, value) {
    const stringValue = String(value);
    this.attributes[name] = stringValue;
    if (name === "id") this.id = stringValue;
    if (name === "class") this.className = stringValue;
    if (name.startsWith("data-")) this.dataset[dataKey(name)] = stringValue;
  }

  getAttribute(name) {
    return this.attributes[name] || "";
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    this.syntheticNodes = [];
    const regex = /data-panel-id="([^"]+)"/g;
    let match = regex.exec(this._innerHTML);
    while (match) {
      const node = new MockElement("rect");
      node.setAttribute("data-panel-id", match[1]);
      node.setAttribute("data-selected", "false");
      this.syntheticNodes.push(node);
      match = regex.exec(this._innerHTML);
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  addEventListener(eventName, handler) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(handler);
  }

  removeEventListener(eventName, handler) {
    this.listeners[eventName] = (this.listeners[eventName] || []).filter((item) => item !== handler);
  }

  dispatchEvent(eventName, event = {}) {
    for (const handler of this.listeners[eventName] || []) {
      handler(event);
    }
  }

  getBoundingClientRect() {
    return { left: 0, top: 0, width: 640, height: 360 };
  }

  matchesSelector(selector) {
    if (selector === "[data-loskot-fve-cad-root]") return this.attributes["data-loskot-fve-cad-root"] !== undefined;
    if (selector === "[data-loskot-cad-preview]") return this.attributes["data-loskot-cad-preview"] !== undefined;
    if (selector === "[data-cad-preview]") return this.attributes["data-cad-preview"] !== undefined;
    if (selector === "[data-panel-id]") return this.attributes["data-panel-id"] !== undefined;
    if (selector === ".loskot-cad-svg-root") return String(this.className).split(/\s+/).includes("loskot-cad-svg-root");
    if (selector === ".loskot-cad-preview") return String(this.className).split(/\s+/).includes("loskot-cad-preview");
    if (selector === ".cad-preview") return String(this.className).split(/\s+/).includes("cad-preview");
    if (selector === "#loskot-cad-preview") return this.id === "loskot-cad-preview";
    if (selector === "#cad-preview") return this.id === "cad-preview";
    if (selector === "#loskot-fve-cad-auto-root") return this.id === "loskot-fve-cad-auto-root";
    if (selector === "[data-active-screen=\"cad\"]") return this.attributes["data-active-screen"] === "cad";
    if (selector === "[data-module=\"cad\"]") return this.attributes["data-module"] === "cad";
    return false;
  }

  querySelectorAll(selector) {
    const result = [];
    const visit = (node) => {
      if (node.matchesSelector && node.matchesSelector(selector)) result.push(node);
      for (const child of node.children || []) visit(child);
      for (const child of node.syntheticNodes || []) visit(child);
    };
    visit(this);
    return result;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
}

class MockDocument extends MockElement {
  constructor() {
    super("document");
    this.body = new MockElement("body");
    this.body.ownerDocument = this;
    this.appendChild(this.body);
  }

  createElement(tagName) {
    const element = new MockElement(tagName);
    element.ownerDocument = this;
    return element;
  }
}

function assertRuntimeOk(result, label) {
  assert.equal(result.ok, true, `${label} should be ok: ${JSON.stringify(result.errors || [])}`);
  return result;
}

function assertRuntimeFail(result, label) {
  assert.equal(result.ok, false, `${label} should fail safely`);
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0, `${label} should return errors array`);
  return result;
}

assert.equal(FVE_CAD_APP_CONNECTOR_VERSION, "v48-fve-cad-app-connector");

const documentRoot = new MockDocument();
const connector = createFveCadAppConnector({
  project: createProject(),
  documentRoot
});

const selectors = assertRuntimeOk(connector.getCandidateSelectors(), "candidate selectors");
assert.ok(selectors.data.selectors.length >= 5);

const plan = assertRuntimeOk(connector.getIntegrationPlan(), "integration plan");
assert.equal(plan.data.previewHtmlUnchanged, true);
assert.equal(plan.data.packageSafe, true);

const detectBefore = assertRuntimeOk(connector.detectCadContainers(), "detect before fallback");
assert.equal(detectBefore.data.targetCount, 0);

const mountFallback = assertRuntimeOk(connector.mount({ createIfMissing: true }), "mount fallback");
assert.equal(mountFallback.data.created, true);
assert.equal(mountFallback.data.status.mounted, true);
assert.equal(documentRoot.body.querySelectorAll("[data-loskot-fve-cad-root]").length, 1);
assert.ok(documentRoot.body.innerHTML.length === 0, "fallback root should hold svg, not body");

const statusAfterMount = assertRuntimeOk(connector.getStatus(), "status after mount");
assert.equal(statusAfterMount.data.domMountedState.isMounted, true);
assert.ok(statusAfterMount.data.domMountedState.svgLength > 100);

const clickResult = assertRuntimeOk(connector.dispatchAppEvent("panel.click", {
  panelId: "P1",
  mode: "replace"
}), "dispatch panel click");
assert.ok(clickResult.data.domResult);

const nudgeResult = assertRuntimeOk(connector.dispatchAppEvent("selection.nudge", {
  direction: "right",
  amount: 4
}), "dispatch nudge");
assert.ok(nudgeResult.data.domResult);

const prepareResult = assertRuntimeOk(connector.dispatchAppEvent("strings.prepare", {
  stringPrefix: "APP",
  maxPanelsPerString: 2
}), "dispatch string prepare");
assert.ok(prepareResult.data.domResult);

const refreshResult = assertRuntimeOk(connector.refresh(), "refresh mounted connector");
assert.equal(refreshResult.data.target.selector, "[data-loskot-fve-cad-root]");

const unmountResult = assertRuntimeOk(connector.unmount(), "unmount connector");
assert.ok(unmountResult.data.domResult);

const existingDoc = new MockDocument();
const existing = existingDoc.createElement("section");
existing.setAttribute("id", "cad-preview");
existing.setAttribute("data-loskot-fve-cad-root", "true");
existingDoc.body.appendChild(existing);
const existingConnector = createFveCadAppConnector({
  project: createProject(),
  documentRoot: existingDoc
});
const detectExisting = assertRuntimeOk(existingConnector.detectCadContainers(), "detect existing");
assert.equal(detectExisting.data.targetCount, 1);
assert.equal(detectExisting.data.publicTargets[0].confidence, 100);
const mountExisting = assertRuntimeOk(existingConnector.mount(), "mount existing");
assert.equal(mountExisting.data.created, false);
assert.equal(mountExisting.data.target.confidence, 100);

const noDomConnector = createFveCadAppConnector({
  project: createProject(),
  documentRoot: null
});
assertRuntimeFail(noDomConnector.mount(), "mount without target and create flag");

const brokenConnector = createFveCadAppConnector({
  domBinding: {},
  documentRoot: existingDoc
});
assertRuntimeFail(brokenConnector.mount(), "broken dom binding");

const safeResult = assertRuntimeOk(safeFveCadAppConnector({
  project: createProject(),
  documentRoot: new MockDocument()
}), "safe connector wrapper");
assert.equal(safeResult.data.version, FVE_CAD_APP_CONNECTOR_VERSION);
assert.equal(typeof safeResult.data.connector.mount, "function");

const unsupported = connector.run("unsupportedCommand");
assertRuntimeFail(unsupported, "unsupported command");

console.log("All v48 FVE CAD App Connector smoke tests passed.");
