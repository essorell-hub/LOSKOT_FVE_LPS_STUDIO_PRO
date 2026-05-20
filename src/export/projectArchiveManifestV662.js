export function createProjectArchiveManifestV662(exportPackage = {}) {
  const files = Array.isArray(exportPackage.files) ? exportPackage.files : [];
  return {
    modelVersion: "V662",
    projectId: exportPackage.projectId || "",
    projectName: exportPackage.projectName || "",
    generatedAt: exportPackage.generatedAt || "UNSET_GENERATED_AT",
    files: files.map((file, index) => ({
      id: file.id || `file-${index + 1}`,
      path: file.path || "",
      role: file.role || "export",
      required: file.required !== false,
    })),
    documentCount: exportPackage.documents?.documentCount || 0,
    bomItemCount: exportPackage.bom?.summary?.itemCount || 0,
  };
}
