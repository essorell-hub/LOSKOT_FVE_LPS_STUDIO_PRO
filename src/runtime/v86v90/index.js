// LOSKOT V86-V90 CAD / Map Deep Integration exports

export { buildCadObjectRegistryV86, getCadObjectByIdV86, listCadObjectsByLayerV86 } from "./cadObjectRegistryV86.js";
export { selectCadObjectV86, clearCadSelectionV86, buildCadSelectionInspectorV86 } from "./cadSelectionEngineV86.js";
export { resolveCadDataLinkV86, validateCadDataLinksV86, makeCadQaV86 } from "./cadDataLinkResolverV86.js";
export { buildCadLayerStateV86, toggleCadLayerVisibilityV86, getCadLayerLabelV86, getCadLayerCategoryV86 } from "./cadLayerManagerV86.js";
export { mapQaToCadHighlightsV86, getCadHighlightStyleV86 } from "./cadQaHighlightMapperV86.js";
export { buildMapBridgeViewModelV86, hasMapCoordinatesV86 } from "./cadMapBridgeV86.js";
