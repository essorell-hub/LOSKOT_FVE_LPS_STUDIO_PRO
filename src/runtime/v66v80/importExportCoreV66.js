// LOSKOT V66/V76-V80 Import / Export Core
// Pure runtime module. No DOM. No package dependency.

import { normalizeProjectV66, serializeProjectV66, parseProjectJsonV66 } from "./projectStoreV66.js";

export function buildProjectExportPackageV66(project, extraFiles = []) {
  const normalized = normalizeProjectV66(project);
  const projectJson = serializeProjectV66(normalized);
  const qaResultsJson = JSON.stringify(normalized.qa || { results: [] }, null, 2);
  const manifest = buildExportManifestV66(normalized, extraFiles);

  return {
    status: manifest.blocks_export > 0 ? "BLOCKED" : "READY_DEMO",
    files: [
      { path: "project.json", type: "application/json", content: projectJson },
      { path: "qa_results.json", type: "application/json", content: qaResultsJson },
      { path: "export_manifest.json", type: "application/json", content: JSON.stringify(manifest, null, 2) },
      ...extraFiles,
    ],
    manifest,
  };
}

export function buildExportManifestV66(project, extraFiles = []) {
  const qaResults = Array.isArray(project?.qa?.results) ? project.qa.results : [];
  const blocksExport = qaResults.filter((item) => item.blocks_export || item.blocksExport).length;
  return {
    schema: "loskot.export.manifest.v66_v80",
    created_at: new Date().toISOString(),
    project_code: project?.project?.project_code || "",
    project_name: project?.project?.project_name || "",
    schema_version: project?.project?.schema_version || "",
    qa_total: qaResults.length,
    qa_error_count: qaResults.filter((item) => item.severity === "ERROR").length,
    qa_warning_count: qaResults.filter((item) => item.severity === "WARNING").length,
    blocks_export: blocksExport,
    status: blocksExport > 0 ? "BLOCKED" : "READY_DEMO",
    required_files: ["project.json", "qa_results.json", "export_manifest.json"],
    files: ["project.json", "qa_results.json", "export_manifest.json", ...extraFiles.map((file) => file.path)],
  };
}

export function importProjectPackageV66(filesByPath) {
  if (!filesByPath || typeof filesByPath !== "object") {
    throw new Error("filesByPath object is required.");
  }
  if (!filesByPath["project.json"]) {
    throw new Error("Missing project.json.");
  }
  const project = parseProjectJsonV66(filesByPath["project.json"]);
  const manifest = filesByPath["export_manifest.json"] ? JSON.parse(filesByPath["export_manifest.json"]) : null;
  return {
    project,
    manifest,
    status: "OK",
  };
}
