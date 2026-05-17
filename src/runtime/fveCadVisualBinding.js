import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

import {
  createFveCadPanelInteractionBridge
} from "./fveCadPanelInteraction.js";

export const FVE_CAD_VISUAL_BINDING_VERSION = "v46-fve-cad-visual-binding";

const DEFAULT_THEME = {
  background: "#111827",
  roof: "#1f2937",
  panelFill: "#1d4ed8",
  panelStroke: "#60a5fa",
  selectedFill: "#f59e0b",
  selectedStroke: "#fbbf24",
  text: "#e5e7eb",
  mutedText: "#9ca3af",
  stringStroke: "#22c55e",
  gridStroke: "#374151"
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function finiteNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function positiveNumber(value, fallback) {
  const numberValue = finiteNumber(value, fallback);
  return numberValue > 0 ? numberValue : fallback;
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function mergeTheme(theme = {}) {
  return {
    ...DEFAULT_THEME,
    ...(theme || {})
  };
}

function createResult(action, data = {}, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: !errors.length,
    module: "fveCadVisualBinding",
    action,
    data: {
      version: FVE_CAD_VISUAL_BINDING_VERSION,
      classicProUnchanged: true,
      ...data
    },
    warnings,
    errors
  });
}

function panelRenderElements(panel = {}, theme = DEFAULT_THEME) {
  const fill = panel.selected ? theme.selectedFill : theme.panelFill;
  const stroke = panel.selected ? theme.selectedStroke : theme.panelStroke;
  const strokeWidth = panel.selected ? 2 : 1;
  const label = panel.label || panel.panelId || panel.id;

  return [
    {
      id: `${panel.cadObjectId || panel.id}:body`,
      type: "rect",
      layerId: panel.layerId || "fve-panels",
      panelId: panel.id,
      x: panel.x,
      y: panel.y,
      width: panel.width,
      height: panel.height,
      rx: 2,
      ry: 2,
      fill,
      stroke,
      strokeWidth,
      classNames: panel.classNames || [],
      data: {
        panelId: panel.id,
        selected: panel.selected ? "true" : "false",
        stringId: panel.stringId || ""
      }
    },
    {
      id: `${panel.cadObjectId || panel.id}:label`,
      type: "text",
      layerId: panel.layerId || "fve-panels",
      panelId: panel.id,
      x: panel.center?.x ?? (panel.x + panel.width / 2),
      y: panel.center?.y ?? (panel.y + panel.height / 2),
      text: label,
      fill: theme.text,
      fontSize: Math.max(7, Math.min(12, positiveNumber(panel.height, 18) * 0.45)),
      textAnchor: "middle",
      dominantBaseline: "middle",
      classNames: ["loskot-cad-panel-label"]
    }
  ];
}

function createGridElements(viewBox = {}, theme = DEFAULT_THEME, spacing = 25) {
  const safeSpacing = positiveNumber(spacing, 25);
  const x = finiteNumber(viewBox.x, 0);
  const y = finiteNumber(viewBox.y, 0);
  const width = positiveNumber(viewBox.width, 640);
  const height = positiveNumber(viewBox.height, 360);
  const left = Math.floor(x / safeSpacing) * safeSpacing;
  const top = Math.floor(y / safeSpacing) * safeSpacing;
  const right = x + width;
  const bottom = y + height;
  const elements = [];

  for (let gx = left; gx <= right; gx += safeSpacing) {
    elements.push({
      id: `grid-v-${gx}`,
      type: "line",
      x1: gx,
      y1: top,
      x2: gx,
      y2: bottom,
      stroke: theme.gridStroke,
      strokeWidth: 0.4,
      classNames: ["loskot-cad-grid-line"]
    });
  }

  for (let gy = top; gy <= bottom; gy += safeSpacing) {
    elements.push({
      id: `grid-h-${gy}`,
      type: "line",
      x1: left,
      y1: gy,
      x2: right,
      y2: gy,
      stroke: theme.gridStroke,
      strokeWidth: 0.4,
      classNames: ["loskot-cad-grid-line"]
    });
  }

  return elements;
}

function createStringElements(viewModel = {}, theme = DEFAULT_THEME) {
  const panelsById = new Map(asArray(viewModel.panels).map((panel) => [panel.id, panel]));
  const elements = [];

  for (const stringItem of asArray(viewModel.strings)) {
    const points = asArray(stringItem.panelIds)
      .map((panelId) => panelsById.get(String(panelId)))
      .filter(Boolean)
      .map((panel) => ({ x: panel.center.x, y: panel.center.y }));

    if (points.length < 2) {
      continue;
    }

    elements.push({
      id: `string-path-${stringItem.id}`,
      type: "polyline",
      stringId: stringItem.id,
      points,
      fill: "none",
      stroke: theme.stringStroke,
      strokeWidth: 1.5,
      classNames: ["loskot-cad-string-path"]
    });
  }

  return elements;
}

function createRenderPacketFromViewModel(viewModel = {}, options = {}) {
  const theme = mergeTheme(options.theme || {});
  const showGrid = options.showGrid !== false;
  const showLabels = options.showLabels !== false;
  const viewBox = viewModel.viewBox || { x: 0, y: 0, width: 640, height: 360 };
  const gridElements = showGrid ? createGridElements(viewBox, theme, options.gridSpacing) : [];
  const panelElements = asArray(viewModel.panels)
    .flatMap((panel) => panelRenderElements(panel, theme))
    .filter((element) => showLabels || element.type !== "text");
  const stringElements = createStringElements(viewModel, theme);

  return {
    id: "loskot-fve-cad-visual-binding-packet",
    type: "svg-render-packet",
    version: FVE_CAD_VISUAL_BINDING_VERSION,
    classicProUnchanged: true,
    theme,
    viewBox,
    layers: viewModel.layerModel?.layers || [],
    elements: [
      ...gridElements,
      ...stringElements,
      ...panelElements
    ],
    panels: viewModel.panels || [],
    selection: viewModel.selection || { selectedPanelIds: [], selectedCount: 0 },
    counts: viewModel.counts || {},
    uiBindings: viewModel.uiBindings || {},
    eventTargets: asArray(viewModel.panels).map((panel) => ({
      selector: `[data-panel-id=\"${panel.id}\"]`,
      panelId: panel.id,
      actions: ["panel.click", "cad.pointer.down"]
    })),
    cssClasses: {
      root: "loskot-cad-svg-root",
      panel: "loskot-cad-fve-panel",
      selectedPanel: "is-selected",
      stringPath: "loskot-cad-string-path",
      gridLine: "loskot-cad-grid-line"
    }
  };
}

function elementToSvg(element = {}) {
  const className = asArray(element.classNames).join(" ");
  const classAttr = className ? ` class=\"${escapeXml(className)}\"` : "";
  const dataAttrs = Object.entries(element.data || {})
    .map(([key, value]) => ` data-${escapeXml(key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`))}=\"${escapeXml(value)}\"`)
    .join("");

  if (element.type === "rect") {
    return `<rect id=\"${escapeXml(element.id)}\"${classAttr}${dataAttrs} x=\"${element.x}\" y=\"${element.y}\" width=\"${element.width}\" height=\"${element.height}\" rx=\"${element.rx || 0}\" ry=\"${element.ry || 0}\" fill=\"${escapeXml(element.fill)}\" stroke=\"${escapeXml(element.stroke)}\" stroke-width=\"${element.strokeWidth || 1}\" />`;
  }

  if (element.type === "text") {
    return `<text id=\"${escapeXml(element.id)}\"${classAttr} x=\"${element.x}\" y=\"${element.y}\" fill=\"${escapeXml(element.fill)}\" font-size=\"${element.fontSize || 10}\" text-anchor=\"${escapeXml(element.textAnchor || "start")}\" dominant-baseline=\"${escapeXml(element.dominantBaseline || "auto")}\">${escapeXml(element.text)}</text>`;
  }

  if (element.type === "line") {
    return `<line id=\"${escapeXml(element.id)}\"${classAttr} x1=\"${element.x1}\" y1=\"${element.y1}\" x2=\"${element.x2}\" y2=\"${element.y2}\" stroke=\"${escapeXml(element.stroke)}\" stroke-width=\"${element.strokeWidth || 1}\" />`;
  }

  if (element.type === "polyline") {
    const points = asArray(element.points).map((point) => `${point.x},${point.y}`).join(" ");
    return `<polyline id=\"${escapeXml(element.id)}\"${classAttr} data-string-id=\"${escapeXml(element.stringId || "")}\" points=\"${escapeXml(points)}\" fill=\"${escapeXml(element.fill || "none")}\" stroke=\"${escapeXml(element.stroke)}\" stroke-width=\"${element.strokeWidth || 1}\" />`;
  }

  return `<!-- Unsupported element ${escapeXml(element.type)} -->`;
}

function packetToSvgMarkup(packet = {}) {
  const viewBox = packet.viewBox || { x: 0, y: 0, width: 640, height: 360 };
  const content = asArray(packet.elements).map(elementToSvg).join("\n  ");
  const width = Math.ceil(positiveNumber(viewBox.width, 640));
  const height = Math.ceil(positiveNumber(viewBox.height, 360));

  return `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"loskot-cad-svg-root\" viewBox=\"${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}\" width=\"${width}\" height=\"${height}\" role=\"img\" aria-label=\"LOSKOT FVE CAD panel preview\">\n  <rect x=\"${viewBox.x}\" y=\"${viewBox.y}\" width=\"${viewBox.width}\" height=\"${viewBox.height}\" fill=\"${escapeXml(packet.theme?.background || DEFAULT_THEME.background)}\" />\n  ${content}\n</svg>`;
}

function createEventBindingPlan() {
  return [
    {
      event: "click",
      selector: "[data-panel-id]",
      command: "panel.click",
      payloadMap: {
        panelId: "dataset.panelId",
        mode: "ctrlKey?toggle:replace"
      }
    },
    {
      event: "pointerdown",
      selector: ".loskot-cad-svg-root",
      command: "cad.pointer.down",
      payloadMap: {
        x: "cadX",
        y: "cadY",
        selectFromPoint: true
      }
    },
    {
      event: "pointermove",
      selector: ".loskot-cad-svg-root",
      command: "cad.pointer.move",
      payloadMap: {
        dx: "deltaX",
        dy: "deltaY"
      }
    },
    {
      event: "pointerup",
      selector: ".loskot-cad-svg-root",
      command: "cad.pointer.up",
      payloadMap: {
        finishDrag: true
      }
    },
    {
      event: "keydown",
      selector: "window",
      command: "selection.nudge",
      payloadMap: {
        direction: "Arrow key direction",
        amount: "grid step"
      }
    }
  ];
}

function normalizeVisualCommand(command) {
  const value = String(command || "");
  const aliases = {
    "panel.click": "selectPanel",
    "panel.select": "selectPanel",
    "cad.pointer.down": "startDrag",
    "cad.pointer.move": "dragBy",
    "cad.pointer.up": "endDrag",
    "selection.rectangle": "selectByRectangle",
    "selection.nudge": "nudgeSelection",
    "selection.clear": "clearSelection",
    "selection.all": "selectAllPanels",
    "strings.prepare": "prepareStringsFromSelection",
    "render.packet": "getRenderPacket",
    "render.svg": "getSvgMarkup",
    "inspector.model": "getInspectorModel"
  };

  return aliases[value] || value;
}

export function createFveCadVisualBinding(options = {}) {
  const controller = options.controller || createAppStateController(options.project || options);
  const interaction = options.interaction || createFveCadPanelInteractionBridge({
    ...options,
    controller
  });
  const theme = mergeTheme(options.theme || {});

  function getRenderPacket(payload = {}) {
    try {
      const viewModel = interaction.getCadViewModel(payload);
      if (!viewModel.ok) return viewModel;

      return createResult("getRenderPacket", {
        packet: createRenderPacketFromViewModel(viewModel.data, {
          ...payload,
          theme: payload.theme || theme
        })
      }, viewModel.warnings || []);
    } catch (error) {
      return createRuntimeError(error, {
        module: "fveCadVisualBinding",
        action: "getRenderPacket",
        data: payload
      });
    }
  }

  function getSvgMarkup(payload = {}) {
    const packetResult = getRenderPacket(payload);
    if (!packetResult.ok) return packetResult;

    return createResult("getSvgMarkup", {
      svg: packetToSvgMarkup(packetResult.data.packet),
      packet: packetResult.data.packet
    }, packetResult.warnings || []);
  }

  function getElementPlan(payload = {}) {
    const packetResult = getRenderPacket(payload);
    if (!packetResult.ok) return packetResult;

    return createResult("getElementPlan", {
      root: {
        type: "svg",
        className: "loskot-cad-svg-root",
        viewBox: packetResult.data.packet.viewBox,
        children: packetResult.data.packet.elements
      },
      packet: packetResult.data.packet
    }, packetResult.warnings || []);
  }

  function getEventBindingPlan() {
    return createResult("getEventBindingPlan", {
      bindings: createEventBindingPlan(),
      rootSelector: ".loskot-cad-svg-root"
    });
  }

  function getInspectorModel(payload = {}) {
    const packetResult = getRenderPacket(payload);
    if (!packetResult.ok) return packetResult;

    const packet = packetResult.data.packet;
    const selectedPanelIds = packet.selection?.selectedPanelIds || [];

    return createResult("getInspectorModel", {
      title: "FVE CAD Inspector",
      fields: [
        { key: "fvePanelCount", label: "FVE panely", value: packet.counts.panels || 0 },
        { key: "fveSelectionCount", label: "Vybrané panely", value: packet.counts.selectedPanels || 0 },
        { key: "fveStringCount", label: "Stringy", value: packet.counts.strings || 0 },
        { key: "selectedPanelIds", label: "ID výběru", value: selectedPanelIds.join(", ") }
      ],
      statusText: packet.uiBindings.fveCadStatusText || "FVE CAD připraven",
      selectedPanelIds,
      classicProUnchanged: true
    }, packetResult.warnings || []);
  }

  function dispatchVisualAction(command, payload = {}) {
    const action = normalizeVisualCommand(command);

    try {
      if (action === "getRenderPacket") return getRenderPacket(payload);
      if (action === "getSvgMarkup") return getSvgMarkup(payload);
      if (action === "getElementPlan") return getElementPlan(payload);
      if (action === "getEventBindingPlan") return getEventBindingPlan(payload);
      if (action === "getInspectorModel") return getInspectorModel(payload);

      if (action === "selectPanel") {
        const panelId = payload.panelId || payload.id;
        if (!panelId) {
          return createRuntimeError("selectPanel requires panelId.", {
            module: "fveCadVisualBinding",
            action: "dispatchVisualAction",
            data: payload
          });
        }

        if (interaction.editor && typeof interaction.editor.selectPanels === "function") {
          const directResult = interaction.editor.selectPanels({
            panelIds: [panelId],
            mode: payload.mode || "replace"
          });
          if (!directResult.ok) return directResult;
          return getRenderPacket(payload);
        }

        if ((payload.x !== undefined || payload.y !== undefined) && typeof interaction.selectAtPoint === "function") {
          const pointResult = interaction.selectAtPoint(payload);
          if (!pointResult.ok) return pointResult;
          return getRenderPacket(payload);
        }

        return createRuntimeError("selectPanel requires interaction.editor.selectPanels() or point coordinates.", {
          module: "fveCadVisualBinding",
          action: "dispatchVisualAction",
          data: payload
        });
      }

      if (action === "selectByRectangle") {
        const result = interaction.selectByRectangle
          ? interaction.selectByRectangle(payload)
          : interaction.runCommand("selectByRectangle", payload);
        if (!result.ok) return result;
        return getRenderPacket(payload);
      }

      if (action === "nudgeSelection") {
        const result = interaction.nudgeSelection
          ? interaction.nudgeSelection(payload)
          : interaction.runCommand("nudgeSelection", payload);
        if (!result.ok) return result;
        return getRenderPacket(payload);
      }

      if (action === "startDrag") {
        const result = interaction.startDrag
          ? interaction.startDrag(payload)
          : interaction.runCommand("startDrag", payload);
        if (!result.ok) return result;
        return getRenderPacket(payload);
      }

      if (action === "dragBy") {
        const result = interaction.dragBy
          ? interaction.dragBy(payload)
          : interaction.runCommand("dragBy", payload);
        if (!result.ok) return result;
        return getRenderPacket(payload);
      }

      if (action === "endDrag") {
        const result = interaction.endDrag
          ? interaction.endDrag(payload)
          : interaction.runCommand("endDrag", payload);
        if (!result.ok) return result;
        return getRenderPacket(payload);
      }

      if (action === "prepareStringsFromSelection") {
        const result = interaction.prepareStringsFromSelection
          ? interaction.prepareStringsFromSelection(payload)
          : interaction.runCommand("prepareStringsFromSelection", payload);
        if (!result.ok) return result;
        return getRenderPacket(payload);
      }

      if (action === "clearSelection") {
        if (interaction.editor && typeof interaction.editor.clearSelection === "function") {
          const result = interaction.editor.clearSelection();
          if (!result.ok) return result;
          return getRenderPacket(payload);
        }
        return createRuntimeError("clearSelection is not available on interaction bridge.", {
          module: "fveCadVisualBinding",
          action: "dispatchVisualAction",
          data: payload
        });
      }

      if (action === "selectAllPanels") {
        if (interaction.editor && typeof interaction.editor.selectAllPanels === "function") {
          const result = interaction.editor.selectAllPanels();
          if (!result.ok) return result;
          return getRenderPacket(payload);
        }
        return createRuntimeError("selectAllPanels is not available on interaction bridge.", {
          module: "fveCadVisualBinding",
          action: "dispatchVisualAction",
          data: payload
        });
      }

      return createRuntimeError(`Unsupported FVE CAD visual action: ${command}`, {
        module: "fveCadVisualBinding",
        action: "dispatchVisualAction",
        data: { command, payload }
      });
    } catch (error) {
      return createRuntimeError(error, {
        module: "fveCadVisualBinding",
        action: "dispatchVisualAction",
        data: { command, payload }
      });
    }
  }

  function run(command, payload = {}) {
    return dispatchVisualAction(command, payload);
  }

  return {
    version: FVE_CAD_VISUAL_BINDING_VERSION,
    controller,
    interaction,
    getRenderPacket,
    getSvgMarkup,
    getElementPlan,
    getEventBindingPlan,
    getInspectorModel,
    dispatchVisualAction,
    run
  };
}

export function safeFveCadVisualBinding(options = {}) {
  try {
    return createRuntimeResult({
      module: "fveCadVisualBinding",
      action: "safeFveCadVisualBinding",
      data: {
        version: FVE_CAD_VISUAL_BINDING_VERSION,
        binding: createFveCadVisualBinding(options)
      }
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fveCadVisualBinding",
      action: "safeFveCadVisualBinding"
    });
  }
}

export default {
  FVE_CAD_VISUAL_BINDING_VERSION,
  createFveCadVisualBinding,
  safeFveCadVisualBinding
};
