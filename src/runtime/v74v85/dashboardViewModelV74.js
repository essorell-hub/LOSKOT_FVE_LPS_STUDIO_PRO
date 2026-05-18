// LOSKOT V74-V85 Classic PRO UI Binding - Dashboard View Model
// Pure runtime view-model builder. No DOM. No React. No package dependency.

export function buildDashboardViewModelV74(project, qaResult = null, pipelineResult = null) {
  const meta = project?.project || {};
  const fve = project?.fve || {};
  const lps = project?.lps_spd_lpz || {};
  const cad = project?.cad || {};
  const qaSummary = qaResult?.summary || project?.qa?.summary || {};

  const blocksExport = Number(
    qaSummary.blocksExport ?? qaSummary.blocks_export ?? pipelineResult?.qa?.summary?.blocksExport ?? 0
  );

  const qaErrorCount = Number(
    qaSummary.qaErrorCount ?? qaSummary.error ?? pipelineResult?.qa?.summary?.qaErrorCount ?? 0
  );

  const qaWarningCount = Number(
    qaSummary.qaWarningCount ?? qaSummary.warning ?? pipelineResult?.qa?.summary?.qaWarningCount ?? 0
  );

  return {
    screen: "dashboard",
    title: "LOSKOT FVE & LPS STUDIO PRO",
    subtitle: meta.project_name || "Bez názvu projektu",
    projectCode: meta.project_code || "",
    classicProSafe: true,
    cards: [
      {
        id: "project",
        label: "Projekt",
        value: meta.project_name || "Bez názvu",
        status: meta.project_code ? "OK" : "WARNING",
      },
      {
        id: "fve",
        label: "FVE",
        value: `${count(fve.panels)} panelů / ${count(fve.strings)} stringů`,
        status: count(fve.panels) > 0 ? "OK" : "INFO",
      },
      {
        id: "lps",
        label: "LPS / SPD / LPZ",
        value: `${count(lps.spd_ac)} SPD AC / ${count(lps.spd_dc)} SPD DC / ${count(lps.lpz_zones)} LPZ`,
        status: count(lps.lpz_zones) > 0 || count(lps.spd_ac) > 0 || count(lps.spd_dc) > 0 ? "OK" : "INFO",
      },
      {
        id: "cad",
        label: "CAD",
        value: `${count(cad.objects)} objektů`,
        status: count(cad.objects) > 0 ? "OK" : "INFO",
      },
      {
        id: "qa",
        label: "QA",
        value: `${qaErrorCount} chyb / ${qaWarningCount} varování`,
        status: blocksExport > 0 ? "ERROR" : qaWarningCount > 0 ? "WARNING" : "OK",
      },
      {
        id: "export",
        label: "Export",
        value: blocksExport > 0 ? "Blokován" : "Připraven",
        status: blocksExport > 0 ? "ERROR" : "OK",
      },
    ],
    actions: [
      { id: "open_project", label: "Otevřít projekt", enabled: true },
      { id: "save_project", label: "Uložit projekt", enabled: true },
      { id: "run_qa", label: "Spustit QA", enabled: true },
      { id: "export_package", label: "Export balíčku", enabled: blocksExport === 0 },
    ],
  };
}

function count(value) {
  return Array.isArray(value) ? value.length : 0;
}
