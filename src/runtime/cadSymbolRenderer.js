import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createCadSymbolRegistry
} from "./cadSymbolRegistry.js";

export const CAD_SYMBOL_RENDERER_VERSION = "v50-cad-symbol-renderer-fix1";

const MODULE_NAME = "cadSymbolRenderer";

const DEFAULT_STATE_PRIORITY = [
  "selected",
  "warning",
  "error",
  "disabled",
  "normal"
];

const DEFAULT_LAYER = "system-fallback";

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizePlacement(placement = {}) {
  const x = finiteNumber(placement.x ?? placement.position?.x, 0);
  const y = finiteNumber(placement.y ?? placement.position?.y, 0);
  const width = finiteNumber(placement.width ?? placement.dimensions?.width, 24);
  const height = finiteNumber(placement.height ?? placement.dimensions?.height, 24);

  return {
    id: normalizeString(placement.id, ""),
    cadObjectId: normalizeString(placement.cadObjectId, ""),
    panelId: normalizeString(placement.panelId, ""),
    sourceId: normalizeString(placement.sourceId, ""),
    label: normalizeString(placement.label, ""),
    x,
    y,
    width: width > 0 ? width : 24,
    height: height > 0 ? height : 24,
    rotation: finiteNumber(placement.rotation, 0),
    scale: finiteNumber(placement.scale, 1) || 1,
    state: normalizeString(placement.state, placement.selected ? "selected" : "normal"),
    selected: placement.selected === true,
    warning: placement.warning === true,
    error: placement.error === true,
    disabled: placement.disabled === true,
    layerId: normalizeString(placement.layerId, DEFAULT_LAYER),
    classNames: normalizeArray(placement.classNames),
    data: placement.data && typeof placement.data === "object" ? { ...placement.data } : {}
  };
}

function chooseState(placement) {
  if (placement.disabled) return "disabled";
  if (placement.error) return "error";
  if (placement.warning) return "warning";
  if (placement.selected) return "selected";
  if (DEFAULT_STATE_PRIORITY.includes(placement.state)) return placement.state;
  return "normal";
}

function symbolAssetForState(symbol = {}, state = "normal") {
  const assets = symbol.assets && typeof symbol.assets === "object" ? symbol.assets : {};
  const stateAssets = assets.states && typeof assets.states === "object" ? assets.states : {};

  if (stateAssets[state]) return stateAssets[state];
  if (stateAssets.normal) return stateAssets.normal;
  if (assets.svg) return assets.svg;
  if (symbol.svgPath) return symbol.svgPath;
  if (symbol.svg) return symbol.svg;
  if (symbol.asset) return symbol.asset;

  if (symbol.png && typeof symbol.png === "object") {
    if (symbol.png["64"]) return symbol.png["64"];
    if (symbol.png["32"]) return symbol.png["32"];
    const firstPng = Object.values(symbol.png).find(Boolean);
    if (firstPng) return firstPng;
  }

  return null;
}

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      rendererVersion: CAD_SYMBOL_RENDERER_VERSION,
      classicProUnchanged: true
    }
  });
}

function createFallbackElement(reason = "unknown", placementInput = {}) {
  const placement = normalizePlacement(placementInput);
  const idBase = placement.id || placement.cadObjectId || placement.panelId || placement.sourceId || "fallback";

  return {
    id: `symbol-fallback-${String(idBase).replace(/[^a-zA-Z0-9_-]/g, "-")}`,
    type: "symbolFallback",
    symbolId: "system.fallback.missing",
    layerId: placement.layerId || DEFAULT_LAYER,
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height,
    rotation: placement.rotation,
    scale: placement.scale,
    fallback: true,
    reason,
    label: placement.label || "symbol fallback",
    classNames: [
      "loskot-cad-symbol",
      "loskot-cad-symbol-fallback",
      ...placement.classNames
    ],
    data: {
      ...placement.data,
      cadObjectId: placement.cadObjectId || undefined,
      panelId: placement.panelId || undefined,
      fallbackReason: reason
    },
    shape: {
      type: "rect",
      strokeDasharray: "4 3"
    },
    classicProUnchanged: true
  };
}

function symbolToRenderElement(symbol = {}, placementInput = {}) {
  const placement = normalizePlacement(placementInput);
  const state = chooseState(placement);
  const assetRef = symbolAssetForState(symbol, state);
  const symbolId = normalizeString(symbol.id || symbol.symbolId || symbol.symbolKey, "unknown.symbol");
  const idBase = placement.id || placement.cadObjectId || placement.panelId || placement.sourceId || symbolId;

  if (!assetRef) {
    return createFallbackElement(`missing asset for ${symbolId}`, placement);
  }

  return {
    id: `symbol-${symbolId}-${String(idBase).replace(/[^a-zA-Z0-9_-]/g, "-")}`,
    type: "symbol",
    symbolId,
    symbolKey: symbol.symbolKey || symbolId,
    category: symbol.category || "unknown",
    layerId: placement.layerId || symbol.layerId || DEFAULT_LAYER,
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height,
    rotation: placement.rotation,
    scale: placement.scale,
    state,
    selected: placement.selected,
    fallback: false,
    href: assetRef,
    assetRef,
    label: placement.label || symbol.label || symbol.name || symbolId,
    classNames: [
      "loskot-cad-symbol",
      `loskot-symbol-${String(symbolId).replace(/[^a-zA-Z0-9_-]/g, "-")}`,
      state ? `is-${state}` : "is-normal",
      ...placement.classNames
    ],
    data: {
      ...placement.data,
      cadObjectId: placement.cadObjectId || undefined,
      panelId: placement.panelId || undefined,
      symbolId
    },
    classicProUnchanged: true
  };
}

function normalizeRegistrySymbolResult(rawResult, requestedId) {
  if (!rawResult) {
    return {
      ok: false,
      data: null,
      warnings: [],
      errors: [{ message: `Symbol ${requestedId} nebyl nalezen.` }]
    };
  }

  if (rawResult.ok === false) {
    return {
      ok: false,
      data: rawResult.data || rawResult.symbol || null,
      warnings: rawResult.warnings || [],
      errors: rawResult.errors || [{ message: rawResult.message || `Symbol ${requestedId} nebyl nalezen.` }]
    };
  }

  if (rawResult.data || rawResult.symbol) {
    return {
      ok: true,
      data: rawResult.data || rawResult.symbol,
      warnings: rawResult.warnings || [],
      errors: rawResult.errors || []
    };
  }

  if (rawResult.id || rawResult.symbolId || rawResult.symbolKey) {
    return {
      ok: true,
      data: rawResult,
      warnings: [],
      errors: []
    };
  }

  return {
    ok: false,
    data: null,
    warnings: [],
    errors: [{ message: `Registry returned unsupported symbol result for ${requestedId}.` }]
  };
}

export function createCadSymbolRenderer(options = {}) {
  const registry = options.registry || createCadSymbolRegistry(options.registryOptions || {});
  const strict = options.strict === true;

  function getRegistrySymbol(symbolId) {
    if (!symbolId) {
      return {
        ok: false,
        data: null,
        warnings: [],
        errors: [{ message: "Missing symbolId." }]
      };
    }

    if (!registry || typeof registry.getSymbol !== "function") {
      return {
        ok: false,
        data: null,
        warnings: [],
        errors: [{ message: "Registry does not expose getSymbol()." }]
      };
    }

    const rawResult = registry.getSymbol(symbolId, { strict: true });
    return normalizeRegistrySymbolResult(rawResult, symbolId);
  }

  function renderSymbol(symbolId, placement = {}) {
    try {
      const symbolResult = getRegistrySymbol(symbolId);

      if (!symbolResult.ok || !symbolResult.data) {
        const fallback = createFallbackElement(
          `symbol not found: ${symbolId}`,
          { ...placement, data: { ...(placement.data || {}), requestedSymbolId: symbolId } }
        );

        return createResult(
          "renderSymbol",
          fallback,
          [`Symbol ${symbolId} nebyl nalezen, použit fallback.`],
          strict ? [{ message: `Symbol ${symbolId} nebyl nalezen.` }] : []
        );
      }

      const element = symbolToRenderElement(symbolResult.data, placement);
      const warnings = [
        ...(symbolResult.warnings || []),
        ...(element.fallback ? [`Symbol ${symbolId} nemá asset, použit fallback.`] : [])
      ];

      return createResult("renderSymbol", element, warnings);
    } catch (error) {
      return createRuntimeError(error, {
        module: MODULE_NAME,
        action: "renderSymbol",
        meta: {
          rendererVersion: CAD_SYMBOL_RENDERER_VERSION,
          classicProUnchanged: true
        }
      });
    }
  }

  function renderMany(items = []) {
    try {
      const sourceItems = Array.isArray(items) ? items : [];
      const elements = [];
      const warnings = [];
      const errors = [];

      sourceItems.forEach((item, index) => {
        const symbolId = item.symbolId || item.symbolKey || item.id;
        const placement = item.placement || item;
        const result = renderSymbol(symbolId, placement);

        if (result.ok || result.data) {
          elements.push({
            ...result.data,
            order: index
          });
        }

        warnings.push(...(result.warnings || []));
        errors.push(...(result.errors || []));
      });

      return createResult("renderMany", {
        elements,
        counts: {
          requested: sourceItems.length,
          rendered: elements.length,
          fallback: elements.filter((item) => item.fallback).length
        }
      }, warnings, strict ? errors : []);
    } catch (error) {
      return createRuntimeError(error, {
        module: MODULE_NAME,
        action: "renderMany",
        meta: {
          rendererVersion: CAD_SYMBOL_RENDERER_VERSION,
          classicProUnchanged: true
        }
      });
    }
  }

  function renderFallbackSymbol(reason = "manual fallback", placement = {}) {
    return createResult("renderFallbackSymbol", createFallbackElement(reason, placement), []);
  }

  function getRendererSummary() {
    const registrySummary = registry && typeof registry.getSummary === "function"
      ? registry.getSummary()
      : null;

    return createResult("getRendererSummary", {
      version: CAD_SYMBOL_RENDERER_VERSION,
      module: MODULE_NAME,
      registryAvailable: Boolean(registry),
      registrySummary: registrySummary?.data || registrySummary || null,
      supportedElementTypes: ["symbol", "symbolFallback"],
      classicProUnchanged: true
    });
  }

  function run(command, payload = {}) {
    const action = normalizeString(command, "");

    if (action === "renderSymbol") {
      return renderSymbol(payload.symbolId || payload.symbolKey, payload.placement || payload);
    }

    if (action === "renderMany") {
      return renderMany(payload.items || payload);
    }

    if (action === "renderFallbackSymbol") {
      return renderFallbackSymbol(payload.reason, payload.placement || payload);
    }

    if (action === "getRendererSummary") {
      return getRendererSummary();
    }

    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: CAD_SYMBOL_RENDERER_VERSION,
    classicProUnchanged: true,
    renderSymbol,
    renderMany,
    renderFallbackSymbol,
    symbolToRenderElement,
    getRendererSummary,
    run
  };
}

export function safeCadSymbolRenderer(options = {}) {
  try {
    return createCadSymbolRenderer(options);
  } catch (error) {
    return {
      version: CAD_SYMBOL_RENDERER_VERSION,
      classicProUnchanged: true,
      renderSymbol() {
        return createRuntimeError(error, {
          module: MODULE_NAME,
          action: "safeCadSymbolRenderer.renderSymbol",
          meta: {
            rendererVersion: CAD_SYMBOL_RENDERER_VERSION,
            classicProUnchanged: true
          }
        });
      },
      renderMany() {
        return createRuntimeError(error, {
          module: MODULE_NAME,
          action: "safeCadSymbolRenderer.renderMany",
          meta: {
            rendererVersion: CAD_SYMBOL_RENDERER_VERSION,
            classicProUnchanged: true
          }
        });
      },
      renderFallbackSymbol(reason, placement) {
        return createResult("renderFallbackSymbol", createFallbackElement(reason, placement), []);
      },
      getRendererSummary() {
        return createResult("getRendererSummary", {
          version: CAD_SYMBOL_RENDERER_VERSION,
          module: MODULE_NAME,
          registryAvailable: false,
          safeFallback: true,
          classicProUnchanged: true
        });
      },
      run() {
        return createRuntimeError(error, {
          module: MODULE_NAME,
          action: "safeCadSymbolRenderer.run",
          meta: {
            rendererVersion: CAD_SYMBOL_RENDERER_VERSION,
            classicProUnchanged: true
          }
        });
      }
    };
  }
}

export default {
  CAD_SYMBOL_RENDERER_VERSION,
  createCadSymbolRenderer,
  safeCadSymbolRenderer
};

