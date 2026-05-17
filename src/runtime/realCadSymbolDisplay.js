import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createCadSymbolRenderer
} from "./cadSymbolRenderer.js";

import {
  createFveCadVisualBinding
} from "./fveCadVisualBinding.js";


export const REAL_CAD_SYMBOL_DISPLAY_VERSION = "v51-real-cad-symbol-display";

const MODULE_NAME = "realCadSymbolDisplay";

function createResult(action, data = null, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: errors.length === 0,
    module: MODULE_NAME,
    action,
    data,
    warnings,
    errors,
    meta: {
      moduleVersion: REAL_CAD_SYMBOL_DISPLAY_VERSION,
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

function panelToSymbolItem(panel = {}) {
  const selected = panel.selected === true;
  return {
    symbolId: panel.symbolId || "fve.panel.basic",
    id: panel.id || panel.panelId || panel.cadObjectId,
    panelId: panel.panelId || panel.id,
    cadObjectId: panel.cadObjectId || `fve-panel:${panel.panelId || panel.id || "unknown"}`,
    x: finiteNumber(panel.x ?? panel.bounds?.x, 0),
    y: finiteNumber(panel.y ?? panel.bounds?.y, 0),
    width: finiteNumber(panel.width ?? panel.bounds?.width, 32),
    height: finiteNumber(panel.height ?? panel.bounds?.height, 18),
    selected,
    warning: panel.status === "WARNING",
    error: panel.status === "ERROR",
    state: selected ? "selected" : (panel.status === "WARNING" ? "warning" : (panel.status === "ERROR" ? "error" : "normal")),
    layerId: panel.layerId || "fve-panels",
    label: panel.label || panel.id || panel.panelId || "FVE panel",
    data: {
      panelId: panel.panelId || panel.id,
      cadObjectId: panel.cadObjectId || `fve-panel:${panel.panelId || panel.id || "unknown"}`
    }
  };
}

function symbolElementToSvg(element = {}) {
  const x = finiteNumber(element.x, 0);
  const y = finiteNumber(element.y, 0);
  const width = finiteNumber(element.width, 24);
  const height = finiteNumber(element.height, 24);
  const dataPanel = element.data?.panelId ? ` data-panel-id="${String(element.data.panelId)}"` : "";
  const dataCad = element.data?.cadObjectId ? ` data-cad-object-id="${String(element.data.cadObjectId)}"` : "";
  const classes = normalizeArray(element.classNames).join(" ");
  const classAttr = classes ? ` class="${classes}"` : "";
  const label = element.label ? String(element.label) : "";

  if (element.type === "symbol" && element.href) {
    return `<g data-symbol-id="${String(element.symbolId)}"${dataPanel}${dataCad}${classAttr} transform="translate(${x} ${y}) rotate(${finiteNumber(element.rotation, 0)})"><image href="${String(element.href)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none"></image>${label ? `<title>${label}</title>` : ""}</g>`;
  }

  return `<g data-symbol-id="${String(element.symbolId || "system.fallback.missing")}"${dataPanel}${dataCad}${classAttr} transform="translate(${x} ${y})"><rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="currentColor" stroke-dasharray="4 3"></rect>${label ? `<text x="2" y="${Math.max(10, height / 2)}">${label}</text>` : ""}</g>`;
}

function buildSymbolDisplayPacket(viewModel = {}, renderer) {
  const panels = normalizeArray(viewModel.panels);
  const items = panels.map(panelToSymbolItem);
  const rendered = renderer.renderMany(items);
  const elements = rendered.data?.elements || [];
  const svgFragments = elements.map(symbolElementToSvg);

  return {
    version: REAL_CAD_SYMBOL_DISPLAY_VERSION,
    classicProUnchanged: true,
    mode: "symbol-display",
    sourcePanelCount: panels.length,
    symbolCount: elements.length,
    fallbackCount: elements.filter((item) => item.fallback).length,
    elements,
    svgFragments,
    warnings: rendered.warnings || [],
    errors: rendered.errors || []
  };
}

export function createRealCadSymbolDisplay(options = {}) {
  const renderer = options.renderer || createCadSymbolRenderer(options.rendererOptions || {});
  const visualBinding = options.visualBinding || createFveCadVisualBinding(options.visualBindingOptions || {});

  function getSymbolDisplayPacket(payload = {}) {
    try {
      const basePacketResult = typeof visualBinding.getRenderPacket === "function"
        ? visualBinding.getRenderPacket(payload)
        : null;
      const basePacket = basePacketResult?.data || basePacketResult || {};
      const viewModel = payload.viewModel || basePacket.viewModel || payload;
      const symbolPacket = buildSymbolDisplayPacket(viewModel, renderer);

      return createResult("getSymbolDisplayPacket", {
        basePacket,
        symbolPacket,
        classicProUnchanged: true
      }, symbolPacket.warnings, symbolPacket.errors);
    } catch (error) {
      return createRuntimeError(error, {
        module: MODULE_NAME,
        action: "getSymbolDisplayPacket",
        meta: { moduleVersion: REAL_CAD_SYMBOL_DISPLAY_VERSION, classicProUnchanged: true }
      });
    }
  }

  function getSymbolSvgOverlay(payload = {}) {
    const packet = getSymbolDisplayPacket(payload);
    if (!packet.ok && !packet.data) return packet;
    const fragments = packet.data?.symbolPacket?.svgFragments || [];
    return createResult("getSymbolSvgOverlay", fragments.join("\n"), packet.warnings || [], packet.errors || []);
  }

  function getDisplaySummary(payload = {}) {
    const packet = getSymbolDisplayPacket(payload);
    const symbolPacket = packet.data?.symbolPacket || {};
    return createResult("getDisplaySummary", {
      version: REAL_CAD_SYMBOL_DISPLAY_VERSION,
      sourcePanelCount: symbolPacket.sourcePanelCount || 0,
      symbolCount: symbolPacket.symbolCount || 0,
      fallbackCount: symbolPacket.fallbackCount || 0,
      classicProUnchanged: true
    }, packet.warnings || [], packet.errors || []);
  }

  function run(command, payload = {}) {
    if (command === "getSymbolDisplayPacket") return getSymbolDisplayPacket(payload);
    if (command === "getSymbolSvgOverlay") return getSymbolSvgOverlay(payload);
    if (command === "getDisplaySummary") return getDisplaySummary(payload);
    return createResult("run", null, [], [{ message: `Unsupported command: ${command}` }]);
  }

  return {
    version: REAL_CAD_SYMBOL_DISPLAY_VERSION,
    classicProUnchanged: true,
    getSymbolDisplayPacket,
    getSymbolSvgOverlay,
    getDisplaySummary,
    run
  };
}

export function safeRealCadSymbolDisplay(options = {}) {
  try {
    return createRealCadSymbolDisplay(options);
  } catch (error) {
    return {
      version: REAL_CAD_SYMBOL_DISPLAY_VERSION,
      classicProUnchanged: true,
      getSymbolDisplayPacket() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.getSymbolDisplayPacket" });
      },
      getSymbolSvgOverlay() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.getSymbolSvgOverlay" });
      },
      getDisplaySummary() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.getDisplaySummary" });
      },
      run() {
        return createRuntimeError(error, { module: MODULE_NAME, action: "safe.run" });
      }
    };
  }
}

export default {
  REAL_CAD_SYMBOL_DISPLAY_VERSION,
  createRealCadSymbolDisplay,
  safeRealCadSymbolDisplay
};

