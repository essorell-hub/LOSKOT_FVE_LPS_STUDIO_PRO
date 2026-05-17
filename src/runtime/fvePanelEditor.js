import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

export const FVE_PANEL_EDITOR_VERSION = "v44-fve-panel-editor";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values = []) {
  return [...new Set(asArray(values).map((value) => String(value)).filter(Boolean))];
}

function toFiniteNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function panelId(panel = {}, index = 0) {
  return String(panel.id || panel.panelId || `panel-${index + 1}`);
}

function getPanelX(panel = {}) {
  return toFiniteNumber(panel.x ?? panel.position?.x, 0);
}

function getPanelY(panel = {}) {
  return toFiniteNumber(panel.y ?? panel.position?.y, 0);
}

function normalizePanel(panel = {}, index = 0) {
  const id = panelId(panel, index);
  const x = getPanelX(panel);
  const y = getPanelY(panel);

  return {
    ...panel,
    id,
    panelId: panel.panelId || id,
    x,
    y,
    position: {
      ...(panel.position || {}),
      x,
      y
    }
  };
}

function sortPanelsForStringing(panels = []) {
  return [...panels].sort((left, right) => {
    const leftRow = toFiniteNumber(left.row ?? left.position?.row, 0);
    const rightRow = toFiniteNumber(right.row ?? right.position?.row, 0);
    const leftCol = toFiniteNumber(left.col ?? left.column ?? left.position?.col, 0);
    const rightCol = toFiniteNumber(right.col ?? right.column ?? right.position?.col, 0);

    if (leftRow !== rightRow) return leftRow - rightRow;
    if (leftCol !== rightCol) return leftCol - rightCol;
    if (left.y !== right.y) return left.y - right.y;
    if (left.x !== right.x) return left.x - right.x;
    return left.id.localeCompare(right.id);
  });
}

function readState(controller, action) {
  if (!controller || typeof controller.getState !== "function") {
    return createRuntimeError("FVE panel editor requires runtime controller with getState().", {
      module: "fvePanelEditor",
      action
    });
  }

  let result;

  try {
    result = controller.getState();
  } catch (error) {
    return createRuntimeError(error, {
      module: "fvePanelEditor",
      action
    });
  }

  if (!result || result.ok !== true) {
    return createRuntimeResult({
      ok: false,
      module: "fvePanelEditor",
      action,
      data: null,
      warnings: result && Array.isArray(result.warnings) ? result.warnings : [],
      errors: result && Array.isArray(result.errors) && result.errors.length
        ? result.errors
        : [{ message: "Runtime state is not available." }]
    });
  }

  return createRuntimeResult({
    module: "fvePanelEditor",
    action,
    data: result.data,
    warnings: result.warnings || []
  });
}

function readPanelsFromState(state = {}) {
  return asArray(state.project?.fve?.panels).map((panel, index) => normalizePanel(panel, index));
}

function currentSelection(state = {}) {
  return uniqueStrings(state.selection?.fvePanelIds || []);
}

function createEditorResult(action, data = {}, warnings = []) {
  return createRuntimeResult({
    module: "fvePanelEditor",
    action,
    data: {
      version: FVE_PANEL_EDITOR_VERSION,
      ...data
    },
    warnings
  });
}

function setFveSelection(controller, selectedPanelIds, action) {
  if (!controller || typeof controller.setSelection !== "function") {
    return createRuntimeError("FVE panel editor requires runtime controller with setSelection().", {
      module: "fvePanelEditor",
      action
    });
  }

  try {
    return controller.setSelection({ fvePanelIds: selectedPanelIds });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fvePanelEditor",
      action
    });
  }
}

function updateFveProject(controller, state, fvePatch, action) {
  if (!controller || typeof controller.updateProject !== "function") {
    return createRuntimeError("FVE panel editor requires runtime controller with updateProject().", {
      module: "fvePanelEditor",
      action
    });
  }

  try {
    return controller.updateProject({
      fve: {
        ...(state.project?.fve || {}),
        ...fvePatch
      },
      metadata: {
        ...(state.project?.metadata || {}),
        fvePanelEditorVersion: FVE_PANEL_EDITOR_VERSION
      }
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fvePanelEditor",
      action
    });
  }
}

function resolvePanelIds(panels = [], requestedIds = []) {
  const existingIds = new Set(panels.map((panel) => panel.id));
  const ids = uniqueStrings(requestedIds).filter((id) => existingIds.has(id));
  const missingIds = uniqueStrings(requestedIds).filter((id) => !existingIds.has(id));

  return {
    ids,
    missingIds
  };
}

function applySelectionMode(currentIds = [], incomingIds = [], mode = "replace") {
  const current = uniqueStrings(currentIds);
  const incoming = uniqueStrings(incomingIds);

  if (mode === "add") {
    return uniqueStrings([...current, ...incoming]);
  }

  if (mode === "remove") {
    const removeIds = new Set(incoming);
    return current.filter((id) => !removeIds.has(id));
  }

  if (mode === "toggle") {
    const selected = new Set(current);
    for (const id of incoming) {
      if (selected.has(id)) {
        selected.delete(id);
      } else {
        selected.add(id);
      }
    }
    return [...selected];
  }

  return incoming;
}

function normalizeStringPayload(payload = {}, panels = [], selectedIds = []) {
  const requestedIds = Array.isArray(payload.panelIds)
    ? payload.panelIds
    : selectedIds.length
      ? selectedIds
      : panels.map((panel) => panel.id);
  const maxPanelsPerString = Math.max(1, Math.floor(toFiniteNumber(payload.maxPanelsPerString, requestedIds.length || 1)));
  const stringPrefix = payload.stringPrefix || "S";

  return {
    requestedIds,
    maxPanelsPerString,
    stringPrefix
  };
}

export function createFvePanelEditor(options = {}) {
  const controller = options.controller || createAppStateController(options.project || options);

  function listPanels() {
    const stateResult = readState(controller, "listPanels");
    if (!stateResult.ok) return stateResult;

    const state = stateResult.data;
    const panels = readPanelsFromState(state);

    return createEditorResult("listPanels", {
      panels,
      panelCount: panels.length,
      selectedPanelIds: currentSelection(state)
    }, stateResult.warnings || []);
  }

  function selectPanels(payload = {}) {
    const stateResult = readState(controller, "selectPanels");
    if (!stateResult.ok) return stateResult;

    const state = stateResult.data;
    const panels = readPanelsFromState(state);
    const requestedIds = Array.isArray(payload) ? payload : (payload.panelIds || payload.ids || []);
    const mode = Array.isArray(payload) ? "replace" : (payload.mode || "replace");
    const resolved = resolvePanelIds(panels, requestedIds);
    const selectedPanelIds = applySelectionMode(currentSelection(state), resolved.ids, mode);
    const selectionResult = setFveSelection(controller, selectedPanelIds, "selectPanels");

    if (!selectionResult.ok) return selectionResult;

    return createEditorResult("selectPanels", {
      selectedPanelIds,
      selectedCount: selectedPanelIds.length,
      missingPanelIds: resolved.missingIds,
      mode
    }, resolved.missingIds.length ? [`Ignorovány neexistující FVE panely: ${resolved.missingIds.join(", ")}.`] : []);
  }

  function selectAllPanels() {
    const stateResult = readState(controller, "selectAllPanels");
    if (!stateResult.ok) return stateResult;

    const panels = readPanelsFromState(stateResult.data);
    const panelIds = panels.map((panel) => panel.id);
    const selectionResult = setFveSelection(controller, panelIds, "selectAllPanels");

    if (!selectionResult.ok) return selectionResult;

    return createEditorResult("selectAllPanels", {
      selectedPanelIds: panelIds,
      selectedCount: panelIds.length
    });
  }

  function clearSelection() {
    const selectionResult = setFveSelection(controller, [], "clearSelection");

    if (!selectionResult.ok) return selectionResult;

    return createEditorResult("clearSelection", {
      selectedPanelIds: [],
      selectedCount: 0
    });
  }

  function movePanels(payload = {}) {
    const stateResult = readState(controller, "movePanels");
    if (!stateResult.ok) return stateResult;

    const dx = Number(payload.dx ?? payload.deltaX ?? 0);
    const dy = Number(payload.dy ?? payload.deltaY ?? 0);

    if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
      return createRuntimeError("FVE panel move requires finite dx and dy values.", {
        module: "fvePanelEditor",
        action: "movePanels",
        data: payload
      });
    }

    const state = stateResult.data;
    const panels = readPanelsFromState(state);
    const requestedIds = Array.isArray(payload.panelIds) && payload.panelIds.length
      ? payload.panelIds
      : currentSelection(state);
    const resolved = resolvePanelIds(panels, requestedIds);
    const moveSet = new Set(resolved.ids);
    const movedPanels = [];

    const nextPanels = panels.map((panel) => {
      if (!moveSet.has(panel.id)) {
        return panel;
      }

      const x = getPanelX(panel) + dx;
      const y = getPanelY(panel) + dy;
      const updatedPanel = {
        ...panel,
        x,
        y,
        position: {
          ...(panel.position || {}),
          x,
          y
        }
      };

      movedPanels.push(updatedPanel);
      return updatedPanel;
    });

    const warnings = [];
    if (!resolved.ids.length) {
      warnings.push("Není vybraný žádný existující FVE panel k přesunu.");
    }
    if (resolved.missingIds.length) {
      warnings.push(`Ignorovány neexistující FVE panely: ${resolved.missingIds.join(", ")}.`);
    }

    if (!resolved.ids.length) {
      return createEditorResult("movePanels", {
        movedPanelIds: [],
        movedCount: 0,
        dx,
        dy,
        panels
      }, warnings);
    }

    const updateResult = updateFveProject(controller, state, { panels: nextPanels }, "movePanels");
    if (!updateResult.ok) return updateResult;

    const selectionResult = setFveSelection(controller, resolved.ids, "movePanels");
    if (!selectionResult.ok) return selectionResult;

    return createEditorResult("movePanels", {
      movedPanelIds: resolved.ids,
      movedPanels,
      movedCount: movedPanels.length,
      dx,
      dy,
      panels: nextPanels
    }, warnings);
  }

  function moveSelection(payload = {}) {
    return movePanels(payload);
  }

  function prepareStrings(payload = {}) {
    const stateResult = readState(controller, "prepareStrings");
    if (!stateResult.ok) return stateResult;

    const state = stateResult.data;
    const panels = readPanelsFromState(state);
    const selectedIds = currentSelection(state);
    const stringPayload = normalizeStringPayload(payload, panels, selectedIds);
    const resolved = resolvePanelIds(panels, stringPayload.requestedIds);
    const targetSet = new Set(resolved.ids);
    const sortedTargets = sortPanelsForStringing(panels.filter((panel) => targetSet.has(panel.id)));
    const strings = [];
    const panelToString = new Map();

    for (let index = 0; index < sortedTargets.length; index += stringPayload.maxPanelsPerString) {
      const chunk = sortedTargets.slice(index, index + stringPayload.maxPanelsPerString);
      const number = Math.floor(index / stringPayload.maxPanelsPerString) + 1;
      const id = `${stringPayload.stringPrefix}${number}`;
      const panelIds = chunk.map((panel) => panel.id);

      strings.push({
        id,
        name: `${stringPayload.stringPrefix}-${number}`,
        panelIds,
        panelCount: panelIds.length,
        status: "PREPARED",
        source: FVE_PANEL_EDITOR_VERSION
      });

      for (const panelIdValue of panelIds) {
        panelToString.set(panelIdValue, id);
      }
    }

    const nextPanels = panels.map((panel) => panelToString.has(panel.id)
      ? {
          ...panel,
          stringId: panelToString.get(panel.id)
        }
      : panel);

    const generatedIds = new Set(strings.map((stringItem) => stringItem.id));
    const existingStrings = asArray(state.project?.fve?.strings).filter((stringItem) => !generatedIds.has(String(stringItem.id)));
    const nextStrings = [...existingStrings, ...strings];
    const updateResult = updateFveProject(controller, state, {
      panels: nextPanels,
      strings: nextStrings,
      stringPreparation: {
        version: FVE_PANEL_EDITOR_VERSION,
        preparedAt: new Date().toISOString(),
        stringPrefix: stringPayload.stringPrefix,
        maxPanelsPerString: stringPayload.maxPanelsPerString,
        panelIds: resolved.ids
      }
    }, "prepareStrings");

    if (!updateResult.ok) return updateResult;

    const warnings = resolved.missingIds.length
      ? [`Ignorovány neexistující FVE panely: ${resolved.missingIds.join(", ")}.`]
      : [];

    return createEditorResult("prepareStrings", {
      strings,
      stringCount: strings.length,
      panelIds: resolved.ids,
      panelCount: resolved.ids.length,
      maxPanelsPerString: stringPayload.maxPanelsPerString,
      stringPrefix: stringPayload.stringPrefix
    }, warnings);
  }

  function run(action, payload = {}) {
    try {
      if (action === "listPanels") return listPanels(payload);
      if (action === "selectPanels") return selectPanels(payload);
      if (action === "selectAllPanels") return selectAllPanels(payload);
      if (action === "clearSelection") return clearSelection(payload);
      if (action === "movePanels") return movePanels(payload);
      if (action === "moveSelection") return moveSelection(payload);
      if (action === "prepareStrings") return prepareStrings(payload);

      return createRuntimeError(`Unsupported FVE panel editor action: ${action}`, {
        module: "fvePanelEditor",
        action: "run",
        data: { action, payload }
      });
    } catch (error) {
      return createRuntimeError(error, {
        module: "fvePanelEditor",
        action: action || "run",
        data: payload
      });
    }
  }

  return {
    version: FVE_PANEL_EDITOR_VERSION,
    controller,
    listPanels,
    selectPanels,
    selectAllPanels,
    clearSelection,
    movePanels,
    moveSelection,
    prepareStrings,
    run
  };
}

export function safeFvePanelEditor(options = {}) {
  try {
    return createRuntimeResult({
      module: "fvePanelEditor",
      action: "safeFvePanelEditor",
      data: {
        version: FVE_PANEL_EDITOR_VERSION,
        editor: createFvePanelEditor(options)
      }
    });
  } catch (error) {
    return createRuntimeError(error, {
      module: "fvePanelEditor",
      action: "safeFvePanelEditor"
    });
  }
}

export default {
  FVE_PANEL_EDITOR_VERSION,
  createFvePanelEditor,
  safeFvePanelEditor
};
