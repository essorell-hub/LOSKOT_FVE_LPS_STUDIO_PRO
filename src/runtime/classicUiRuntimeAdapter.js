import {
  createRuntimeResult,
  createRuntimeError
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

export const CLASSIC_UI_RUNTIME_ADAPTER_VERSION = "v42-classic-ui-runtime-adapter";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function writeTarget(target, value) {
  const text = toText(value);

  if (typeof target === "function") {
    target(text);
    return true;
  }

  if (target && typeof target === "object" && "textContent" in target) {
    target.textContent = text;
    return true;
  }

  if (target && typeof target === "object" && "value" in target) {
    target.value = text;
    return true;
  }

  return false;
}

export function createClassicUiRuntimeAdapter(options = {}) {
  const controller = options.controller || createAppStateController(options.project || options);
  const bindings = new Map();

  function readState() {
    const result = controller.getState();

    if (!result.ok) {
      return null;
    }

    return result.data;
  }

  function getValue(key) {
    const state = readState();

    if (!state) {
      return "";
    }

    const project = state.project || {};

    const values = {
      version: CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
      projectName: project.name || "Nový projekt",
      projectId: project.projectId || project.id || "",
      activeScreen: state.activeScreen || "dashboard",
      selectedModule: state.selectedModule || "project",
      classicPro: state.ui?.classicPro === true ? "true" : "false",
      fvePanelCount: asArray(project.fve?.panels).length,
      cadLayerCount: asArray(project.cad?.layers).length,
      cadObjectCount: asArray(project.cad?.objects).length,
      lpsObjectCount: asArray(project.lps?.objects).length,
      documentCount: asArray(project.documents).length,
      cadSelectionCount: asArray(state.selection?.cadObjectIds).length,
      fveSelectionCount: asArray(state.selection?.fvePanelIds).length,
      lpsSelectionCount: asArray(state.selection?.lpsObjectIds).length
    };

    return values[key] ?? "";
  }

  function refreshBinding(key, target) {
    const value = getValue(key);
    return writeTarget(target, value);
  }

  return {
    version: CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
    controller,

    getState() {
      return controller.getState();
    },

    getValue(key) {
      return createRuntimeResult({
        module: "classicUi",
        action: "getValue",
        data: {
          key,
          value: getValue(key)
        }
      });
    },

    bindText(key, target) {
      if (!key || typeof key !== "string") {
        return createRuntimeError("bindText key must be a non-empty string.", {
          module: "classicUi",
          action: "bindText"
        });
      }

      if (!target) {
        return createRuntimeError("bindText target is required.", {
          module: "classicUi",
          action: "bindText"
        });
      }

      bindings.set(key, target);
      const written = refreshBinding(key, target);

      return createRuntimeResult({
        module: "classicUi",
        action: "bindText",
        data: {
          key,
          written,
          bindingCount: bindings.size
        }
      });
    },

    refresh() {
      const refreshed = [];

      for (const [key, target] of bindings.entries()) {
        refreshed.push({
          key,
          written: refreshBinding(key, target)
        });
      }

      return createRuntimeResult({
        module: "classicUi",
        action: "refresh",
        data: {
          refreshed,
          bindingCount: bindings.size
        }
      });
    },

    clearBindings() {
      bindings.clear();

      return createRuntimeResult({
        module: "classicUi",
        action: "clearBindings",
        data: {
          bindingCount: bindings.size
        }
      });
    },

    dispatchUiAction(action, payload = {}) {
      if (!action || typeof action !== "string") {
        return createRuntimeError("dispatchUiAction action must be a non-empty string.", {
          module: "classicUi",
          action: "dispatchUiAction"
        });
      }

      let result;

      if (action === "navigate") {
        result = controller.setActiveScreen(payload.screen || payload.activeScreen);
      } else if (action === "selectModule") {
        result = controller.setSelectedModule(payload.module || payload.selectedModule);
      } else if (action === "updateProject") {
        result = controller.updateProject(payload.project || payload);
      } else if (action === "setSelection") {
        result = controller.setSelection(payload.selection || payload);
      } else if (action === "updateUi") {
        result = controller.updateUi(payload.ui || payload);
      } else {
        return createRuntimeError(`Unsupported Classic UI action: ${action}`, {
          module: "classicUi",
          action: "dispatchUiAction"
        });
      }

      if (result.ok) {
        this.refresh();
      }

      return createRuntimeResult({
        ok: result.ok,
        module: "classicUi",
        action: "dispatchUiAction",
        data: {
          action,
          payload,
          state: result.data
        },
        warnings: result.warnings || [],
        errors: result.errors || []
      });
    },

    createSnapshot() {
      const state = readState();

      return createRuntimeResult({
        module: "classicUi",
        action: "createSnapshot",
        data: {
          version: CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
          projectName: state?.project?.name || "Nový projekt",
          activeScreen: state?.activeScreen || "dashboard",
          selectedModule: state?.selectedModule || "project",
          classicPro: state?.ui?.classicPro === true,
          bindingCount: bindings.size
        }
      });
    }
  };
}

export default {
  CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
  createClassicUiRuntimeAdapter
};
