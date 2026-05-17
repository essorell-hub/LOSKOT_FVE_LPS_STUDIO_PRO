import { v4 as uuidv4 } from 'uuid';

import * as fveIndex from '../fve/index';
import * as cadIndex from '../cad/index';
import * as lpsIndex from '../lps/index';
import * as documentModel from '../documents/documentModel';
import * as projectRepositoryPreview from '../database/projectRepositoryPreview';
import * as exportPackageModel from '../export/exportPackageModel';

// Placeholder for LPS risk assessment - not a full norm calculation
const LPS_RISK_PLACEHOLDER = "placeholder_risk_assessment";

const WORKFLOW_STATUS = {
    SUCCESS: "ÚSPĚCH",
    WARNING: "VAROVÁNÍ",
    ERROR: "CHYBA",
};

/**
 * Safely gets a project section, returning a fallback value if the section is missing or invalid.
 * @param {object} project The project object.
 * @param {string} sectionName The name of the section to retrieve.
 * @param {*} fallbackValue The value to return if the section is not found or invalid.
 * @returns {*} The project section or the fallback value.
 */
function safeGetProjectSection(project, sectionName, fallbackValue) {
    if (!project || typeof project !== 'object') {
        return fallbackValue;
    }
    if (Object.prototype.hasOwnProperty.call(project, sectionName)) {
        return project[sectionName];
    }
    return fallbackValue;
}

/**
 * Normalizes a project for the workflow engine.
 * @param {object} project The project object.
 * @returns {object} The normalized project object.
 */
export function normalizeWorkflowProject(project) {
    if (!project) return {};

    const now = new Date();
    const timestamp = now.toISOString();

    // Deep clone to avoid modifying original objects
    const normalizedProject = JSON.parse(JSON.stringify(project));

    // Ensure core sections exist with default structures if missing
    normalizedProject.fve = normalizedProject.fve || {};
    normalizedProject.cad = normalizedProject.cad || {};
    normalizedProject.lps = normalizedProject.lps || {};
    normalizedProject.documents = normalizedProject.documents || [];
    normalizedProject.exportManifest = normalizedProject.exportManifest || {};
    normalizedProject.workflow = normalizedProject.workflow || {
        status: WORKFLOW_STATUS.SUCCESS,
        warnings: [],
        errors: [],
        summary: {},
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    // Normalize nested structures using their respective model functions
    if (normalizedProject.fve) {
        // Assuming fveIndex.panelSelectionModel and others have normalization functions
        // For now, just ensure basic structure
    }
    if (normalizedProject.cad) {
        normalizedProject.cad.layers = (normalizedProject.cad.layers || []).map(layer =>
            cadIndex.layerModel.normalizeCadLayer(layer) // Assuming normalizeCadLayer exists
        );
        normalizedProject.cad.objects = (normalizedProject.cad.objects || []).map(obj =>
            cadIndex.objectModel.normalizeCadObject(obj) // Assuming normalizeCadObject exists
        );
    }
    if (normalizedProject.lps) {
        normalizedProject.lps.objects = (normalizedProject.lps.objects || []).map(obj =>
            lpsIndex.lpsObjectModel.normalizeLpsObject(obj) // Assuming normalizeLpsObject exists
        );
        normalizedProject.lps.riskAssessment = LPS_RISK_PLACEHOLDER; // Placeholder
    }
    normalizedProject.documents = (normalizedProject.documents || []).map(doc =>
        documentModel.createDocumentDefinition(doc) // Assuming createDocumentDefinition normalizes
    );

    normalizedProject.workflow.updatedAt = timestamp;

    return normalizedProject;
}

/**
 * Creates a new project structure for the workflow engine.
 * @param {object} input Input data for the new project.
 * @returns {object} A new project object ready for the workflow.
 */
export function createWorkflowProject(input) {
    const now = new Date();
    const timestamp = now.toISOString();

    const baseProject = {
        id: uuidv4(),
        name: input.name || "New Workflow Project",
        createdAt: timestamp,
        updatedAt: timestamp,
        projectType: "FVE_LPS_Workflow",
        // Initialize sections with defaults
        fve: {
            panels: [],
            strings: [],
            inverters: [],
            // other FVE specific properties
        },
        cad: {
            layers: [],
            objects: [],
            // other CAD specific properties
        },
        lps: {
            objects: [],
            riskAssessment: LPS_RISK_PLACEHOLDER, // Placeholder
            // other LPS specific properties
        },
        documents: [],
        exportManifest: {},
        workflow: {
            status: WORKFLOW_STATUS.SUCCESS,
            warnings: [],
            errors: [],
            summary: {},
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // Merge with input data, prioritizing input
    const newProject = { ...baseProject, ...input };

    // Normalize the merged project to ensure consistency
    return normalizeWorkflowProject(newProject);
}

/**
 * Runs Quality Assurance checks on the project within the workflow context.
 * @param {object} project The project object.
 * @returns {object} An object containing validation issues.
 */
export function runWorkflowQa(project) {
    const warnings = [];
    const errors = [];

    // --- FVE Checks ---
    const fveData = safeGetProjectSection(project, 'fve', {});
    if (!fveData.panels || fveData.panels.length === 0) {
        warnings.push({ message: "Žádné FVE panely nebyly definovány.", section: "FVE", status: WORKFLOW_STATUS.WARNING });
    }
    // Add more FVE specific QA checks here

    // --- CAD Checks ---
    const cadData = safeGetProjectSection(project, 'cad', {});
    if (!cadData.layers || cadData.layers.length === 0) {
        warnings.push({ message: "Žádné CAD vrstvy nebyly definovány.", section: "CAD", status: WORKFLOW_STATUS.WARNING });
    }
    if (!cadData.objects || cadData.objects.length === 0) {
        warnings.push({ message: "Žádné CAD objekty nebyly definovány.", section: "CAD", status: WORKFLOW_STATUS.WARNING });
    }
    // Add more CAD specific QA checks here

    // --- LPS Checks ---
    const lpsData = safeGetProjectSection(project, 'lps', {});
    if (!lpsData.objects || lpsData.objects.length === 0) {
        warnings.push({ message: "Žádné LPS objekty nebyly definovány.", section: "LPS", status: WORKFLOW_STATUS.WARNING });
    }
    if (lpsData.riskAssessment === LPS_RISK_PLACEHOLDER) {
        warnings.push({ message: "LPS Risk Assessment je pouze zástupný symbol a nebyl proveden skutečný výpočet.", section: "LPS", status: WORKFLOW_STATUS.WARNING });
    }
    // Add more LPS specific QA checks here

    // --- Document Checks ---
    const documents = safeGetProjectSection(project, 'documents', []);
    const requiredDocTypes = documentModel.getRequiredDocumentsForProject(project);
    const presentDocTypes = new Set(documents.map(doc => doc.type));

    requiredDocTypes.forEach(requiredType => {
        if (!presentDocTypes.has(requiredType)) {
            warnings.push({ message: `Chybí povinný dokument typu: ${requiredType}`, section: "Dokumenty", status: WORKFLOW_STATUS.WARNING });
        }
    });

    // --- Export Manifest Check ---
    const manifest = safeGetProjectSection(project, 'exportManifest', {});
    const manifestValidation = exportPackageModel.validateExportPackageManifest(manifest);
    if (!manifestValidation.isValid) {
        manifestValidation.issues.forEach(issue => {
            errors.push({ message: issue.message, section: `Export Manifest (${issue.section || 'general'})`, status: WORKFLOW_STATUS.ERROR });
        });
    }

    // --- General Checks ---
    if (!project.name) {
        errors.push({ message: "Název projektu není definován.", section: "Obecné", status: WORKFLOW_STATUS.ERROR });
    }

    const combinedIssues = [...warnings, ...errors];
    const overallStatus = errors.length > 0 ? WORKFLOW_STATUS.ERROR : (warnings.length > 0 ? WORKFLOW_STATUS.WARNING : WORKFLOW_STATUS.SUCCESS);

    return {
        status: overallStatus,
        warnings: warnings,
        errors: errors,
        issues: combinedIssues,
    };
}

/**
 * Creates a summary of the workflow execution.
 * @param {object} project The project object.
 * @returns {object} The workflow summary.
 */
export function createWorkflowSummary(project) {
    const workflowData = safeGetProjectSection(project, 'workflow', {});
    const qaResults = runWorkflowQa(project); // Re-run QA for up-to-date summary

    const summary = {
        overallStatus: qaResults.status,
        executedAt: workflowData.updatedAt || new Date().toISOString(),
        fveStatus: "N/A", // Placeholder
        cadStatus: "N/A", // Placeholder
        lpsStatus: "N/A", // Placeholder
        documentStatus: qaResults.issues.some(issue => issue.section === "Dokumenty") ? WORKFLOW_STATUS.WARNING : WORKFLOW_STATUS.SUCCESS,
        exportManifestStatus: qaResults.issues.some(issue => issue.section.startsWith("Export Manifest")) ? WORKFLOW_STATUS.ERROR : WORKFLOW_STATUS.SUCCESS,
        totalWarnings: qaResults.warnings.length,
        totalErrors: qaResults.errors.length,
        details: qaResults.issues,
    };

    // Attempt to determine status from specific sections if available
    if (project.fve && project.fve.status) summary.fveStatus = project.fve.status;
    if (project.cad && project.cad.status) summary.cadStatus = project.cad.status;
    if (project.lps && project.lps.status) summary.lpsStatus = project.lps.status;

    return summary;
}

/**
 * Saves the project using the provided store.
 * @param {object} store The storage object (e.g., projectRepositoryPreview).
 * @param {object} project The project object to save.
 * @returns {Promise<void>} A promise that resolves when the project is saved.
 */
export async function saveWorkflowProject(store, project) {
    if (!store || typeof store.saveProject !== 'function') {
        console.error("Invalid store provided for saving project.");
        return;
    }
    if (!project || !project.id) {
        console.error("Invalid project data provided for saving.");
        return;
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const projectToSave = {
        ...project,
        workflow: {
            ...(project.workflow || {}),
            updatedAt: timestamp,
        },
        // Ensure a fresh summary is generated before saving
        workflow: {
            ...(project.workflow || {}),
            summary: createWorkflowSummary(project),
            updatedAt: timestamp,
        }
    };

    // Use the repository's normalization function before saving
    const normalizedForSave = projectRepositoryPreview.normalizeProjectRecord(projectToSave, true);

    await store.saveProject(normalizedForSave);
}

/**
 * Loads a project from the store using its ID.
 * @param {object} store The storage object (e.g., projectRepositoryPreview).
 * @param {string} projectId The ID of the project to load.
 * @returns {Promise<object|null>} A promise that resolves with the loaded project or null if not found.
 */
export async function loadWorkflowProject(store, projectId) {
    if (!store || typeof store.loadProject !== 'function') {
        console.error("Invalid store provided for loading project.");
        return null;
    }
    if (!projectId) {
        console.error("Project ID is required for loading.");
        return null;
    }

    const project = await store.loadProject(projectId);
    if (!project) {
        return null;
    }

    // Normalize the loaded project to ensure it conforms to workflow standards
    return normalizeWorkflowProject(project);
}

/**
 * Creates the manifest for an export package based on the project data.
 * @param {object} project The project object.
 * @returns {object} The export package manifest.
 */
export function createWorkflowExportManifest(project) {
    const now = new Date();
    const timestamp = now.toISOString();

    const manifest = {
        ...project.exportManifest, // Start with existing manifest if any
        version: "1.0.0", // Basic versioning
        generatedAt: timestamp,
        projectName: project.name,
        projectType: project.projectType,
        workflowStatus: project.workflow?.status || WORKFLOW_STATUS.SUCCESS,
        includedModules: {
            fve: !!(project.fve && (project.fve.panels?.length > 0 || project.fve.strings?.length > 0)),
            cad: !!(project.cad && (project.cad.layers?.length > 0 || project.cad.objects?.length > 0)),
            lps: !!(project.lps && project.lps.objects?.length > 0),
            documents: !!(project.documents && project.documents.length > 0),
        },
        // Add more details as needed, e.g., counts of items, specific settings
    };

    // Validate the generated manifest
    const validation = exportPackageModel.validateExportPackageManifest(manifest);
    if (!validation.isValid) {
        console.warn("Generated export manifest has validation issues:", validation.issues);
        // Decide how to handle validation issues: add to project.workflow.warnings or return them?
        // For now, just log. If they are critical, they might be added to project.workflow.errors later.
    }

    return manifest;
}

/**
 * Runs a full preview of the workflow, potentially involving multiple steps.
 * @param {object} store The storage object.
 * @param {object} project The project object.
 * @returns {Promise<object>} A promise that resolves with the result of the full workflow preview.
 */
export async function runFullWorkflowPreview(store, project) {
    // This is a placeholder function. A real implementation would:
    // 1. Trigger specific FVE calculations.
    // 2. Render CAD preview based on layers and objects.
    // 3. Simulate LPS risk assessment.
    // 4. Potentially generate document previews.
    // 5. Update the project's status and summary.

    let currentProject = { ...project };
    let overallStatus = WORKFLOW_STATUS.SUCCESS;
    const allWarnings = [];
    const allErrors = [];

    // Step 1: Normalize project data if not already done
    currentProject = normalizeWorkflowProject(currentProject);

    // Step 2: Run QA checks
    const qaResult = runWorkflowQa(currentProject);
    allWarnings.push(...qaResult.warnings);
    allErrors.push(...qaResult.errors);
    if (qaResult.status === WORKFLOW_STATUS.ERROR) {
        overallStatus = WORKFLOW_STATUS.ERROR;
    } else if (qaResult.status === WORKFLOW_STATUS.WARNING && overallStatus !== WORKFLOW_STATUS.ERROR) {
        overallStatus = WORKFLOW_STATUS.WARNING;
    }

    // Step 3: Simulate FVE calculations (replace with actual calls)
    try {
        // Example: currentProject.fve.calculationResult = fveIndex.someCalculationFunction(currentProject.fve);
        // For now, just update status if FVE data exists
        if (currentProject.fve && (currentProject.fve.panels?.length > 0 || currentProject.fve.strings?.length > 0)) {
             currentProject.fve.status = WORKFLOW_STATUS.SUCCESS;
        } else {
            currentProject.fve.status = WORKFLOW_STATUS.WARNING;
            allWarnings.push({ message: "Simulace FVE: Nebyly nalezeny žádné FVE komponenty.", section: "FVE", status: WORKFLOW_STATUS.WARNING });
        }
    } catch (e) {
        console.error("FVE Calculation failed:", e);
        currentProject.fve.status = WORKFLOW_STATUS.ERROR;
        allErrors.push({ message: `Chyba při simulaci FVE výpočtu: ${e.message}`, section: "FVE", status: WORKFLOW_STATUS.ERROR });
        overallStatus = WORKFLOW_STATUS.ERROR;
    }

    // Step 4: Simulate CAD processing (replace with actual calls)
     try {
        // Example: Render CAD layers and objects
        if (currentProject.cad && (currentProject.cad.layers?.length > 0 || currentProject.cad.objects?.length > 0)) {
            currentProject.cad.status = WORKFLOW_STATUS.SUCCESS;
        } else {
            currentProject.cad.status = WORKFLOW_STATUS.WARNING;
            allWarnings.push({ message: "Simulace CAD: Nebyly nalezeny žádné CAD komponenty.", section: "CAD", status: WORKFLOW_STATUS.WARNING });
        }
    } catch (e) {
        console.error("CAD Processing failed:", e);
        currentProject.cad.status = WORKFLOW_STATUS.ERROR;
        allErrors.push({ message: `Chyba při simulaci zpracování CAD: ${e.message}`, section: "CAD", status: WORKFLOW_STATUS.ERROR });
        overallStatus = WORKFLOW_STATUS.ERROR;
    }

    // Step 5: Simulate LPS processing (replace with actual calls)
     try {
        // Example: LPS risk assessment simulation
         if (currentProject.lps && currentProject.lps.objects?.length > 0) {
            currentProject.lps.status = WORKFLOW_STATUS.SUCCESS;
            // Important: Do not state placeholder is a norm calculation
            if (currentProject.lps.riskAssessment === LPS_RISK_PLACEHOLDER) {
                currentProject.lps.status = WORKFLOW_STATUS.WARNING;
                allWarnings.push({ message: "Simulace LPS: Risk assessment je zástupný symbol.", section: "LPS", status: WORKFLOW_STATUS.WARNING });
            }
        } else {
            currentProject.lps.status = WORKFLOW_STATUS.WARNING;
            allWarnings.push({ message: "Simulace LPS: Nebyly nalezeny žádné LPS komponenty.", section: "LPS", status: WORKFLOW_STATUS.WARNING });
        }
    } catch (e) {
        console.error("LPS Processing failed:", e);
        currentProject.lps.status = WORKFLOW_STATUS.ERROR;
        allErrors.push({ message: `Chyba při simulaci zpracování LPS: ${e.message}`, section: "LPS", status: WORKFLOW_STATUS.ERROR });
        overallStatus = WORKFLOW_STATUS.ERROR;
    }

    // Step 6: Update project workflow status and summary
    currentProject.workflow = {
        ...(currentProject.workflow || {}),
        status: overallStatus,
        warnings: allWarnings,
        errors: allErrors,
        summary: createWorkflowSummary(currentProject), // Generate final summary
        updatedAt: new Date().toISOString(),
    };

    // Step 7: Save the updated project state
    if (store && typeof store.saveProject === 'function') {
        try {
            await saveWorkflowProject(store, currentProject);
        } catch (saveError) {
            console.error("Failed to save project after workflow preview:", saveError);
            // Add a specific error if saving fails
            allErrors.push({ message: `Chyba při ukládání projektu po náhledu: ${saveError.message}`, section: "Workflow", status: WORKFLOW_STATUS.ERROR });
            currentProject.workflow.status = WORKFLOW_STATUS.ERROR; // Ensure status reflects save error
            currentProject.workflow.errors = allErrors;
        }
    } else {
        console.warn("Store not available or does not have saveProject method. Project state not saved after preview.");
        // Consider adding a warning if saving is expected but not possible
        if (overallStatus !== WORKFLOW_STATUS.ERROR) { // Avoid adding redundant errors
             allWarnings.push({ message: "Projekt nebyl uložen po náhledu workflow.", section: "Workflow", status: WORKFLOW_STATUS.WARNING });
        }
    }

    // Return the final state of the project after the preview run
    return {
        project: currentProject,
        status: overallStatus,
        warnings: allWarnings,
        errors: allErrors,
    };
}
