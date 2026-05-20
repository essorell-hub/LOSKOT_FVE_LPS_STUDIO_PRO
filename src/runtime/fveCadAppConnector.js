import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

import {
  createFveCadDomBinding
} from "./fveCadDomBinding.js";

export const FVE_CAD_APP_CONNECTOR_VERSION = "v48-fve-cad-app-connector";

const DEFAULT_SELECTOR = "[data-loskot-fve-cad-root]";
const CANDIDATE_SELECTORS = [
  { selector: "[data-loskot-fve-cad-root]", confidence: 100, reason: "explicit LOSKOT FVE CAD mount root" },
  { selector: "[data-loskot-cad-preview]", confidence: 90, reason: "explicit LOSKOT CAD preview root" },
  { selector: "[data-cad-preview]", confidence: 82, reason: "generic CAD preview data attribute" },
  { selector: "#loskot-cad-preview", confidence: 80, reason: "LOSKOT CAD preview id" },
  { selector: "#cad-preview", confidence: 70, reason: "generic CAD preview id" },
  { selector: ".loskot-cad-preview", confidence: 68, reason: "LOSKOT CAD preview class" },
  { selector: ".cad-preview", confidence: 58, reason: "generic CAD preview class" },
  { selector: "[data-active-screen=\"cad\"]", confidence: 45, reason: "active CAD screen attribute" },
  { selector: "[data-module=\"cad\"]", confidence: 42, reason: "CAD module attribute" }
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasDocument() {
  return typeof document !== "undefined" && document && typeof document.querySelectorAll === "function";
}

function domRootFromOptions(options = {}) {
  return options.documentRoot || options.root || (hasDocument() ? document : null);
}

function isElementLike(value) {
  return Boolean(value && typeof value === "object" && (
    typeof value.querySelectorAll === "function" ||
    typeof value.appendChild === "function" ||
    typeof value.innerHTML === "string" ||
    typeof value.addEventListener === "function"
  ));
}

function queryAll(root, selector) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return [];
  }
  try {
    return Array.from(root.querySelectorAll(selector) || []);
  } catch (_error) {
    return [];
  }
}

function queryOne(root, selector) {
  if (!root || typeof root.querySelector !== "function") {
    return null;
  }
  try {
    return root.querySelector(selector);
  } catch (_error) {
    return null;
  }
}

function setAttributeSafe(element, name, value) {
  if (!element) return;
  if (typeof element.setAttribute === "function") {
    element.setAttribute(name, String(value));
    return;
  }
  if (name === "class") {
    element.className = String(value);
  }
  if (name === "id") {
    element.id = String(value);
  }
  if (name.startsWith("data-")) {
    element.attributes = element.attributes || {};
    element.attributes[name] = String(value);
  }
}

function createElement(root, tagName) {
  if (root && typeof root.createElement === "function") {
    return root.createElement(tagName);
  }
  if (root && root.ownerDocument && typeof root.ownerDocument.createElement === "function") {
    return root.ownerDocument.createElement(tagName);
  }
  if (hasDocument() && typeof document.createElement === "function") {
    return document.createElement(tagName);
  }
  return {
    tagName: String(tagName).toUpperCase(),
    children: [],
    attributes: {},
    dataset: {},
    innerHTML: "",
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === "id") this.id = String(value);
      if (name === "class") this.className = String(value);
      if (name.startsWith("data-")) {
        const key = name.slice(5).replace(/-([a-z])/g, (_match, char) => char.toUpperCase());
        this.dataset[key] = String(value);
      }
    },
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {},
    removeEventListener() {}
  };
}

function appendChildSafe(parent, child) {
  if (!parent || !child) return false;
  if (typeof parent.appendChild === "function") {
    parent.appendChild(child);
    return true;
  }
  if (Array.isArray(parent.children)) {
    parent.children.push(child);
    child.parentNode = parent;
    return true;
  }
  return false;
}

function parentFromRoot(root) {
  if (!root) return null;
  return root.body || root.documentElement || root;
}

function elementName(element = {}) {
  return String(element.id || element.tagName || element.nodeName || "element");
}

function elementClassName(element = {}) {
  if (typeof element.className === "string") return element.className;
  if (element.className && typeof element.className.baseVal === "string") return element.className.baseVal;
  return "";
}

function describeTarget(element, selectorInfo = {}, index = 0, source = "detected") {
  return {
    id: `target-${index + 1}`,
    selector: selectorInfo.selector || DEFAULT_SELECTOR,
    confidence: selectorInfo.confidence || 0,
    reason: selectorInfo.reason || source,
    source,
    elementName: elementName(element),
    elementId: element && element.id ? String(element.id) : "",
    className: elementClassName(element),
    element
  };
}

function createResult(action, data = {}, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: !errors.length,
    module: "fveCadAppConnector",
    action,
    data: {
      version: FVE_CAD_APP_CONNECTOR_VERSION,
      classicProUnchanged: true,
      ...data
    },
    warnings,
    errors
  });
}

function publicTarget(target = null) {
  if (!target) return null;
  const { element: _element, ...rest } = target;
  return rest;
}

function safeCall(action, fn, payload) {
  try {
    return fn();
  } catch (error) {
    return createRuntimeError(error, {
      module: "fveCadAppConnector",
      action,
      data: payload
    });
  }
}

export function createFveCadAppConnector(options = {}) {
  const controller = options.controller || createAppStateController(options.project || options);
  const domBinding = options.domBinding || createFveCadDomBinding({
    ...options,
    controller,
    containerSelector: options.containerSelector || DEFAULT_SELECTOR
  });
  const config = {
    containerSelector: options.containerSelector || DEFAULT_SELECTOR,
    allowCreateContainer: options.allowCreateContainer === true,
    fallbackContainerId: options.fallbackContainerId || "loskot-fve-cad-auto-root",
    fallbackContainerClass: options.fallbackContainerClass || "loskot-cad-preview loskot-fve-cad-auto-root"
  };
  let mountedTarget = null;

  function getCandidateSelectors() {
    return createResult("getCandidateSelectors", {
      selectors: CANDIDATE_SELECTORS.map((item) => ({ ...item }))
    });
  }

  function detectCadContainers(payload = {}) {
    const root = payload.root || payload.documentRoot || domRootFromOptions(options);
    if (!root) {
      return createResult("detectCadContainers", {
        targets: [],
        targetCount: 0
      }, ["Nebyl dostupný DOM root pro hledání CAD containeru."]);
    }

    const seen = new Set();
    const targets = [];
    for (const selectorInfo of CANDIDATE_SELECTORS) {
      for (const element of queryAll(root, selectorInfo.selector)) {
        if (!element || seen.has(element)) continue;
        seen.add(element);
        targets.push(describeTarget(element, selectorInfo, targets.length, "detected"));
      }
    }

    targets.sort((left, right) => right.confidence - left.confidence);

    return createResult("detectCadContainers", {
      targets,
      publicTargets: targets.map(publicTarget),
      targetCount: targets.length,
      rootAvailable: true
    });
  }

  function createFallbackContainer(payload = {}) {
    const root = payload.root || payload.documentRoot || domRootFromOptions(options);
    const parent = payload.parent || parentFromRoot(root);
    if (!parent) {
      return createRuntimeError("Cannot create FVE CAD fallback container without parent root.", {
        module: "fveCadAppConnector",
        action: "createFallbackContainer",
        data: payload
      });
    }

    const existing = queryOne(parent, `#${config.fallbackContainerId}`) || queryOne(parent, config.containerSelector);
    if (existing) {
      return createResult("createFallbackContainer", {
        target: publicTarget(describeTarget(existing, {
          selector: config.containerSelector,
          confidence: 95,
          reason: "existing fallback container"
        }, 0, "existing-fallback")),
        element: existing,
        created: false
      });
    }

    const element = createElement(root, "div");
    setAttributeSafe(element, "id", config.fallbackContainerId);
    setAttributeSafe(element, "class", config.fallbackContainerClass);
    setAttributeSafe(element, "data-loskot-fve-cad-root", "true");
    setAttributeSafe(element, "data-loskot-runtime", FVE_CAD_APP_CONNECTOR_VERSION);
    const appended = appendChildSafe(parent, element);

    if (!appended) {
      return createRuntimeError("Fallback FVE CAD container could not be appended.", {
        module: "fveCadAppConnector",
        action: "createFallbackContainer",
        data: payload
      });
    }

    return createResult("createFallbackContainer", {
      target: publicTarget(describeTarget(element, {
        selector: config.containerSelector,
        confidence: 88,
        reason: "created safe fallback CAD container"
      }, 0, "created-fallback")),
      element,
      created: true
    });
  }

  function resolveMountTarget(payload = {}) {
    if (isElementLike(payload.container)) {
      return createResult("resolveMountTarget", {
        target: publicTarget(describeTarget(payload.container, {
          selector: "explicit-container",
          confidence: 100,
          reason: "explicit container passed by caller"
        }, 0, "explicit")),
        element: payload.container
      });
    }

    if (typeof payload.container === "string") {
      const root = payload.root || payload.documentRoot || domRootFromOptions(options);
      const element = queryOne(root, payload.container);
      if (element) {
        return createResult("resolveMountTarget", {
          target: publicTarget(describeTarget(element, {
            selector: payload.container,
            confidence: 96,
            reason: "explicit selector passed by caller"
          }, 0, "explicit-selector")),
          element
        });
      }
    }

    const detected = detectCadContainers(payload);
    if (!detected.ok) return detected;
    if (detected.data.targets.length) {
      const best = detected.data.targets[0];
      return createResult("resolveMountTarget", {
        target: publicTarget(best),
        element: best.element,
        detectedTargets: detected.data.publicTargets
      }, detected.warnings || []);
    }

    if (payload.createIfMissing === true || payload.allowCreateContainer === true || config.allowCreateContainer) {
      const created = createFallbackContainer(payload);
      if (!created.ok) return created;
      return createResult("resolveMountTarget", {
        target: created.data.target,
        element: created.data.element,
        created: created.data.created
      }, created.warnings || []);
    }

    return createRuntimeError("FVE CAD app connector did not find a safe CAD mount target.", {
      module: "fveCadAppConnector",
      action: "resolveMountTarget",
      data: {
        selector: config.containerSelector,
        createIfMissing: payload.createIfMissing === true
      }
    });
  }

  function getIntegrationPlan() {
    return createResult("getIntegrationPlan", {
      title: "v48 FVE CAD App Connector Plan",
      steps: [
        "Najít existující CAD container podle bezpečných selectorů.",
        "Pokud je povoleno createIfMissing, vytvořit fallback container bez změny Classic PRO stylu.",
        "Předat container do v47 DOM bindingu.",
        "Refreshovat SVG runtime výstup bez přepisování globálního UI.",
        "Vracet strukturované runtime chyby místo nekontrolovaného pádu."
      ],
      selectors: CANDIDATE_SELECTORS.map((item) => ({ ...item })),
      defaultSelector: config.containerSelector,
      packageSafe: true,
      previewHtmlUnchanged: true
    });
  }

  function getStatus(payload = {}) {
    return safeCall("getStatus", () => {
      const detected = detectCadContainers(payload);
      const domState = domBinding && typeof domBinding.getMountedState === "function"
        ? domBinding.getMountedState()
        : null;

      return createResult("getStatus", {
        mountedTarget: publicTarget(mountedTarget),
        detectedTargets: detected.ok ? detected.data.publicTargets : [],
        detectedTargetCount: detected.ok ? detected.data.targetCount : 0,
        domMountedState: domState && domState.ok ? domState.data.mounted : null,
        ready: Boolean(domBinding && typeof domBinding.mount === "function"),
        connector: {
          defaultSelector: config.containerSelector,
          allowCreateContainer: config.allowCreateContainer
        }
      }, [
        ...((detected && detected.warnings) || []),
        ...((domState && domState.warnings) || [])
      ], [
        ...((detected && detected.errors) || []),
        ...((domState && domState.errors) || [])
      ]);
    }, payload);
  }

  function mount(payload = {}) {
    return safeCall("mount", () => {
      if (!domBinding || typeof domBinding.mount !== "function") {
        return createRuntimeError("FVE CAD app connector requires v47 dom binding mount().", {
          module: "fveCadAppConnector",
          action: "mount",
          data: payload
        });
      }

      const targetResult = resolveMountTarget(payload);
      if (!targetResult.ok) return targetResult;
      const mountResult = domBinding.mount({
        ...payload,
        container: targetResult.data.element
      });
      if (!mountResult.ok) return mountResult;
      mountedTarget = targetResult.data.target;

      return createResult("mount", {
        target: mountedTarget,
        created: Boolean(targetResult.data.created),
        domResult: mountResult.data,
        status: {
          mounted: true,
          selector: mountedTarget.selector,
          confidence: mountedTarget.confidence
        }
      }, [
        ...((targetResult && targetResult.warnings) || []),
        ...((mountResult && mountResult.warnings) || [])
      ]);
    }, payload);
  }

  function install(payload = {}) {
    return mount(payload);
  }

  function refresh(payload = {}) {
    return safeCall("refresh", () => {
      if (!domBinding || typeof domBinding.refresh !== "function") {
        return createRuntimeError("FVE CAD app connector requires v47 dom binding refresh().", {
          module: "fveCadAppConnector",
          action: "refresh",
          data: payload
        });
      }
      const result = domBinding.refresh(payload);
      if (!result.ok) return result;
      return createResult("refresh", {
        target: publicTarget(mountedTarget),
        domResult: result.data
      }, result.warnings || []);
    }, payload);
  }

  function dispatchAppEvent(eventName, payload = {}) {
    return safeCall("dispatchAppEvent", () => {
      if (!domBinding || typeof domBinding.dispatchDomEvent !== "function") {
        return createRuntimeError("FVE CAD app connector requires v47 dom binding dispatchDomEvent().", {
          module: "fveCadAppConnector",
          action: "dispatchAppEvent",
          data: { eventName, payload }
        });
      }
      const result = domBinding.dispatchDomEvent(eventName, payload);
      if (!result.ok) return result;
      return createResult("dispatchAppEvent", {
        eventName,
        target: publicTarget(mountedTarget),
        domResult: result.data
      }, result.warnings || []);
    }, { eventName, payload });
  }

  function unmount(payload = {}) {
    return safeCall("unmount", () => {
      if (!domBinding || typeof domBinding.unmount !== "function") {
        return createRuntimeError("FVE CAD app connector requires v47 dom binding unmount().", {
          module: "fveCadAppConnector",
          action: "unmount",
          data: payload
        });
      }
      const result = domBinding.unmount(payload);
      if (!result.ok) return result;
      const previousTarget = mountedTarget;
      mountedTarget = null;
      return createResult("unmount", {
        previousTarget: publicTarget(previousTarget),
        domResult: result.data
      }, result.warnings || []);
    }, payload);
  }

  function run(command, payload = {}) {
    if (command === "getCandidateSelectors") return getCandidateSelectors(payload);
    if (command === "detectCadContainers") return detectCadContainers(payload);
    if (command === "createFallbackContainer") return createFallbackContainer(payload);
    if (command === "resolveMountTarget") return resolveMountTarget(payload);
    if (command === "getIntegrationPlan") return getIntegrationPlan(payload);
    if (command === "getStatus") return getStatus(payload);
    if (command === "mount") return mount(payload);
    if (command === "install") return install(payload);
    if (command === "refresh") return refresh(payload);
    if (command === "dispatchAppEvent") return dispatchAppEvent(payload.eventName, payload.payload || {});
    if (command === "unmount") return unmount(payload);

    return createRuntimeError(`Unsupported FVE CAD app connector command: ${command}`, {
      module: "fveCadAppConnector",
      action: "run",
      data: { command, payload }
    });
  }

  return {
    version: FVE_CAD_APP_CONNECTOR_VERSION,
    controller,
    domBinding,
    config,
    getCandidateSelectors,
    detectCadContainers,
    createFallbackContainer,
    resolveMountTarget,
    getIntegrationPlan,
    getStatus,
    mount,
    install,
    refresh,
    dispatchAppEvent,
    unmount,
    run
  };
}

export function safeFveCadAppConnector(options = {}) {
  try {
    return createRuntimeResult({
      module: "fveCadAppConnector",
      action: "safeFveCadAppConnector",
      data: {
        version: FVE_CAD_APP_CONNECTOR_VERSION,
        connector: createFveCadAppConnector(options)
      }
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fveCadAppConnector",
      action: "safeFveCadAppConnector"
    });
  }
}

export default {
  FVE_CAD_APP_CONNECTOR_VERSION,
  createFveCadAppConnector,
  safeFveCadAppConnector
};
// POST-MEGA AUTOPILOT B3 UI MODEL BRIDGE START
// Minimal read-only project model bridge registration.
// No Classic PRO layout, CSS theme or CAD/MAPA geometry mutation.
(function loskotAutopilotB3ProjectModelBridge(root) {
  if (!root || root.LOSKOT_POST_MEGA_UI_MODEL_BRIDGE) return;
  root.LOSKOT_POST_MEGA_UI_MODEL_BRIDGE = {
    version: "post-mega-autopilot-b3",
    candidate: "src/runtime/fveCadAppConnector.js",
    normalizeProjectModel: async function normalizeProjectModel(source) {
      const bridge = await import("./postMegaRuntimeProjectModelBridge.mjs");
      return bridge.normalizeRuntimeProjectModel(source);
    },
    visibleLayers: async function visibleLayers(source) {
      const bridge = await import("./postMegaRuntimeProjectModelBridge.mjs");
      return bridge.getRuntimeVisibleLayers(source);
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : undefined);
// POST-MEGA AUTOPILOT B3 UI MODEL BRIDGE END
