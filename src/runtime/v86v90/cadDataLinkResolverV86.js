// LOSKOT V86-V90 CAD / Map Deep Integration - Data Link Resolver
// Pure runtime module. No DOM. No package dependency.

export function resolveCadDataLinkV86(project, linkedTable, linkedId) {
  if (!linkedTable || !linkedId) return null;

  const lookup = {
    pv_panel_instances: project?.fve?.panels,
    pv_strings: project?.fve?.strings,
    inverter_instances: project?.fve?.inverters,
    mppt_instances: project?.fve?.mppts,
    dc_routes: project?.fve?.dc_routes,
    spd_dc: project?.lps_spd_lpz?.spd_dc,
    spd_ac: project?.lps_spd_lpz?.spd_ac,
    lpz_zones: project?.lps_spd_lpz?.lpz_zones,
    lps_elements: project?.lps_spd_lpz?.lps_elements,
    hvi_routes: project?.lps_spd_lpz?.hvi_routes,
    down_conductors: project?.lps_spd_lpz?.down_conductors,
    earthing_systems: project?.lps_spd_lpz?.earthing_systems,
    roof_planes: project?.roof?.planes,
    roof_obstacles: project?.roof?.obstacles,
  };

  const rows = Array.isArray(lookup[linkedTable]) ? lookup[linkedTable] : [];
  return rows.find((row) => row.id === linkedId || row.zone_code === linkedId) || null;
}

export function validateCadDataLinksV86(project) {
  const qaResults = [];
  const objects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];

  for (const object of objects) {
    if (["annotation", "dimension"].includes(object.object_type)) continue;

    if (!object.linked_table || !object.linked_id) {
      qaResults.push(makeCadQaV86("ERROR", "QA-CAD-001", `CAD objekt ${object.id} nemá linked_table/linked_id.`, true, "cad_object", object.id || ""));
      continue;
    }

    const linkedData = resolveCadDataLinkV86(project, object.linked_table, object.linked_id);
    if (!linkedData) {
      qaResults.push(makeCadQaV86("ERROR", "QA-DB-002", `CAD objekt ${object.id} odkazuje na neexistující ${object.linked_table}.${object.linked_id}.`, true, "cad_object", object.id || ""));
    }
  }

  return {
    qaResults,
    summary: {
      total: qaResults.length,
      blocksExport: qaResults.filter((item) => item.blocksExport).length,
      status: qaResults.some((item) => item.blocksExport) ? "BLOCKED" : "OK",
    },
  };
}

export function makeCadQaV86(severity, checkId, message, blocksExport, objectType = "", objectId = "") {
  return { severity, checkId, message, blocksExport: Boolean(blocksExport), objectType, objectId, status: "ACTIVE" };
}
