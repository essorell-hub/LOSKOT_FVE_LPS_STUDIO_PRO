import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

import {
  createFvePanelEditor
} from "./fvePanelEditor.js";

export const FVE_CAD_PANEL_INTERACTION_VERSION = "v45-fve-cad-panel-interaction";

const DEFAULT_PANEL_WIDTH = 32;
const DEFAULT_PANEL_HEIGHT = 18;
const DEFAULT_VIEW_PADDING = 24;
const DEFAULT_NUDGE_AMOUNT = 5;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values = []) {
  return [...new Set(asArray(values).map((value) => String(value)).filter(Boolean))];
}

function finiteNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function positiveNumber(value, fallback) {
  const numberValue = finiteNumber(value, fallback);
  return numberValue > 0 ? numberValue : fallback;
}

function panelId(panel = {}, index = 0) {
  return String(panel.id || panel.panelId || `panel-${index + 1}`);
}

function panelX(panel = {}) {
  return finiteNumber(panel.x ?? panel.position?.x ?? panel.cad?.x, 0);
}

function panelY(panel = {}) {
  return finiteNumber(panel.y ?? panel.position?.y ?? panel.cad?.y, 0);
}

function panelWidth(panel = {}, config = {}) {
  return positiveNumber(
    panel.width ?? panel.w ?? panel.dimensions?.width ?? panel.size?.width ?? config.panelWidth,
    DEFAULT_PANEL_WIDTH
  );
}

function panelHeight(panel = {}, config = {}) {
  return positiveNumber(
    panel.height ?? panel.h ?? panel.dimensions?.height ?? panel.size?.height ?? config.panelHeight,
    DEFAULT_PANEL_HEIGHT
  );
}

function normalizePanel(panel = {}, index = 0, config = {}) {
  const id = panelId(panel, index);
  const x = panelX(panel);
  const y = panelY(panel);
  const width = panelWidth(panel, config);
  const height = panelHeight(panel, config);

  return {
    ...panel,
    id,
    panelId: panel.panelId || id,
    x,
    y,
    width,
    height,
    position: {
      ...(panel.position || {}),
      x,
      y
    },
    dimensions: {
      ...(panel.dimensions || {}),
      width,
      height
    }
  };
}

function readState(controller, action) {
  if (!controller || typeof controller.getState !== "function") {
    return createRuntimeError("FVE CAD panel interaction requires runtime controller with getState().", {
      module: "fveCadPanelInteraction",
      action
    });
  }

  try {
    const result = controller.getState();
    if (!result || result.ok !== true) {
      return createRuntimeResult({
        ok: false,
        module: "fveCadPanelInteraction",
        action,
        data: null,
        warnings: result && Array.isArray(result.warnings) ? result.warnings : [],
        errors: result && Array.isArray(result.errors) && result.errors.length
          ? result.errors
          : [{ message: "Runtime state is not available." }]
      });
    }

    return createRuntimeResult({
      module: "fveCadPanelInteraction",
      action,
      data: result.data,
      warnings: result.warnings || []
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fveCadPanelInteraction",
      action
    });
  }
}

function readPanels(state = {}, config = {}) {
  return asArray(state.project?.fve?.panels).map((panel, index) => normalizePanel(panel, index, config));
}

function readStrings(state = {}) {
  return asArray(state.project?.fve?.strings).map((stringItem, index) => ({
    ...stringItem,
    id: String(stringItem.id || `string-${index + 1}`),
    panelIds: uniqueStrings(stringItem.panelIds || [])
  }));
}

function currentSelection(state = {}) {
  return uniqueStrings(state.selection?.fvePanelIds || []);
}

function boundsForPanel(panel) {
  return {
    left: panel.x,
    top: panel.y,
    right: panel.x + panel.width,
    bottom: panel.y + panel.height,
    width: panel.width,
    height: panel.height
  };
}

function createPanelShape(panel, index, selectedIds = [], strings = []) {
  const selectedSet = new Set(selectedIds);
  const bounds = boundsForPanel(panel);
  const assignedString = panel.stringId || strings.find((stringItem) => stringItem.panelIds.includes(panel.id))?.id || null;

  return {
    id: panel.id,
    panelId: panel.panelId || panel.id,
    cadObjectId: `fve-panel:${panel.id}`,
    type: "fve-panel",
    layerId: "fve-panels",
    index,
    label: panel.label || panel.name || panel.id,
    x: panel.x,
    y: panel.y,
    width: panel.width,
    height: panel.height,
    center: {
      x: panel.x + panel.width / 2,
      y: panel.y + panel.height / 2
    },
    bounds,
    selected: selectedSet.has(panel.id),
    stringId: assignedString,
    status: assignedString ? "STRING_PREPARED" : "PLACED",
    classNames: [
      "loskot-cad-fve-panel",
      selectedSet.has(panel.id) ? "is-selected" : "",
      assignedString ? "has-string" : "no-string"
    ].filter(Boolean),
    source: "project.fve.panels"
  };
}

function computeViewBox(shapes = [], padding = DEFAULT_VIEW_PADDING) {
  if (!shapes.length) {
    return {
      x: 0,
      y: 0,
      width: 640,
      height: 360,
      padding
    };
  }

  const left = Math.min(...shapes.map((shape) => shape.bounds.left));
  const top = Math.min(...shapes.map((shape) => shape.bounds.top));
  const right = Math.max(...shapes.map((shape) => shape.bounds.right));
  const bottom = Math.max(...shapes.map((shape) => shape.bounds.bottom));

  return {
    x: left - padding,
    y: top - padding,
    width: Math.max(1, right - left + padding * 2),
    height: Math.max(1, bottom - top + padding * 2),
    padding
  };
}

function normalizePoint(payload = {}) {
  return {
    x: finiteNumber(payload.x ?? payload.clientX ?? payload.cadX, 0),
    y: finiteNumber(payload.y ?? payload.clientY ?? payload.cadY, 0)
  };
}

function normalizeRect(payload = {}) {
  if (payload.rect && typeof payload.rect === "object") {
    return normalizeRect(payload.rect);
  }

  const hasEdges = payload.left !== undefined || payload.right !== undefined || payload.top !== undefined || payload.bottom !== undefined;
  if (hasEdges) {
    const left = finiteNumber(payload.left, 0);
    const right = finiteNumber(payload.right, left);
    const top = finiteNumber(payload.top, 0);
    const bottom = finiteNumber(payload.bottom, top);
    return {
      left: Math.min(left, right),
      top: Math.min(top, bottom),
      right: Math.max(left, right),
      bottom: Math.max(top, bottom)
    };
  }

  const x1 = finiteNumber(payload.x1 ?? payload.startX ?? payload.x, 0);
  const y1 = finiteNumber(payload.y1 ?? payload.startY ?? payload.y, 0);
  const x2 = payload.x2 !== undefined || payload.endX !== undefined
    ? finiteNumber(payload.x2 ?? payload.endX, x1)
    : x1 + finiteNumber(payload.width, 0);
  const y2 = payload.y2 !== undefined || payload.endY !== undefined
    ? finiteNumber(payload.y2 ?? payload.endY, y1)
    : y1 + finiteNumber(payload.height, 0);

  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    right: Math.max(x1, x2),
    bottom: Math.max(y1, y2)
  };
}

function containsPoint(shape, point) {
  return point.x >= shape.bounds.left &&
    point.x <= shape.bounds.right &&
    point.y >= shape.bounds.top &&
    point.y <= shape.bounds.bottom;
}

function intersectsRect(shape, rect) {
  return !(shape.bounds.right < rect.left ||
    shape.bounds.left > rect.right ||
    shape.bounds.bottom < rect.top ||
    shape.bounds.top > rect.bottom);
}

function directionToDelta(payload = {}) {
  const amount = finiteNumber(payload.amount ?? payload.step, DEFAULT_NUDGE_AMOUNT);
  const direction = String(payload.direction || "").toLowerCase();
  const explicitDx = payload.dx ?? payload.deltaX;
  const explicitDy = payload.dy ?? payload.deltaY;

  if (explicitDx !== undefined || explicitDy !== undefined) {
    return {
      dx: finiteNumber(explicitDx, 0),
      dy: finiteNumber(explicitDy, 0)
    };
  }

  if (direction === "left") return { dx: -amount, dy: 0 };
  if (direction === "right") return { dx: amount, dy: 0 };
  if (direction === "up") return { dx: 0, dy: -amount };
  if (direction === "down") return { dx: 0, dy: amount };

  return { dx: 0, dy: 0 };
}

function makeResult(action, data = {}, warnings = [], errors = []) {
  return createRuntimeResult({
    ok: !errors.length,
    module: "fveCadPanelInteraction",
    action,
    data: {
      version: FVE_CAD_PANEL_INTERACTION_VERSION,
      ...data
    },
    warnings,
    errors
  });
}

function attachViewModelResult(action, baseResult, getCadViewModel) {
  if (!baseResult || baseResult.ok !== true) {
    return baseResult;
  }

  const viewModel = getCadViewModel();

  return makeResult(action, {
    result: baseResult.data,
    viewModel: viewModel.ok ? viewModel.data : null
  }, [
    ...((baseResult && baseResult.warnings) || []),
    ...((viewModel && viewModel.warnings) || [])
  ], [
    ...((baseResult && baseResult.errors) || []),
    ...((viewModel && viewModel.errors) || [])
  ]);
}

export function createFveCadPanelInteractionBridge(options = {}) {
  const controller = options.controller || createAppStateController(options.project || options);
  const editor = options.editor || createFvePanelEditor({ controller });
  const config = {
    panelWidth: positiveNumber(options.panelWidth, DEFAULT_PANEL_WIDTH),
    panelHeight: positiveNumber(options.panelHeight, DEFAULT_PANEL_HEIGHT),
    viewPadding: positiveNumber(options.viewPadding, DEFAULT_VIEW_PADDING),
    nudgeAmount: positiveNumber(options.nudgeAmount, DEFAULT_NUDGE_AMOUNT)
  };
  let dragSession = null;

  function getCadViewModel(payload = {}) {
    const stateResult = readState(controller, "getCadViewModel");
    if (!stateResult.ok) return stateResult;

    const state = stateResult.data;
    const panels = readPanels(state, config);
    const strings = readStrings(state);
    const selectedPanelIds = currentSelection(state);
    const shapes = panels.map((panel, index) => createPanelShape(panel, index, selectedPanelIds, strings));
    const viewPadding = positiveNumber(payload.viewPadding ?? config.viewPadding, config.viewPadding);
    const viewBox = computeViewBox(shapes, viewPadding);

    return makeResult("getCadViewModel", {
      classicProUnchanged: true,
      layerModel: {
        activeLayerId: "fve-panels",
        layers: [
          {
            id: "fve-panels",
            name: "FVE panely",
            kind: "runtime-cad-layer",
            visible: true,
            locked: false,
            objectCount: shapes.length
          },
          {
            id: "fve-strings",
            name: "FVE stringy",
            kind: "runtime-data-layer",
            visible: true,
            locked: false,
            objectCount: strings.length
          }
        ]
      },
      viewBox,
      panels: shapes,
      strings,
      selection: {
        selectedPanelIds,
        selectedCount: selectedPanelIds.length
      },
      counts: {
        panels: shapes.length,
        selectedPanels: selectedPanelIds.length,
        strings: strings.length
      },
      commands: [
        "hitTestPanel",
        "selectAtPoint",
        "selectByRectangle",
        "nudgeSelection",
        "startDrag",
        "dragBy",
        "endDrag",
        "prepareStringsFromSelection"
      ],
      uiBindings: {
        fvePanelCount: shapes.length,
        fveSelectionCount: selectedPanelIds.length,
        fveStringCount: strings.length,
        fveCadStatusText: `${selectedPanelIds.length}/${shapes.length} FVE panelů vybráno`
      }
    }, stateResult.warnings || []);
  }

  function hitTestPanel(payload = {}) {
    const point = normalizePoint(payload);
    const viewModel = getCadViewModel(payload);
    if (!viewModel.ok) return viewModel;

    const panels = [...viewModel.data.panels].sort((left, right) => right.index - left.index);
    const hit = panels.find((shape) => containsPoint(shape, point)) || null;

    return makeResult("hitTestPanel", {
      point,
      panel: hit,
      panelId: hit ? hit.id : null,
      hit: Boolean(hit)
    }, viewModel.warnings || []);
  }

  function selectAtPoint(payload = {}) {
    const mode = payload.mode || "replace";
    const hitResult = hitTestPanel(payload);
    if (!hitResult.ok) return hitResult;

    if (!hitResult.data.hit) {
      if (mode === "replace" && payload.clearOnMiss !== false) {
        const clearResult = editor.clearSelection();
        return attachViewModelResult("selectAtPoint", clearResult, getCadViewModel);
      }

      return makeResult("selectAtPoint", {
        hit: false,
        selectedPanelIds: currentSelection(readState(controller, "selectAtPoint").data || {})
      }, ["Na zadaném bodě není žádný FVE panel."]);
    }

    const selectionResult = editor.selectPanels({
      panelIds: [hitResult.data.panelId],
      mode
    });

    return attachViewModelResult("selectAtPoint", selectionResult, getCadViewModel);
  }

  function selectByRectangle(payload = {}) {
    const mode = payload.mode || "replace";
    const rect = normalizeRect(payload);
    const viewModel = getCadViewModel(payload);
    if (!viewModel.ok) return viewModel;

    const matchedPanelIds = viewModel.data.panels
      .filter((shape) => intersectsRect(shape, rect))
      .map((shape) => shape.id);

    const selectionResult = editor.selectPanels({
      panelIds: matchedPanelIds,
      mode
    });

    if (!selectionResult.ok) return selectionResult;

    const nextViewModel = getCadViewModel();
    return makeResult("selectByRectangle", {
      rect,
      matchedPanelIds,
      result: selectionResult.data,
      viewModel: nextViewModel.ok ? nextViewModel.data : null
    }, [
      ...((selectionResult && selectionResult.warnings) || []),
      ...((nextViewModel && nextViewModel.warnings) || [])
    ], [
      ...((selectionResult && selectionResult.errors) || []),
      ...((nextViewModel && nextViewModel.errors) || [])
    ]);
  }

  function nudgeSelection(payload = {}) {
    const delta = directionToDelta({
      amount: payload.amount ?? config.nudgeAmount,
      ...payload
    });

    if (!Number.isFinite(delta.dx) || !Number.isFinite(delta.dy)) {
      return createRuntimeError("FVE CAD nudge requires finite dx and dy values.", {
        module: "fveCadPanelInteraction",
        action: "nudgeSelection",
        data: payload
      });
    }

    const moveResult = editor.moveSelection(delta);
    return attachViewModelResult("nudgeSelection", moveResult, getCadViewModel);
  }

  function startDrag(payload = {}) {
    const point = normalizePoint(payload);

    if (payload.panelId) {
      const selectResult = editor.selectPanels({
        panelIds: [payload.panelId],
        mode: payload.mode || "replace"
      });
      if (!selectResult.ok) return selectResult;
    } else if (payload.selectFromPoint !== false) {
      const selectResult = selectAtPoint({
        ...payload,
        mode: payload.mode || "replace",
        clearOnMiss: payload.clearOnMiss !== false
      });
      if (!selectResult.ok) return selectResult;
    }

    const viewModel = getCadViewModel();
    if (!viewModel.ok) return viewModel;

    const selectedPanelIds = viewModel.data.selection.selectedPanelIds;
    const selectedPanels = viewModel.data.panels.filter((panel) => selectedPanelIds.includes(panel.id));

    dragSession = {
      id: `drag-${Date.now().toString(36)}`,
      startPoint: point,
      lastPoint: point,
      selectedPanelIds,
      startPanels: selectedPanels.map((panel) => ({
        id: panel.id,
        x: panel.x,
        y: panel.y
      }))
    };

    return makeResult("startDrag", {
      dragSession,
      viewModel: viewModel.data
    }, viewModel.warnings || []);
  }

  function dragBy(payload = {}) {
    if (!dragSession) {
      return createRuntimeError("FVE CAD drag session is not active.", {
        module: "fveCadPanelInteraction",
        action: "dragBy",
        data: payload
      });
    }

    const delta = directionToDelta(payload);
    const moveResult = editor.movePanels({
      panelIds: dragSession.selectedPanelIds,
      dx: delta.dx,
      dy: delta.dy
    });

    if (!moveResult.ok) return moveResult;

    dragSession = {
      ...dragSession,
      lastDelta: delta,
      totalDx: finiteNumber(dragSession.totalDx, 0) + delta.dx,
      totalDy: finiteNumber(dragSession.totalDy, 0) + delta.dy
    };

    const viewModel = getCadViewModel();
    return makeResult("dragBy", {
      dragSession,
      result: moveResult.data,
      viewModel: viewModel.ok ? viewModel.data : null
    }, [
      ...((moveResult && moveResult.warnings) || []),
      ...((viewModel && viewModel.warnings) || [])
    ], [
      ...((moveResult && moveResult.errors) || []),
      ...((viewModel && viewModel.errors) || [])
    ]);
  }

  function endDrag() {
    const finishedSession = dragSession;
    dragSession = null;
    const viewModel = getCadViewModel();

    return makeResult("endDrag", {
      dragSession: finishedSession,
      dragActive: false,
      viewModel: viewModel.ok ? viewModel.data : null
    }, viewModel.warnings || [], viewModel.errors || []);
  }

  function prepareStringsFromSelection(payload = {}) {
    const prepareResult = editor.prepareStrings(payload);
    return attachViewModelResult("prepareStringsFromSelection", prepareResult, getCadViewModel);
  }

  function getUiSummary() {
    const viewModel = getCadViewModel();
    if (!viewModel.ok) return viewModel;

    return makeResult("getUiSummary", {
      ...viewModel.data.uiBindings,
      classicProUnchanged: true,
      commandCount: viewModel.data.commands.length
    }, viewModel.warnings || []);
  }

  function runCommand(command, payload = {}) {
    try {
      if (command === "getCadViewModel") return getCadViewModel(payload);
      if (command === "hitTestPanel") return hitTestPanel(payload);
      if (command === "selectAtPoint") return selectAtPoint(payload);
      if (command === "selectByRectangle") return selectByRectangle(payload);
      if (command === "nudgeSelection") return nudgeSelection(payload);
      if (command === "startDrag") return startDrag(payload);
      if (command === "dragBy") return dragBy(payload);
      if (command === "endDrag") return endDrag(payload);
      if (command === "prepareStringsFromSelection") return prepareStringsFromSelection(payload);
      if (command === "getUiSummary") return getUiSummary(payload);

      return createRuntimeError(`Unsupported FVE CAD panel interaction command: ${command}`, {
        module: "fveCadPanelInteraction",
        action: "runCommand",
        data: { command, payload }
      });
    } catch (error) {
      return createRuntimeError(error, {
        module: "fveCadPanelInteraction",
        action: command || "runCommand",
        data: payload
      });
    }
  }

  return {
    version: FVE_CAD_PANEL_INTERACTION_VERSION,
    controller,
    editor,
    config,
    getCadViewModel,
    hitTestPanel,
    selectAtPoint,
    selectByRectangle,
    nudgeSelection,
    startDrag,
    dragBy,
    endDrag,
    prepareStringsFromSelection,
    getUiSummary,
    runCommand
  };
}

export function safeFveCadPanelInteractionBridge(options = {}) {
  try {
    return createRuntimeResult({
      module: "fveCadPanelInteraction",
      action: "safeFveCadPanelInteractionBridge",
      data: {
        version: FVE_CAD_PANEL_INTERACTION_VERSION,
        bridge: createFveCadPanelInteractionBridge(options)
      }
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fveCadPanelInteraction",
      action: "safeFveCadPanelInteractionBridge"
    });
  }
}

export default {
  FVE_CAD_PANEL_INTERACTION_VERSION,
  createFveCadPanelInteractionBridge,
  safeFveCadPanelInteractionBridge
};
