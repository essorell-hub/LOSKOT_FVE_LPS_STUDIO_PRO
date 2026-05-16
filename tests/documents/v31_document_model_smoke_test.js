import { documentModel } from '../../src/documents/index.js';

console.log("Starting Document module smoke tests...");

// Test documentModel
try {
    console.log("Testing documentModel...");
    // Assuming documentModel has functions like createDocumentDefinition, getRequiredDocumentsForProject, etc.
    const newDocument = documentModel.createDocumentDefinition({
        id: "doc1",
        type: "Technical Report",
        name: "FVE Technical Report",
        filePath: "/path/to/report.pdf"
    });
    console.log("documentModel.createDocumentDefinition test passed.");

    const mockProject = {
        fve: { panels: [{ id: "p1" }] },
        lps: { components: [] }
    };
    const requiredDocuments = documentModel.getRequiredDocumentsForProject(mockProject);
    console.log("documentModel.getRequiredDocumentsForProject test passed. Required:", requiredDocuments);

} catch (error) {
    console.error("Document model test failed:", error);
}

console.log("Document module smoke tests finished.");
