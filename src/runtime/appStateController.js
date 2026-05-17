import {
  createRuntimeBridge,
  createRuntimeResult,
  createRuntimeError,
  normalizeRuntimeProject
} from "./appRuntimeBridge.js";

export const APP_STATE_CONTROLLER_VERSION = "v41-app-state-controller";

function createInitialState(input = {}, bridge) {
  const project = normalizeRuntimeProject(input.project || input);

  return {
    version: APP_STATE_CONTROLLER_VERSION,
    runtimeVersion: bridge.version,
    activeScreen: input.activeScreen || "dashboard",
    selectedModule: input.selectedModule || "project",
    project,
    ui: {
      classicPro: true,
      sidebarCollapsed: false,
      inspectorOpen: true,
      ...(input.ui || {})
    },
    selection: {
      cadObjectIds: Array.isArray(input.selection?.cadObjectIds) ? input.selection.cadObjectIds : [],
      fvePanelIds: Array.isArray(input.selection?.fvePanelIds) ? input.selection.fvePanelIds : [],
      lpsObjectIds: Array.isArray(input.selection?.lpsObjectIds) ? input.selection.lpsObjectIds : []
    },
    history: [],
    warnings: []
  };
}

export function createAppStateController(input = {}) {
  const bridge = createRuntimeBridge(input);
  const listeners = new Set();
  let state = createInitialState(input, bridge);

  function notify(event) {
    for (const listener of listeners) {
      try {
        listener(event, state);
      } catch {
        // Listener failure must never crash the app state controller.
      }
    }
  }

  function snapshot(action) {
    state = {
      ...state,
      history: [
        ...state.history.slice(-19),
        {
          action,
          timestamp: new Date().toISOString(),
          projectId: state.project.projectId || state.project.id,
          activeScreen: state.activeScreen,
          selectedModule: state.selectedModule
        }
      ]
    };
  }

  return {
    version: APP_STATE_CONTROLLER_VERSION,

    getState() {
      return createRuntimeResult({
        module: "appState",
        action: "getState",
        data: state
      });
    },

    setActiveScreen(activeScreen) {
      if (!activeScreen || typeof activeScreen !== "string") {
        return createRuntimeError("activeScreen must be a non-empty string.", {
          module: "appState",
          action: "setActiveScreen"
        });
      }

      state = {
        ...state,
        activeScreen
      };

      snapshot("setActiveScreen");
      notify({ type: "screenChanged", activeScreen });

      return createRuntimeResult({
        module: "appState",
        action: "setActiveScreen",
        data: state
      });
    },

    setSelectedModule(selectedModule) {
      if (!selectedModule || typeof selectedModule !== "string") {
        return createRuntimeError("selectedModule must be a non-empty string.", {
          module: "appState",
          action: "setSelectedModule"
        });
      }

      state = {
        ...state,
        selectedModule
      };

      snapshot("setSelectedModule");
      notify({ type: "moduleChanged", selectedModule });

      return createRuntimeResult({
        module: "appState",
        action: "setSelectedModule",
        data: state
      });
    },

    updateProject(patch = {}) {
      const mergedProject = {
        ...state.project,
        ...patch,
        fve: {
          ...(state.project.fve || {}),
          ...(patch.fve || {})
        },
        cad: {
          ...(state.project.cad || {}),
          ...(patch.cad || {})
        },
        lps: {
          ...(state.project.lps || {}),
          ...(patch.lps || {})
        },
        metadata: {
          ...(state.project.metadata || {}),
          ...(patch.metadata || {})
        }
      };

      const updated = bridge.setProject(mergedProject);

      if (!updated.ok) {
        return updated;
      }

      state = {
        ...state,
        project: updated.data.project
      };

      snapshot("updateProject");
      notify({ type: "projectUpdated", project: state.project });

      return createRuntimeResult({
        module: "appState",
        action: "updateProject",
        data: state
      });
    },

    setSelection(selection = {}) {
      state = {
        ...state,
        selection: {
          ...state.selection,
          cadObjectIds: Array.isArray(selection.cadObjectIds) ? selection.cadObjectIds : state.selection.cadObjectIds,
          fvePanelIds: Array.isArray(selection.fvePanelIds) ? selection.fvePanelIds : state.selection.fvePanelIds,
          lpsObjectIds: Array.isArray(selection.lpsObjectIds) ? selection.lpsObjectIds : state.selection.lpsObjectIds
        }
      };

      snapshot("setSelection");
      notify({ type: "selectionChanged", selection: state.selection });

      return createRuntimeResult({
        module: "appState",
        action: "setSelection",
        data: state
      });
    },

    updateUi(ui = {}) {
      state = {
        ...state,
        ui: {
          ...state.ui,
          ...ui,
          classicPro: true
        }
      };

      snapshot("updateUi");
      notify({ type: "uiUpdated", ui: state.ui });

      return createRuntimeResult({
        module: "appState",
        action: "updateUi",
        data: state
      });
    },

    getSummary() {
      const runtimeSummary = bridge.getSummary();

      return createRuntimeResult({
        module: "appState",
        action: "getSummary",
        data: {
          version: APP_STATE_CONTROLLER_VERSION,
          activeScreen: state.activeScreen,
          selectedModule: state.selectedModule,
          projectId: state.project.projectId || state.project.id,
          projectName: state.project.name,
          classicPro: state.ui.classicPro === true,
          selectionCounts: {
            cad: state.selection.cadObjectIds.length,
            fve: state.selection.fvePanelIds.length,
            lps: state.selection.lpsObjectIds.length
          },
          runtime: runtimeSummary.data
        },
        warnings: runtimeSummary.warnings || []
      });
    },

    subscribe(listener) {
      if (typeof listener !== "function") {
        return () => {};
      }

      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    }
  };
}

export default {
  APP_STATE_CONTROLLER_VERSION,
  createAppStateController
};
