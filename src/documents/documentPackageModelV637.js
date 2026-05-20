import { createFveTechnicalReportV633 } from "./fveTechnicalReportModelV633.js";
import { createGroundingBondingProtocolV635 } from "./groundingBondingProtocolModelV635.js";
import { createLpsSpdTechnicalReportV634 } from "./lpsSpdTechnicalReportModelV634.js";
import { createProjectTechnicalReportV632 } from "./projectTechnicalReportModelV632.js";
import { createQaFindingsReportV636 } from "./qaFindingsReportModelV636.js";

export const DOCUMENT_PACKAGE_VERSION_V637 = "V637";

export function createDocumentPackageV637(project = {}, options = {}) {
  const documents = [
    createProjectTechnicalReportV632(project),
    createFveTechnicalReportV633(project),
    createLpsSpdTechnicalReportV634(project),
    createGroundingBondingProtocolV635(project),
    createQaFindingsReportV636(project, options.qaFindings || []),
  ];

  return {
    modelVersion: DOCUMENT_PACKAGE_VERSION_V637,
    projectId: project.projectId || project.id || "",
    projectName: project.projectName || project.name || "",
    generatedAt: options.generatedAt || project.generatedAt || "UNSET_GENERATED_AT",
    documents,
    documentCount: documents.length,
    qaFindings: documents.flatMap((document) => document.qaSummary.findings),
  };
}
