// LOSKOT V74-V85 Classic PRO UI Binding - CAD Layer View Model
// Pure runtime view-model builder. No DOM. No React. No package dependency.

export function buildCadLayerViewModelV74(project, layerState = {}) {
  const cad = project?.cad || {};
  const objects = Array.isArray(cad.objects) ? cad.objects : [];
  const explicitLayers = Array.isArray(cad.layers) ? cad.layers : [];
  const layerIds = Array.from(new Set([...explicitLayers, ...objects.map((item) => item.layer).filter(Boolean)])).sort();

  return {
    screen: "cad_layers",
    title: "CAD vrstvy",
    layers: layerIds.map((layerId) => {
      const layerObjects = objects.filter((item) => item.layer === layerId);
      return {
        id: layerId,
        label: layerLabelV74(layerId),
        visible: layerState[layerId] !== false,
        locked: layerState[`${layerId}:locked`] === true,
        objectCount: layerObjects.length,
      };
    }),
  };
}

export function layerLabelV74(layerId) {
  const labels = {
    "10_fve_panels": "FVE panely",
    "11_fve_strings": "FVE stringy",
    "12_dc_routes": "DC trasy",
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
