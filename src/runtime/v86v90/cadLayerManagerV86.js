// LOSKOT V86-V90 CAD / Map Deep Integration - Layer Manager
// Pure runtime module. No DOM. No package dependency.

export function buildCadLayerStateV86(project, userLayerState = {}) {
  const explicitLayers = Array.isArray(project?.cad?.layers) ? project.cad.layers : [];
  const objects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];
  const layers = Array.from(new Set([...explicitLayers, ...objects.map((item) => item.layer).filter(Boolean)])).sort();

  return {
    layers: layers.map((id) => {
      const objectCount = objects.filter((item) => item.layer === id).length;
      return {
        id,
        label: getCadLayerLabelV86(id),
        visible: userLayerState[id]?.visible ?? true,
        locked: userLayerState[id]?.locked ?? false,
        objectCount,
        category: getCadLayerCategoryV86(id),
      };
    }),
  };
}

export function toggleCadLayerVisibilityV86(layerState, layerId) {
  const next = structuredCloneSafe(layerState || {});
  next[layerId] = next[layerId] || {};
  next[layerId].visible = !(next[layerId].visible ?? true);
  return next;
}

export function getCadLayerLabelV86(layerId) {
  const labels = {
    "01_roof": "Střecha",
    "10_fve_panels": "FVE panely",
    "11_fve_strings": "FVE stringy",
    "12_dc_routes": "DC trasy",
    "13_inverters": "Měniče",
    "30_spd_ac": "SPD AC",
    "31_spd_dc": "SPD DC",
    "32_lpz_zones": "LPZ zóny",
    "20_lps_air_terminals": "Jímače",
    "21_lps_down_conductors": "Svody",
    "22_lps_hvi_routes": "HVI trasy",
    "23_lps_grounding": "Uzemnění",
  };
  return labels[layerId] || layerId;
}

export function getCadLayerCategoryV86(layerId) {
  if (layerId.includes("fve") || layerId.includes("dc") || layerId.includes("inverter")) return "FVE";
  if (layerId.includes("spd") || layerId.includes("lpz")) return "SPD_LPZ";
  if (layerId.includes("lps") || layerId.includes("hvi") || layerId.includes("ground")) return "LPS";
  if (layerId.includes("roof")) return "ROOF";
  return "OTHER";
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value || {}));
}
