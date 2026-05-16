import { v4 as uuidv4 } from 'uuid';
import { SUPPORTED_LPS_GEOMETRY_TYPES } from '../lps/lpsObjectModel'; // Assuming this is needed for validation or type checking
import { VALIDATION_STATUS } from '../validation/basicProjectValidation'; // Assuming this is needed for validation issues

// Define known document types
export const DOCUMENT_TYPES = {
    FVE_TECHNICAL_REPORT: 'FVE_TECHNICAL_REPORT',
    LPS_TECHNICAL_REPORT: 'LPS_TECHNICAL_REPORT',
    RISK_ASSESSMENT: 'RISK_ASSESSMENT',
    DEVICE_LIST: 'DEVICE_LIST',
    STRING_REPORT: 'STRING_REPORT',
    SPD_REPORT: 'SPD_REPORT',
    QA_REPORT: 'QA_REPORT',
    EXPORT_PROTOCOL: 'EXPORT_PROTOCOL',
};

// Function to create a definition for a single document
export function createDocumentDefinition({ id, type, name, description, version, filePath, relatedEntities = {} }) {
    const now = new Date();
    const timestamp = now.toISOString();

    if (!id) throw new Error("Document ID is required.");
    if (!type) throw new Error("Document type is required.");
    if (!name) throw new Error("Document name is required.");

    return {
        id,
        type,
        name,
        description: description || "",
        version: version || "1.0",
        filePath: filePath || null, // Path to the actual document file
        relatedEntities: relatedEntities, // e.g., { fveIds: ['id1'], lpsIds: ['id2'] }
        createdAt: timestamp,
        updatedAt: timestamp,
    };
}

// Function to normalize and potentially update a document definition
export function normalizeDocumentDefinition(docDef, updateTimestamp = true) {
    if (!docDef) return null;

    const now = new Date();
    const timestamp = now.toISOString();

    const normalized = {
        id: docDef.id || uuidv4(),
        type: docDef.type || DOCUMENT_TYPES.UNKNOWN, // Assuming an UNKNOWN type if not provided
        name: docDef.name || "Unnamed Document",
        description: docDef.description || "",
        version: docDef.version || "1.0",
        filePath: docDef.filePath || null,
        relatedEntities: docDef.relatedEntities || {},
        createdAt: docDef.createdAt || timestamp,
        updatedAt: updateTimestamp ? timestamp : (docDef.updatedAt || timestamp),
    };

    // Ensure relatedEntities is an object, even if initially null/undefined
    if (typeof normalized.relatedEntities !== 'object' || normalized.relatedEntities === null) {
        normalized.relatedEntities = {};
    }

    return normalized;
}

// Function to create a set of documents for a project
export function createProjectDocumentSet(project) {
    const now = new Date();
    const timestamp = now.toISOString();
    const documents = [];

    // --- FVE Technical Report ---
    if (project?.fve?.panels?.length > 0 || project?.fve?.inverters?.length > 0) {
        documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.FVE_TECHNICAL_REPORT,
            name: "FVE Technical Report",
            description: "Technical report detailing the FVE system design and components.",
            relatedEntities: { fveIds: project.fve.panels.map(p => p.id) } // Example relation
        }));
    }

    // --- LPS Technical Report ---
    if (project?.lps?.components?.length > 0) {
        documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.LPS_TECHNICAL_REPORT,
            name: "LPS Technical Report",
            description: "Technical report detailing the LPS system design and components.",
            relatedEntities: { lpsIds: project.lps.components.map(c => c.id) } // Example relation
        }));
    }

    // --- Risk Assessment ---
    // This might be generated based on LPS data or specific input
    // For now, assume it's created if LPS components exist
    if (project?.lps?.components?.length > 0) {
        documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.RISK_ASSESSMENT,
            name: "Risk Assessment",
            description: "Risk assessment report for the LPS system.",
            // relatedEntities could link to specific LPS components or risk assessment parameters
        }));
    }

    // --- Device List ---
    // Aggregating devices from FVE and LPS
    const allDevices = [];
    if (project?.fve?.panels) allDevices.push(...project.fve.panels);
    if (project?.fve?.inverters) allDevices.push(...project.fve.inverters);
    if (project?.lps?.components) allDevices.push(...project.lps.components);
    if (allDevices.length > 0) {
        documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.DEVICE_LIST,
            name: "Device List",
            description: "List of all devices used in the project (FVE and LPS).",
            relatedEntities: { deviceIds: allDevices.map(d => d.id) } // Example relation
        }));
    }

    // --- String Report (FVE specific) ---
    if (project?.fve?.strings?.length > 0) {
        documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.STRING_REPORT,
            name: "String Report",
            description: "Detailed report on FVE strings.",
            relatedEntities: { fveStringIds: project.fve.strings.map(s => s.id) }
        }));
    }

    // --- SPD Report ---
    // SPD devices might be part of LPS or a separate section
    if (project?.spd?.devices?.length > 0) {
         documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.SPD_REPORT,
            name: "SPD Report",
            description: "Report on Surge Protection Devices (SPD).",
            relatedEntities: { spdIds: project.spd.devices.map(d => d.id) }
        }));
    }

     // --- QA Report ---
    // This would depend on how QA is structured in the project model
    // Assuming there's a QA section or related entities
    if (project?.qa?.status) { // Example condition
        documents.push(createDocumentDefinition({
            id: uuidv4(),
            type: DOCUMENT_TYPES.QA_REPORT,
            name: "QA Report",
            description: "Quality Assurance report for the project.",
            relatedEntities: { qaIds: [project.qa.id] } // Example relation if QA has an ID
        }));
    }

    // --- Export Protocol ---
    // This might be generated upon project export
    documents.push(createDocumentDefinition({
        id: uuidv4(),
        type: DOCUMENT_TYPES.EXPORT_PROTOCOL,
        name: "Export Protocol",
        description: "Record of project data export.",
        // No specific related entities here as it relates to the export action itself
    }));


    return documents;
}

// Function to get required documents for a project, potentially based on its components
export function getRequiredDocumentsForProject(project) {
    const required = new Set();

    // Example logic: if FVE components exist, FVE report is required
    if (project?.fve?.panels?.length > 0 || project?.fve?.inverters?.length > 0) {
        required.add(DOCUMENT_TYPES.FVE_TECHNICAL_REPORT);
    }

    // Example logic: if LPS components exist, LPS report and Risk Assessment are required
    if (project?.lps?.components?.length > 0) {
        required.add(DOCUMENT_TYPES.LPS_TECHNICAL_REPORT);
        required.add(DOCUMENT_TYPES.RISK_ASSESSMENT);
    }

    // Example logic: Device list is always required if there are any devices
    const hasAnyDevices = (project?.fve?.panels?.length > 0 || project?.fve?.inverters?.length > 0 || project?.lps?.components?.length > 0 || project?.spd?.devices?.length > 0);
    if (hasAnyDevices) {
        required.add(DOCUMENT_TYPES.DEVICE_LIST);
    }

    // Example logic: String report is required if FVE strings are defined
    if (project?.fve?.strings?.length > 0) {
        required.add(DOCUMENT_TYPES.STRING_REPORT);
    }

    // Example logic: SPD report is required if SPD devices are defined
    if (project?.spd?.devices?.length > 0) {
        required.add(DOCUMENT_TYPES.SPD_REPORT);
    }

     // Example logic: QA report is required if QA section exists and has status
    if (project?.qa?.status) {
        required.add(DOCUMENT_TYPES.QA_REPORT);
    }

    // Export protocol might be considered required for any complete project export
    // required.add(DOCUMENT_TYPES.EXPORT_PROTOCOL);


    return Array.from(required);
}

// Function to validate if a project has all its required documents ready
export function validateDocumentReadiness(project, existingDocumentDefinitions) {
    const requiredTypes = getRequiredDocumentsForProject(project);
    const existingDocumentTypeMap = new Map(existingDocumentDefinitions.map(doc => [doc.type, doc]));
    const validationIssues = [];

    requiredTypes.forEach(requiredType => {
        const existingDoc = existingDocumentTypeMap.get(requiredType);
        if (!existingDoc) {
            validationIssues.push({
                type: VALIDATION_STATUS.ERROR,
                message: `Required document missing: ${requiredType}`,
                section: 'documents',
                detail: `A document of type '${requiredType}' is required but not found.`
            });
        } else if (!existingDoc.filePath) {
            validationIssues.push({
                type: VALIDATION_STATUS.WARNING,
                message: `Document not ready: ${requiredType}`,
                section: 'documents',
                detail: `Document '${existingDoc.name}' (type: ${requiredType}) is defined but has no file path.`
            });
        }
    });

    // Optional: Check for unexpected documents
    const allDefinedTypes = new Set(existingDocumentDefinitions.map(doc => doc.type));
    const unexpectedTypes = [...allDefinedTypes].filter(type => !requiredTypes.includes(type) && type !== DOCUMENT_TYPES.EXPORT_PROTOCOL); // Exclude export protocol if not explicitly required by logic

    unexpectedTypes.forEach(unexpectedType => {
         const unexpectedDoc = existingDocumentTypeMap.get(unexpectedType);
         if (unexpectedDoc) {
              validationIssues.push({
                type: VALIDATION_STATUS.INFO,
                message: `Optional document found: ${unexpectedType}`,
                section: 'documents',
                detail: `Document '${unexpectedDoc.name}' (type: ${unexpectedType}) is present but not strictly required by current project configuration.`
            });
         }
    });


    return {
        isReady: validationIssues.every(issue => issue.type !== VALIDATION_STATUS.ERROR),
        issues: validationIssues,
    };
}

// Function to create a summary of the project's documents
export function createDocumentSummary(documents) {
    if (!Array.isArray(documents)) {
        return {
            totalDocuments: 0,
            documentsByType: {},
            documentsWithFiles: 0,
            documentsWithoutFiles: 0,
        };
    }

    const summary = {
        totalDocuments: documents.length,
        documentsByType: {},
        documentsWithFiles: 0,
        documentsWithoutFiles: 0,
    };

    documents.forEach(doc => {
        // Count by type
        summary.documentsByType[doc.type] = (summary.documentsByType[doc.type] || 0) + 1;

        // Count readiness
        if (doc.filePath) {
            summary.documentsWithFiles++;
        } else {
            summary.documentsWithoutFiles++;
        }
    });

    return summary;
}

// Placeholder for a document type that might be added later or if type is unknown
// export const DOCUMENT_TYPES.UNKNOWN = 'UNKNOWN'; // Add this if you need it
