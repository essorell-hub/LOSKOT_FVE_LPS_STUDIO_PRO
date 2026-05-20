import { collectProjectQaFindings, summarizeQaFindings } from "../documents/documentTemplateModelV631.js";
import { detectForeignContentQaV695 } from "./noForeignContentQaV695.js";
import { evaluateModuleReadinessQaV694 } from "./moduleReadinessQaV694.js";
import { evaluateProjectCompletenessQaV693 } from "./projectCompletenessQaV693.js";
import { createReleaseChecklistV692 } from "./releaseChecklistModelV692.js";

export function evaluateReleaseGateV691(project = {}, context = {}) {
  const projectFindings = collectProjectQaFindings(project);
  const qaSeverityFindings = projectFindings.flatMap((finding) => {
    if (finding.severity === "ERROR") return [{ ...finding, id: "RELEASE-003", ruleId: "RELEASE-003" }];
    if (finding.severity === "BLOCKER") return [{ ...finding, id: "RELEASE-004", ruleId: "RELEASE-004" }];
    return [];
  });
  const structuralFindings = [
    ...evaluateProjectCompletenessQaV693(project),
    ...(!context.bom?.summary?.itemCount && !context.bom?.items?.length
      ? [{ id: "RELEASE-007", severity: "ERROR", sourceModule: "release", sourceId: "bom", message: "Missing BOM", ruleId: "RELEASE-007" }]
      : []),
    ...(!context.documents?.documentCount && !context.documents?.documents?.length
      ? [{ id: "RELEASE-008", severity: "ERROR", sourceModule: "release", sourceId: "documents", message: "Missing document package", ruleId: "RELEASE-008" }]
      : []),
  ];
  const findings = [
    ...structuralFindings,
    ...qaSeverityFindings,
    ...detectForeignContentQaV695(project),
    ...evaluateModuleReadinessQaV694(project),
  ];
  const summary = summarizeQaFindings(findings);
  return {
    modelVersion: "V691",
    checklist: createReleaseChecklistV692(),
    ready: !summary.hasErrors && !summary.hasBlockers,
    findings,
    summary,
  };
}
