// LOSKOT V86-V90 CAD / Map Deep Integration - Selection Engine
// Pure runtime module. No DOM. No package dependency.

import { getCadObjectByIdV86 } from "./cadObjectRegistryV86.js";
import { resolveCadDataLinkV86 } from "./cadDataLinkResolverV86.js";

export function selectCadObjectV86(project, objectId, previousSelection = null) {
  const cadObject = getCadObjectByIdV86(project, objectId);
  if (!cadObject) {
    return {
      selected: false,
      objectId,
      cadObject: null,
      linkedData: null,
      message: `CAD objekt ${objectId} nebyl nalezen.`,
      previousSelection,
    };
  }

  const linkedData = resolveCadDataLinkV86(project, cadObject.linkedTable, cadObject.linkedId);

  return {
    selected: true,
    objectId,
    cadObject,
    linkedData,
    message: linkedData ? "CAD objekt je napojený na data." : "CAD objekt nemá nalezenou datovou vazbu.",
    previousSelection,
  };
}

export function clearCadSelectionV86(previousSelection = null) {
  return {
    selected: false,
    objectId: "",
    cadObject: null,
    linkedData: null,
    message: "Výběr zrušen.",
    previousSelection,
  };
}

export function buildCadSelectionInspectorV86(selection, qaHighlights = []) {
  const blockingForObject = qaHighlights.filter((item) => item.objectId === selection?.objectId && item.blocksExport);
  return {
    selected: Boolean(selection?.selected),
    objectId: selection?.objectId || "",
    title: selection?.cadObject ? `${selection.cadObject.objectType} / ${selection.cadObject.id}` : "Bez výběru",
    linkedData: selection?.linkedData || null,
    qaBlocks: blockingForObject.length,
    status: blockingForObject.length > 0 ? "ERROR" : selection?.linkedData ? "OK" : "WARNING",
  };
}
