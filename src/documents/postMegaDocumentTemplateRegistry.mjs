// POST-MEGA V4 NIGHT FACTORY
// Document template registry model.

export const POST_MEGA_DOCUMENT_TEMPLATE_REGISTRY_VERSION = "post-mega-v4-doc-templates-1";

export const DOCUMENT_TEMPLATE_TYPES = [
  "project_cover",
  "technical_report",
  "fve_string_report",
  "lps_spd_report",
  "qa_checklist",
  "datasheet_index",
  "export_manifest"
];

export function createDocumentTemplate(input = {}) {
  return {
    id: input.id || "",
    type: input.type || "technical_report",
    title: input.title || "",
    templatePath: input.templatePath || "",
    outputFormat: input.outputFormat || "docx",
    requiredDataKeys: Array.isArray(input.requiredDataKeys) ? input.requiredDataKeys : []
  };
}

export function validateDocumentTemplate(template = {}) {
  const missing = [];
  if (!template.id) missing.push("id");
  if (!template.title) missing.push("title");
  if (!template.templatePath) missing.push("templatePath");
  return {
    ok: missing.length === 0 && DOCUMENT_TEMPLATE_TYPES.includes(template.type),
    missing,
    typeKnown: DOCUMENT_TEMPLATE_TYPES.includes(template.type)
  };
}

export function createDocumentTemplateSummary(templates = []) {
  return {
    version: POST_MEGA_DOCUMENT_TEMPLATE_REGISTRY_VERSION,
    count: templates.length,
    types: [...new Set(templates.map((template) => template.type))]
  };
}
