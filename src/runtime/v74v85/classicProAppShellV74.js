// LOSKOT V74-V85 Classic PRO UI Binding - App Shell State
// Pure runtime view-model builder. No DOM. No React. No package dependency.

import { buildDashboardViewModelV74 } from "./dashboardViewModelV74.js";
import { buildQaPanelViewModelV74 } from "./qaPanelViewModelV74.js";
import { buildProjectInspectorViewModelV74 } from "./projectInspectorViewModelV74.js";
import { buildCadLayerViewModelV74 } from "./cadLayerViewModelV74.js";
import { buildDocumentExportViewModelV74 } from "./documentExportViewModelV74.js";

export function buildClassicProAppShellV74(project, options = {}) {
  const qaResults = Array.isArray(options.qaResults)
    ? options.qaResults
    : Array.isArray(project?.qa?.results)
      ? project.qa.results
      : [];

  const qaPanel = buildQaPanelViewModelV74(qaResults);

  return {
    app: "LOSKOT_FVE_LPS_STUDIO_PRO",
    uiStyle: "Classic PRO",
    noWhiteScreenGuard: true,
    activeScreen: options.activeScreen || "dashboard",
    navigation: [
      { id: "dashboard", label: "Dashboard" },
      { id: "cad", label: "CAD / Mapa" },
      { id: "fve", label: "FVE" },
      { id: "lps", label: "LPS / SPD / LPZ" },
      { id: "documents", label: "Dokumenty" },
      { id: "qa", label: "QA" },
      { id: "export", label: "Export" },
    ],
    screens: {
      dashboard: buildDashboardViewModelV74(project, { summary: qaPanel.summary }, options.pipelineResult || null),
      qa: qaPanel,
      projectInspector: buildProjectInspectorViewModelV74(project, options.selectedObjectId || ""),
      cadLayers: buildCadLayerViewModelV74(project, options.layerState || {}),
      documentsExport: buildDocumentExportViewModelV74(project, qaPanel),
    },
  };
}

export function safeBuildClassicProAppShellV74(project, options = {}) {
  try {
    return buildClassicProAppShellV74(project, options);
  } catch (error) {
    return {
      app: "LOSKOT_FVE_LPS_STUDIO_PRO",
      uiStyle: "Classic PRO",
      noWhiteScreenGuard: true,
      activeScreen: "error",
      screens: {
        error: {
          title: "Modul se nepodařilo načíst",
          message: error instanceof Error ? error.message : String(error),
          recovery: "Aplikace nesmí skončit bílou obrazovkou. Zobrazit diagnostiku a pokračovat.",
        },
      },
    };
  }
}
