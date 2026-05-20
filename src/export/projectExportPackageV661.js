import { createDocumentPackageV637 } from "../documents/documentPackageModelV637.js";
import { summarizeQaFindings } from "../documents/documentTemplateModelV631.js";
import { collectBomItemsV642, mergeBomItemsV642 } from "./bomCollectorV642.js";
import { createBomQaV646 } from "./bomQaModelV646.js";
import { createBomSummaryV645 } from "./bomSummaryModelV645.js";
import { createFveBomItemsV643 } from "./fveBomAdapterV643.js";
import { createLpsSpdGroundingBomItemsV644 } from "./lpsSpdGroundingBomAdapterV644.js";

export function createProjectExportPackageV661(project = {}, options = {}) {
  const documents = options.documents || createDocumentPackageV637(project, options);
  const collected = collectBomItemsV642([
    createFveBomItemsV643(project),
    createLpsSpdGroundingBomItemsV644(project),
    options.documentationItems || [],
    options.bomItems || [],
  ]);
  const items = mergeBomItemsV642(collected);
  const bomQa = createBomQaV646(items);
  const qaSummary = summarizeQaFindings([
    ...(documents.qaFindings || []),
    ...bomQa.findings,
    ...(options.qaFindings || []),
  ]);
  const blockers = qaSummary.findings.filter((finding) => finding.severity === "BLOCKER");
  const errors = qaSummary.findings.filter((finding) => finding.severity === "ERROR");

  return {
    modelVersion: "V661",
    projectId: project.projectId || project.id || "",
    projectName: project.projectName || project.name || "",
    generatedAt: options.generatedAt || project.generatedAt || "UNSET_GENERATED_AT",
    version: options.version || "V631-V760",
    documents,
    bom: { items, summary: createBomSummaryV645(items), qa: bomQa },
    qaSummary,
    files: options.files || [],
    readiness: errors.length === 0 && blockers.length === 0,
    warnings: qaSummary.findings.filter((finding) => finding.severity === "WARNING"),
    blockers: [...errors, ...blockers],
  };
}
