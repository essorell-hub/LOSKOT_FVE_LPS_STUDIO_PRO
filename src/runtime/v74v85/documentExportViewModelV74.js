// LOSKOT V74-V85 Classic PRO UI Binding - Document / Export View Model
// Pure runtime view-model builder. No DOM. No React. No package dependency.

export function buildDocumentExportViewModelV74(project, qaPanel = null) {
  const blocksExport = Number(qaPanel?.summary?.blocksExport ?? project?.qa?.summary?.blocks_export ?? 0);
  const documents = Array.isArray(project?.documents?.generated) ? project.documents.generated : [];
  const templates = Array.isArray(project?.documents?.templates) ? project.documents.templates : [];

  return {
    screen: "documents_export",
    title: "Dokumenty a export",
    exportBlocked: blocksExport > 0,
    exportStatus: blocksExport > 0 ? "BLOCKED" : "READY_DEMO",
    buttons: [
      { id: "generate_documents", label: "Vygenerovat dokumenty", enabled: true },
      { id: "qa_report", label: "QA report", enabled: true },
      { id: "json_export", label: "JSON export", enabled: true },
      { id: "full_package_export", label: "Exportní balíček", enabled: blocksExport === 0 },
    ],
    documents: {
      templatesCount: templates.length,
      generatedCount: documents.length,
      templates,
      generated: documents,
    },
    warnings: blocksExport > 0 ? ["Export je blokován QA chybami."] : [],
  };
}
