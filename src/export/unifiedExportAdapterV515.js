import { createExportManifest, validateExportManifest } from "./manifestModel.js";
import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";
import { runUnifiedProjectQa } from "../data/unifiedProjectQaAdapterV506.js";

export function createUnifiedExportManifest(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const qa = runUnifiedProjectQa(project, project.qa.findings);
  const manifest = createExportManifest({
    projectId: project.project.projectId,
    projectName: project.project.projectName,
    version: project.schemaVersion,
    project,
    modules: [
      { key: "fve", count: project.fve.strings.length },
      { key: "cad", count: project.cad.objects.length },
      { key: "lps", count: project.lps.objects.length },
      { key: "spd", count: project.spd.devices.length },
    ],
    documents: project.documents,
    bom: project.bom,
    qaSummary: qa.qaSummary,
    files: project.export.files,
    warnings: project.export.warnings,
  });
  const validation = validateExportManifest(manifest);

  return {
    manifest,
    validation,
    qaSummary: qa.qaSummary,
    releaseGo: qa.releaseGo && validation.valid,
  };
}
