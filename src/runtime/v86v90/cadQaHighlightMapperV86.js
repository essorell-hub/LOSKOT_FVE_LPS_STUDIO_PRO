// LOSKOT V86-V90 CAD / Map Deep Integration - QA Highlight Mapper
// Pure runtime module. No DOM. No package dependency.

export function mapQaToCadHighlightsV86(project, qaResults = []) {
  const cadObjects = Array.isArray(project?.cad?.objects) ? project.cad.objects : [];
  const qaItems = Array.isArray(qaResults) ? qaResults : [];
  const highlights = [];

  for (const qa of qaItems) {
    const objectId = qa.objectId || qa.object_id || "";
    const objectType = qa.objectType || qa.object_type || "";
    let matches = [];

    if (objectType === "cad_object" && objectId) {
      matches = cadObjects.filter((object) => object.id === objectId);
    } else if (objectId) {
      matches = cadObjects.filter((object) => object.linked_id === objectId);
    }

    for (const object of matches) {
      highlights.push({
        cadObjectId: object.id,
        layer: object.layer || "",
        severity: normalizeSeverity(qa.severity),
        checkId: qa.checkId || qa.check_id || "",
        message: qa.message || "",
        blocksExport: Boolean(qa.blocksExport ?? qa.blocks_export),
      });
    }
  }

  return {
    count: highlights.length,
    blockingCount: highlights.filter((item) => item.blocksExport).length,
    highlights,
  };
}

export function getCadHighlightStyleV86(severity) {
  const normalized = normalizeSeverity(severity);
  if (normalized === "ERROR") return { stroke: "error", fill: "error-soft", weight: 3 };
  if (normalized === "WARNING") return { stroke: "warning", fill: "warning-soft", weight: 2 };
  return { stroke: "info", fill: "info-soft", weight: 1 };
}

function normalizeSeverity(value) {
  const s = String(value || "INFO").toUpperCase();
  if (["ERROR", "WARNING", "INFO"].includes(s)) return s;
  return "INFO";
}
