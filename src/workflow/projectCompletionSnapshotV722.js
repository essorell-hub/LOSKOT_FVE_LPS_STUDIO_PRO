export function createProjectCompletionSnapshotV722(project = {}, exportPackage = {}, releaseGate = {}) {
  return {
    modelVersion: "V722",
    projectId: project.projectId || project.id || "",
    projectName: project.projectName || project.name || "",
    generatedAt: exportPackage.generatedAt || project.generatedAt || "UNSET_GENERATED_AT",
    documentCount: exportPackage.documents?.documentCount || 0,
    bomItemCount: exportPackage.bom?.summary?.itemCount || 0,
    ready: Boolean(releaseGate.ready && exportPackage.readiness),
    blockers: releaseGate.summary?.blockers || exportPackage.blockers || [],
  };
}
