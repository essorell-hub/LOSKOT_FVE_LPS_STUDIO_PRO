import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";



export const PROJECT_INSPECTOR_LAYERS_VERSION = "v52-project-inspector-layers";

const MODULE_NAME = "projectInspectorLayers";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: PROJECT_INSPECTOR_LAYERS_VERSION,
      classicProUnchanged: true
    }
  });
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

const DEFAULT_LAYERS = [
  { id: "fve.panels", label: "FVE panely", visible: true, locked: false, order: 10 },
  { id: "fve.strings", label: "FVE stringy", visible: true, locked: false, order: 20 },
  { id: "fve.dcRoutes", label: "DC trasy", visible: true, locked: false, order: 30 },
  { id: "lps.airTerminals", label: "Jímače", visible: true, locked: false, order: 40 },
  { id: "lps.downConductors", label: "Svody", visible: true, locked: false, order: 50 },
  { id: "lps.hvi", label: "HVI trasy", visible: true, locked: false, order: 60 },
  { id: "electro.spd", label: "SPD", visible: true, locked: false, order: 70 },
  { id: "roof.geometry", label: "Střecha", visible: true, locked: false, order: 80 },
  { id: "map.background", label: "Mapa", visible: true, locked: true, order: 90 },
  { id: "system.fallback", label: "Fallback", visible: true, locked: true, order: 100 }
];

function normalizeLayer(layer = {}) {
  return {
    id: normalizeString(layer.id || layer.layerId, "unknown"),
    label: normalizeString(layer.label || layer.name, layer.id || "Vrstva"),
    visible: layer.visible !== false,
    locked: layer.locked === true,
    order: finiteNumber(layer.order, 999),
    source: layer.source || "runtime"
  };
}

function collectProjectObjects(project = {}) {
  const cadObjects = normalizeArray(project.cad?.objects).map((object) => ({ ...object, sourceType: object.sourceType || object.type || "cad" }));
  const fvePanels = normalizeArray(project.fve?.panels).map((panel) => ({
    id: panel.id || panel.panelId,
    cadObjectId: panel.cadObjectId || `fve-panel:${panel.id || panel.panelId}`,
    label: panel.label || panel.id || panel.panelId || "FVE panel",
    type: "fve-panel",
    layerId: panel.layerId || "fve.panels",
    source: panel
  }));
  return [...cadObjects, ...fvePanels];
}

function buildInspectorItem(object = {}) {
  return {
    id: object.id || object.cadObjectId || object.panelId || "unknown",
    cadObjectId: object.cadObjectId || object.id || null,
    type: object.type || object.sourceType || "unknown",
    label: object.label || object.name || object.id || "Objekt",
    layerId: object.layerId || "system.fallback",
    properties: {
      x: object.x ?? object.bounds?.x ?? null,
      y: object.y ?? object.bounds?.y ?? null,
      width: object.width ?? object.bounds?.width ?? null,
      height: object.height ?? object.bounds?.height ?? null,
      status: object.status || "UNKNOWN"
    },
    actions: [
      "select",
      "showLayer",
      "hideLayer",
      "centerInCad",
      "openDetails"
    ],
    classicProUnchanged: true
  };
}

export function createProjectInspectorLayers(options = {}) {
  let layers = [
    ...DEFAULT_LAYERS,
    ...normalizeArray(options.layers)
  ].map(normalizeLayer);

  function listLayers() {
    return createResult("listLayers", layers.slice().sort((a, b) => a.order - b.order));
  }

  function getVisibleLayers() {
    return createResult("getVisibleLayers", layers.filter((layer) => layer.visible));
  }

  function setLayerVisibility(layerId, visible) {
    const id = normalizeString(layerId, "");
    const layer = layers.find((item) => item.id === id);
    if (!layer) return createResult("setLayerVisibility", null, [`Vrstva ${id} nebyla nalezena.`]);
    if (layer.locked && visible === false) return createResult("setLayerVisibility", layer, [`Vrstva ${id} je zamčená a nelze ji skrýt.`]);
    layer.visible = visible !== false;
    return createResult("setLayerVisibility", layer);
  }

  function toggleLayer(layerId) {
    const layer = layers.find((item) => item.id === layerId);
    if (!layer) return createResult("toggleLayer", null, [`Vrstva ${layerId} nebyla nalezena.`]);
    return setLayerVisibility(layerId, !layer.visible);
  }

  function getInspectorItem(project = {}, objectId = "") {
    const objects = collectProjectObjects(project);
    const id = normalizeString(objectId, "");
    const object = objects.find((item) => item.id === id || item.cadObjectId === id || item.panelId === id);
    if (!object) return createResult("getInspectorItem", null, [`Objekt ${id} nebyl nalezen.`]);
    return createResult("getInspectorItem", buildInspectorItem(object));
  }

  function getInspectorActions(project = {}, objectId = "") {
    const item = getInspectorItem(project, objectId);
    if (!item.ok || !item.data) return item;
    return createResult("getInspectorActions", item.data.actions);
  }

  function buildLayerSummary(project = {}) {
    const objects = collectProjectObjects(project);
    const counts = {};
    objects.forEach((object) => {
      const layerId = object.layerId || "system.fallback";
      counts[layerId] = (counts[layerId] || 0) + 1;
    });
    return createResult("buildLayerSummary", {
      layers: layers.map((layer) => ({ ...layer, objectCount: counts[layer.id] || 0 })),
      objectCount: objects.length,
      classicProUnchanged: true
    });
  }

  function run(command, payload = {}) {
    if (command === "listLayers") return listLayers();
    if (command === "getVisibleLayers") return getVisibleLayers();
    if (command === "toggleLayer") return toggleLayer(payload.layerId);
    if (command === "setLayerVisibility") return setLayerVisibility(payload.layerId, payload.visible);
    if (command === "getInspectorItem") return getInspectorItem(payload.project || payload, payload.objectId || payload.cadObjectId || payload.id);
    if (command === "getInspectorActions") return getInspectorActions(payload.project || payload, payload.objectId || payload.cadObjectId || payload.id);
    if (command === "buildLayerSummary") return buildLayerSummary(payload.project || payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: PROJECT_INSPECTOR_LAYERS_VERSION,
    classicProUnchanged: true,
    listLayers,
    getVisibleLayers,
    setLayerVisibility,
    toggleLayer,
    getInspectorItem,
    getInspectorActions,
    buildLayerSummary,
    run
  };
}

export function safeProjectInspectorLayers(options = {}) {
  try {
    return createProjectInspectorLayers(options);
  } catch (error) {
    return {
      version: PROJECT_INSPECTOR_LAYERS_VERSION,
      classicProUnchanged: true,
      run() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" });
      }
    };
  }
}

export default {
  PROJECT_INSPECTOR_LAYERS_VERSION,
  createProjectInspectorLayers,
  safeProjectInspectorLayers
};

