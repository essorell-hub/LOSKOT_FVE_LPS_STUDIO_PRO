import { normalizeProject } from '../data/projectModel.js';
import { runProjectQa } from '../validation/qaStatusEngine.js';
import { VALIDATION_STATUS } from '../validation/basicProjectValidation.js'; // Assuming this is needed for QA status types

/**
 * Creates a project export object, including normalized project data, QA results, and manifest.
 * @param {object} project - The project object to export.
 * @param {object} options - Export options (e.g., pretty printing).
 * @returns {object} An object containing the exported project, QA, manifest, and errors if any.
 */
function createProjectExportObject(project, options = {}) {
    if (!project) {
        return { ok: false, errors: [{ message: "No project data provided." }], project: null, qa: null, manifest: null };
    }

    try {
        // 1. Normalize a copy of the project to ensure it has all required sections and correct structure.
        const normalizationResult = normalizeProject(project);
        if (!normalizationResult.ok) {
            return { ok: false, errors: [{ message: "Failed to normalize project.", details: normalizationResult.warnings }], project: null, qa: null, manifest: null };
        }
        const normalizedProject = normalizationResult.project;
        const normalizationWarnings = normalizationResult.warnings || [];

        // 2. Run QA on the normalized project.
        const qaResult = runProjectQa(normalizedProject);

        // 3. Create export manifest.
        const manifest = createExportManifest(project, qaResult, options); // Use original project for manifest creation if needed

        // Ensure we don't export the manifest *within* the project data itself unless intended.
        // The exported project should be the normalized project data.
        const exportedProjectData = { ...normalizedProject };

        return {
            ok: true,
            project: exportedProjectData,
            qa: qaResult,
            manifest: manifest,
            errors: normalizationWarnings, // Include normalization warnings as errors if they indicate issues
        };
    } catch (e) {
        console.error("Error during createProjectExportObject:", e);
        return { ok: false, errors: [{ message: "An unexpected error occurred during export preparation.", detail: e.message }], project: null, qa: null, manifest: null };
    }
}

/**
 * Stringifies the project export object into a JSON string.
 * @param {object} projectExportObject - The object returned by createProjectExportObject.
 * @param {object} options - Export options (e.g., pretty printing).
 * @returns {string} The JSON string representation of the export.
 */
function stringifyProjectExport(projectExportObject, options = {}) {
    if (!projectExportObject || !projectExportObject.ok) {
        // Return a JSON string representing the error
        return JSON.stringify({
            ok: false,
            errors: projectExportObject.errors || [{ message: "Invalid export object provided." }],
            project: null,
            qa: null,
            manifest: null,
        }, null, options.pretty ? 2 : undefined);
    }

    const { project, qa, manifest } = projectExportObject;
    const outputObject = {
        manifest: manifest,
        projectData: project, // Renamed from 'project' to 'projectData' for clarity
        qaResults: qa,
    };

    try {
        return JSON.stringify(outputObject, null, options.pretty ? 2 : undefined);
    } catch (e) {
        console.error("Error during stringifyProjectExport:", e);
        // Return a JSON string representing the stringification error
        return JSON.stringify({
            ok: false,
            errors: [{ message: "Failed to stringify export object.", detail: e.message }],
            project: null,
            qa: null,
            manifest: null,
        }, null, options.pretty ? 2 : undefined);
    }
}

/**
 * Creates a manifest object for the project export.
 * @param {object} originalProject - The original project object.
 * @param {object} qaResult - The result object from runProjectQa.
 * @param {object} options - Export options.
 * @returns {object} The manifest object.
 */
function createExportManifest(originalProject, qaResult, options = {}) {
    const now = new Date();
    const timestamp = now.toISOString();

    // Basic manifest structure
    const manifest = {
        exportTimestamp: timestamp,
        sourceAppVersion: qaResult.checks?.basicValidation?.project?.appVersion || originalProject?.appVersion || "UNKNOWN", // Try to get appVersion from normalized or original
        dataModelVersion: qaResult.checks?.basicValidation?.project?.dataModelVersion || originalProject?.dataModelVersion || "UNKNOWN", // Try to get dataModelVersion
        exportOptions: { ...options },
        qaSummary: qaResult.summary || "N/A",
        qaStatus: qaResult.status || QA_STATUS.UNKNOWN,
        fileFormat: "JSON",
        // Add any other relevant metadata here
    };

    // Add project identifiers if available
    if (originalProject && originalProject.projectId) {
        manifest.projectId = originalProject.projectId;
    }
    if (originalProject && originalProject.projectInfo && originalProject.projectInfo.projectName) {
        manifest.projectName = originalProject.projectInfo.projectName;
    }

    return manifest;
}


export {
    createProjectExportObject,
    stringifyProjectExport,
    createExportManifest
};
