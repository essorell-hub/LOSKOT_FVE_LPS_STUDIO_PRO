import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

import {
  createFveCadVisualBinding
} from "./fveCadVisualBinding.js";

export const FVE_CAD_DOM_BINDING_VERSION = "v47-fve-cad-dom-binding";

const DEFAULT_CONTAINER_SELECTOR = "[data-loskot-fve-cad-root]";
const KEY_DIRECTION_MAP = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down"
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function finiteNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function hasDocument() {
  return typeof document !== "undefined" && document && typeof document.querySelector === "function";
}

function isDomLikeElement(value) {
  return Boolean(value && typeof value === "object" && (
    typeof value.querySelector === "function" ||
    typeof value.innerHTML === "string" ||
    typeof value.addEventListener === "function"
  ));
}

function createResult(action, data = {}, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: !errors.length,
    module: "fveCadDomBinding",
    action,
    data: {
      version: FVE_CAD_DOM_BINDING_VERSION,
      classicProUnchanged: true,
      ...data
    },
    warnings,
    errors
  });
}

function safeDatasetValue(element, key) {
  if (!element) return "";
  if (element.dataset && element.dataset[key] !== undefined) {
    return String(element.dataset[key]);
  }
  if (typeof element.getAttribute === "function") {
    const attr = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
    return String(element.getAttribute(`data-${attr}`) || "");
  }
  return "";
}

function resolveContainer(container, selector = DEFAULT_CONTAINER_SELECTOR) {
  if (isDomLikeElement(container)) {
    return container;
  }

  if (typeof container === "string" && hasDocument()) {
    return document.querySelector(container);
  }

  if (!container && hasDocument()) {
    return document.querySelector(selector);
  }

  return null;
}

function queryAll(root, selector) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return [];
  }
  return Array.from(root.querySelectorAll(selector) || []);
}

function queryOne(root, selector) {
  if (!root || typeof root.querySelector !== "function") {
    return null;
  }
  return root.querySelector(selector);
}

function addListener(target, eventName, handler, registry) {
  if (!target || typeof target.addEventListener !== "function") {
    return false;
  }
  target.addEventListener(eventName, handler);
  registry.push({ target, eventName, handler });
  return true;
}

function removeListeners(registry = []) {
  for (const binding of registry) {
    if (binding.target && typeof binding.target.removeEventListener === "function") {
      binding.target.removeEventListener(binding.eventName, binding.handler);
    }
  }
}

function getEventMode(event = {}, fallback = "replace") {
  if (event.ctrlKey || event.metaKey) return "toggle";
  if (event.shiftKey) return "add";
  return fallback;
}

function eventToPoint(event = {}, packet = {}, root = null) {
  if (event.x !== undefined || event.y !== undefined || event.cadX !== undefined || event.cadY !== undefined) {
    return {
      x: finiteNumber(event.x ?? event.cadX, 0),
      y: finiteNumber(event.y ?? event.cadY, 0)
    };
  }

  const viewBox = packet.viewBox || { x: 0, y: 0, width: 640, height: 360 };
  const rect = root && typeof root.getBoundingClientRect === "function"
    ? root.getBoundingClientRect()
    : { left: 0, top: 0, width: viewBox.width, height: viewBox.height };
  const rectWidth = finiteNumber(rect.width, viewBox.width) || viewBox.width || 1;
  const rectHeight = finiteNumber(rect.height, viewBox.height) || viewBox.height || 1;
  const clientX = finiteNumber(event.clientX, rect.left);
  const clientY = finiteNumber(event.clientY, rect.top);

  return {
    x: finiteNumber(viewBox.x, 0) + ((clientX - finiteNumber(rect.left, 0)) / rectWidth) * finiteNumber(viewBox.width, 640),
    y: finiteNumber(viewBox.y, 0) + ((clientY - finiteNumber(rect.top, 0)) / rectHeight) * finiteNumber(viewBox.height, 360)
  };
}

function createDomPlan(selector = DEFAULT_CONTAINER_SELECTOR) {
  return {
    rootSelector: selector,
    svgRootSelector: ".loskot-cad-svg-root",
    panelSelector: "[data-panel-id]",
    keyboardTarget: "window",
    events: [
      { target: "panel", event: "click", command: "panel.click" },
      { target: "svgRoot", event: "pointerdown", command: "cad.pointer.down" },
      { target: "svgRoot", event: "pointermove", command: "cad.pointer.move" },
      { target: "svgRoot", event: "pointerup", command: "cad.pointer.up" },
      { target: "keyboard", event: "keydown", command: "selection.nudge" }
    ],
    dataAttributes: ["data-panel-id", "data-selected", "data-string-id"],
    classicProUnchanged: true
  };
}

export function createFveCadDomBinding(options = {}) {
  const controller = options.controller || createAppStateController(options.project || options);
  const visual = options.visual || createFveCadVisualBinding({
    ...options,
    controller
  });
  const config = {
    containerSelector: options.containerSelector || DEFAULT_CONTAINER_SELECTOR,
    autoRefresh: options.autoRefresh !== false,
    clearOnUnmount: options.clearOnUnmount === true,
    keyboardNudgeAmount: finiteNumber(options.keyboardNudgeAmount, 5)
  };
  const mounted = {
    container: null,
    root: null,
    isMounted: false,
    lastPacket: null,
    lastSvg: "",
    eventBindings: [],
    pointerActive: false,
    lastPointerPoint: null
  };

  function getSnapshot(payload = {}) {
    try {
      if (!visual ||
        typeof visual.getRenderPacket !== "function" ||
        typeof visual.getSvgMarkup !== "function" ||
        typeof visual.getInspectorModel !== "function" ||
        typeof visual.getEventBindingPlan !== "function") {
        return createRuntimeError("FVE CAD DOM binding requires complete visual binding API.", {
          module: "fveCadDomBinding",
          action: "getSnapshot",
          data: payload
        });
      }

      const packetResult = visual.getRenderPacket(payload);
      if (!packetResult.ok) return packetResult;
      const svgResult = visual.getSvgMarkup(payload);
      if (!svgResult.ok) return svgResult;
      const inspectorResult = visual.getInspectorModel(payload);
      if (!inspectorResult.ok) return inspectorResult;
      const eventPlanResult = visual.getEventBindingPlan();
      if (!eventPlanResult.ok) return eventPlanResult;

      return createResult("getSnapshot", {
        packet: packetResult.data.packet,
        svg: svgResult.data.svg,
        inspector: inspectorResult.data,
        eventPlan: eventPlanResult.data,
        domPlan: createDomPlan(config.containerSelector),
        mounted: {
          isMounted: mounted.isMounted,
          hasContainer: Boolean(mounted.container),
          eventBindingCount: mounted.eventBindings.length
        }
      }, [
        ...((packetResult && packetResult.warnings) || []),
        ...((svgResult && svgResult.warnings) || []),
        ...((inspectorResult && inspectorResult.warnings) || []),
        ...((eventPlanResult && eventPlanResult.warnings) || [])
      ], [
        ...((packetResult && packetResult.errors) || []),
        ...((svgResult && svgResult.errors) || []),
        ...((inspectorResult && inspectorResult.errors) || []),
        ...((eventPlanResult && eventPlanResult.errors) || [])
      ]);
    } catch (error) {
      return createRuntimeError(error, {
        module: "fveCadDomBinding",
        action: "getSnapshot",
        data: payload
      });
    }
  }

  function getDomPlan() {
    return createResult("getDomPlan", {
      domPlan: createDomPlan(config.containerSelector)
    });
  }

  function setContainerHtml(container, svg) {
    if (!container || typeof svg !== "string") return;
    try {
      container.innerHTML = svg;
    } catch (_error) {
      if (typeof container.replaceChildren === "function") {
        container.replaceChildren();
      }
    }
  }

  function refresh(payload = {}) {
    if (!mounted.container) {
      return createRuntimeError("FVE CAD DOM binding is not mounted.", {
        module: "fveCadDomBinding",
        action: "refresh",
        data: payload
      });
    }

    const snapshot = getSnapshot(payload);
    if (!snapshot.ok) return snapshot;

    setContainerHtml(mounted.container, snapshot.data.svg);
    mounted.lastPacket = snapshot.data.packet;
    mounted.lastSvg = snapshot.data.svg;
    mounted.root = queryOne(mounted.container, ".loskot-cad-svg-root") || mounted.container;

    removeListeners(mounted.eventBindings);
    mounted.eventBindings = [];
    attachEvents();

    return createResult("refresh", {
      snapshot: snapshot.data,
      mounted: {
        isMounted: mounted.isMounted,
        hasContainer: Boolean(mounted.container),
        eventBindingCount: mounted.eventBindings.length
      }
    }, snapshot.warnings || []);
  }

  function dispatchAndMaybeRefresh(command, payload = {}) {
    const result = visual.dispatchVisualAction(command, payload);
    if (!result.ok) return result;
    if (config.autoRefresh && mounted.container) {
      return refresh(payload);
    }
    return result;
  }

  function attachEvents() {
    const root = mounted.root || mounted.container;
    const panelNodes = queryAll(mounted.container, "[data-panel-id]");

    for (const panelNode of panelNodes) {
      addListener(panelNode, "click", (event = {}) => {
        const panelId = safeDatasetValue(panelNode, "panelId");
        dispatchAndMaybeRefresh("panel.click", {
          panelId,
          mode: getEventMode(event, "replace")
        });
      }, mounted.eventBindings);
    }

    addListener(root, "pointerdown", (event = {}) => {
      const point = eventToPoint(event, mounted.lastPacket, root);
      mounted.pointerActive = true;
      mounted.lastPointerPoint = point;
      dispatchAndMaybeRefresh("cad.pointer.down", {
        ...point,
        mode: getEventMode(event, "replace"),
        selectFromPoint: true,
        clearOnMiss: true
      });
    }, mounted.eventBindings);

    addListener(root, "pointermove", (event = {}) => {
      if (!mounted.pointerActive) return;
      const point = eventToPoint(event, mounted.lastPacket, root);
      const lastPoint = mounted.lastPointerPoint || point;
      const dx = event.dx !== undefined ? finiteNumber(event.dx, 0) : point.x - lastPoint.x;
      const dy = event.dy !== undefined ? finiteNumber(event.dy, 0) : point.y - lastPoint.y;
      mounted.lastPointerPoint = point;
      dispatchAndMaybeRefresh("cad.pointer.move", { dx, dy });
    }, mounted.eventBindings);

    addListener(root, "pointerup", (event = {}) => {
      if (!mounted.pointerActive) return;
      mounted.pointerActive = false;
      mounted.lastPointerPoint = null;
      dispatchAndMaybeRefresh("cad.pointer.up", event || {});
    }, mounted.eventBindings);

    const keyboardTarget = options.keyboardTarget || (typeof window !== "undefined" ? window : null);
    addListener(keyboardTarget, "keydown", (event = {}) => {
      const direction = KEY_DIRECTION_MAP[event.key];
      if (!direction) return;
      dispatchAndMaybeRefresh("selection.nudge", {
        direction,
        amount: event.shiftKey ? config.keyboardNudgeAmount * 5 : config.keyboardNudgeAmount
      });
    }, mounted.eventBindings);
  }

  function mount(payload = {}) {
    const container = resolveContainer(payload.container || options.container, config.containerSelector);
    if (!container) {
      return createRuntimeError("FVE CAD DOM container was not found.", {
        module: "fveCadDomBinding",
        action: "mount",
        data: {
          selector: config.containerSelector
        }
      });
    }

    removeListeners(mounted.eventBindings);
    mounted.eventBindings = [];
    mounted.container = container;
    mounted.isMounted = true;

    const snapshot = getSnapshot(payload);
    if (!snapshot.ok) return snapshot;

    setContainerHtml(container, snapshot.data.svg);
    mounted.lastPacket = snapshot.data.packet;
    mounted.lastSvg = snapshot.data.svg;
    mounted.root = queryOne(container, ".loskot-cad-svg-root") || container;
    attachEvents();

    return createResult("mount", {
      snapshot: snapshot.data,
      mounted: {
        isMounted: mounted.isMounted,
        hasContainer: Boolean(mounted.container),
        eventBindingCount: mounted.eventBindings.length
      }
    }, snapshot.warnings || []);
  }

  function unmount() {
    removeListeners(mounted.eventBindings);
    mounted.eventBindings = [];
    if (mounted.container && config.clearOnUnmount) {
      setContainerHtml(mounted.container, "");
    }
    mounted.container = null;
    mounted.root = null;
    mounted.isMounted = false;
    mounted.pointerActive = false;
    mounted.lastPointerPoint = null;

    return createResult("unmount", {
      mounted: {
        isMounted: false,
        hasContainer: false,
        eventBindingCount: 0
      }
    });
  }

  function dispatchDomEvent(eventName, payload = {}) {
    const event = String(eventName || "");

    if (event === "panelClick" || event === "panel.click" || event === "click") {
      return dispatchAndMaybeRefresh("panel.click", {
        panelId: payload.panelId || payload.id,
        mode: payload.mode || getEventMode(payload, "replace")
      });
    }

    if (event === "rectangle" || event === "selection.rectangle") {
      return dispatchAndMaybeRefresh("selection.rectangle", payload);
    }

    if (event === "keyDown" || event === "keydown" || event === "selection.nudge") {
      const direction = payload.direction || KEY_DIRECTION_MAP[payload.key];
      if (!direction) {
        return createRuntimeError("FVE CAD DOM keyDown requires Arrow key or direction.", {
          module: "fveCadDomBinding",
          action: "dispatchDomEvent",
          data: payload
        });
      }
      return dispatchAndMaybeRefresh("selection.nudge", {
        direction,
        amount: payload.amount ?? config.keyboardNudgeAmount
      });
    }

    if (event === "pointerDown" || event === "pointerdown" || event === "cad.pointer.down") {
      const point = eventToPoint(payload, mounted.lastPacket, mounted.root || mounted.container);
      mounted.pointerActive = true;
      mounted.lastPointerPoint = point;
      return dispatchAndMaybeRefresh("cad.pointer.down", {
        ...payload,
        ...point,
        selectFromPoint: payload.selectFromPoint !== false,
        clearOnMiss: payload.clearOnMiss !== false,
        mode: payload.mode || getEventMode(payload, "replace")
      });
    }

    if (event === "pointerMove" || event === "pointermove" || event === "cad.pointer.move") {
      const point = eventToPoint(payload, mounted.lastPacket, mounted.root || mounted.container);
      const lastPoint = mounted.lastPointerPoint || point;
      const dx = payload.dx !== undefined ? finiteNumber(payload.dx, 0) : point.x - lastPoint.x;
      const dy = payload.dy !== undefined ? finiteNumber(payload.dy, 0) : point.y - lastPoint.y;
      mounted.lastPointerPoint = point;
      return dispatchAndMaybeRefresh("cad.pointer.move", { dx, dy });
    }

    if (event === "pointerUp" || event === "pointerup" || event === "cad.pointer.up") {
      mounted.pointerActive = false;
      mounted.lastPointerPoint = null;
      return dispatchAndMaybeRefresh("cad.pointer.up", payload);
    }

    if (event === "strings.prepare" || event === "prepareStrings") {
      return dispatchAndMaybeRefresh("strings.prepare", payload);
    }

    return createRuntimeError(`Unsupported FVE CAD DOM event: ${eventName}`, {
      module: "fveCadDomBinding",
      action: "dispatchDomEvent",
      data: { eventName, payload }
    });
  }

  function getMountedState() {
    return createResult("getMountedState", {
      mounted: {
        isMounted: mounted.isMounted,
        hasContainer: Boolean(mounted.container),
        eventBindingCount: mounted.eventBindings.length,
        pointerActive: mounted.pointerActive,
        hasLastPacket: Boolean(mounted.lastPacket),
        svgLength: mounted.lastSvg.length
      }
    });
  }

  function run(command, payload = {}) {
    try {
      if (command === "getSnapshot") return getSnapshot(payload);
      if (command === "getDomPlan") return getDomPlan(payload);
      if (command === "mount") return mount(payload);
      if (command === "refresh") return refresh(payload);
      if (command === "unmount") return unmount(payload);
      if (command === "dispatchDomEvent") return dispatchDomEvent(payload.eventName, payload.payload || {});
      if (command === "getMountedState") return getMountedState(payload);
      return createRuntimeError(`Unsupported FVE CAD DOM binding command: ${command}`, {
        module: "fveCadDomBinding",
        action: "run",
        data: { command, payload }
      });
    } catch (error) {
      return createRuntimeError(error, {
        module: "fveCadDomBinding",
        action: command || "run",
        data: payload
      });
    }
  }

  return {
    version: FVE_CAD_DOM_BINDING_VERSION,
    controller,
    visual,
    config,
    getSnapshot,
    getDomPlan,
    mount,
    refresh,
    unmount,
    dispatchDomEvent,
    getMountedState,
    run
  };
}

export function safeFveCadDomBinding(options = {}) {
  try {
    return createRuntimeResult({
      module: "fveCadDomBinding",
      action: "safeFveCadDomBinding",
      data: {
        version: FVE_CAD_DOM_BINDING_VERSION,
        binding: createFveCadDomBinding(options)
      }
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fveCadDomBinding",
      action: "safeFveCadDomBinding"
    });
  }
}

export default {
  FVE_CAD_DOM_BINDING_VERSION,
  createFveCadDomBinding,
  safeFveCadDomBinding
};
