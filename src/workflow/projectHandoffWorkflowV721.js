import { createProjectExportPackageV661 } from "../export/projectExportPackageV661.js";
import { evaluateReleaseGateV691 } from "../validation/releaseGateModelV691.js";
import { createProjectCompletionSnapshotV722 } from "./projectCompletionSnapshotV722.js";
import { createProjectMilestoneV723 } from "./projectMilestoneModelV723.js";

export function createProjectHandoffWorkflowV721(project = {}, options = {}) {
  const exportPackage = createProjectExportPackageV661(project, options);
  const releaseGate = evaluateReleaseGateV691(project, {
    bom: exportPackage.bom,
    documents: exportPackage.documents,
  });
  return {
    modelVersion: "V721",
    projectId: exportPackage.projectId,
    projectName: exportPackage.projectName,
    exportPackage,
    releaseGate,
    snapshot: createProjectCompletionSnapshotV722(project, exportPackage, releaseGate),
    milestones: (options.milestones || []).map(createProjectMilestoneV723),
  };
}
