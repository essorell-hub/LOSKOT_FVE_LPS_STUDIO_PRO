export function createExportFilePlanV663(exportPackage = {}) {
  const projectId = exportPackage.projectId || "project";
  return {
    modelVersion: "V663",
    files: [
      { path: `${projectId}/documents/document-package.json`, role: "documents", required: true },
      { path: `${projectId}/bom/bom-items.json`, role: "bom", required: true },
      { path: `${projectId}/qa/qa-summary.json`, role: "qa", required: true },
      { path: `${projectId}/manifest/archive-manifest.json`, role: "manifest", required: true },
    ],
  };
}
