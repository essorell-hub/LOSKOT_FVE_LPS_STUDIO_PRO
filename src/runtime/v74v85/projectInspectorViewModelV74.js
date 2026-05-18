// LOSKOT V74-V85 Classic PRO UI Binding - Project Inspector View Model
// Pure runtime view-model builder. No DOM. No React. No package dependency.

export function buildProjectInspectorViewModelV74(project, selectedObjectId = "") {
  const cadObjects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];
  const selectedCadObject = cadObjects.find((item) => item.id === selectedObjectId) || null;
  const linkedData = selectedCadObject ? findLinkedDataV74(project, selectedCadObject.linked_table, selectedCadObject.linked_id) : null;

  return {
    screen: "project_inspector",
    title: "Project Inspector",
    selectedObjectId,
    selectedCadObject,
    linkedData,
    sections: [
      {
        id: "project",
        label: "Projekt",
        rows: objectRows(project?.project || {}),
      },
      {
        id: "selection",
        label: "Výběr v CAD",
        rows: selectedCadObject ? objectRows(selectedCadObject) : [{ key: "selection", value: "Nic není vybráno" }],
      },
      {
        id: "linked_data",
        label: "Datová vazba",
        rows: linkedData ? objectRows(linkedData) : [{ key: "linked_data", value: "Bez nalezené datové vazby" }],
      },
    ],
  };
}

export function findLinkedDataV74(project, linkedTable, linkedId) {
  if (!linkedTable || !linkedId) return null;

  const map = {
    pv_panel_instances: project?.fve?.panels,
    pv_strings: project?.fve?.strings,
    inverter_instances: project?.fve?.inverters,
    mppt_instances: project?.fve?.mppts,
    spd_dc: project?.lps_spd_lpz?.spd_dc,
    spd_ac: project?.lps_spd_lpz?.spd_ac,
    lpz_zones: project?.lps_spd_lpz?.lpz_zones,
    lps_elements: project?.lps_spd_lpz?.lps_elements,
    hvi_routes: project?.lps_spd_lpz?.hvi_routes,
    earthing_systems: project?.lps_spd_lpz?.earthing_systems,
    roof_planes: project?.roof?.planes,
  };

  const rows = Array.isArray(map[linkedTable]) ? map[linkedTable] : [];
  return rows.find((item) => item.id === linkedId || item.zone_code === linkedId) || null;
}

function objectRows(obj) {
  return Object.entries(obj || {}).map(([key, value]) => ({
    key,
    value: typeof value === "object" ? JSON.stringify(value) : String(value),
  }));
}
