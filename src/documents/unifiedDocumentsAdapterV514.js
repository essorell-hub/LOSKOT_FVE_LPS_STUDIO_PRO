import { createDocumentDefinition, DOCUMENT_TYPES, getRequiredDocumentsForProject, validateDocumentReadiness } from "./documentModel.js";
import { normalizeUnifiedProject } from "../data/unifiedProjectModelV501.js";

function toDocumentProject(project) {
  return {
    ...project,
    fve: {
      panels: project.fve.panels,
      strings: project.fve.strings,
      inverters: project.fve.inverters,
    },
    lps: {
      components: project.lps.objects,
    },
    spd: {
      devices: project.spd.devices,
    },
    qa: project.qa,
  };
}

export function createUnifiedDocumentSet(projectInput = {}) {
  const project = normalizeUnifiedProject(projectInput);
  const documentProject = toDocumentProject(project);
  const existing = project.documents.map((document, index) => createDocumentDefinition({
    id: document.documentId || document.id || `doc-${index + 1}`,
    type: document.type || DOCUMENT_TYPES.EXPORT_PROTOCOL,
    name: document.name || document.title || `Document ${index + 1}`,
    description: document.description || "",
    version: document.version || "1.0",
    filePath: document.filePath || document.file_uri || null,
    relatedEntities: document.relatedEntities || {},
  }));
  const requiredTypes = Array.from(getRequiredDocumentsForProject(documentProject));
  const readiness = validateDocumentReadiness(documentProject, existing);

  return {
    documents: existing,
    requiredTypes,
    readiness,
  };
}
