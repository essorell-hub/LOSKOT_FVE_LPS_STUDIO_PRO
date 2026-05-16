import { normalizeProject } from '../data/projectModel.js';
import { runProjectQa, QA_STATUS } from '../validation/qaStatusEngine.js';

/**
 * Safely parses a JSON string.
 * @param {string} jsonText - The JSON string to parse.
 * @returns {{ok: boolean, status: string, errors: Array<object>|null, data: object|null}}
 */
function parseProjectJsonText(jsonText) {
    try {
        const data = JSON.parse(jsonText);
        return { ok: true, status: "success", errors: null, data: data };
    } catch (e) {
        return { ok: false, status: "error", errors: [{ message: `Invalid JSON: ${e.message}` }], data: null };
    }
}

/**
 * Creates an import preview object from raw project data.
 * @param {object} rawObject - The raw project object.
 * @returns {object} The import preview object.
 */
function createImportPreviewFromObject(rawObject) {
    const warnings = [];
    const errors = [];
    let canImport = true;
    let projectPreview = null;
    let qa = null;

    try {
        const normalizationResult = normalizeProject(rawObject);
        warnings.push(...normalizationResult.warnings);
        projectPreview = normalizationResult.project;

        if (!projectPreview) {
            errors.push({ type: QA_STATUS.ERROR, message: "Failed to normalize project.", section: "general" });
            canImport = false;
        } else {
            // Run QA only if normalization was successful
            qa = runProjectQa(projectPreview);

            // Determine canImport status based on QA results
            if (qa.status === QA_STATUS.CRITICAL || qa.status === QA_STATUS.ERROR) {
                canImport = false;
                errors.push({ type: QA_STATUS.ERROR, message: `Project has critical QA issues (Status: ${qa.status}).`, section: "qa" });
            } else if (qa.status === QA_STATUS.WARNING) {
                // Allow import even with warnings, but flag it
                warnings.push({ type: QA_STATUS.WARNING, message: "Project has warnings.", section: "qa" });
            }
        }
    } catch (e) {
        console.error("Error during import preview creation:", e);
        errors.push({ type: QA_STATUS.CRITICAL, message: "An unexpected error occurred during preview creation.", detail: e.message });
        canImport = false;
    }

    return {
        ok: canImport,
        status: errors.length > 0 ? "error" : (qa?.status || "pending"),
        projectPreview: projectPreview,
        qa: qa,
        warnings: warnings,
        errors: errors,
        canImport: canImport,
    };
}

/**
 * Creates an import preview object from a JSON text string.
 * @param {string} jsonText - The JSON text string of the project.
 * @returns {object} The import preview object.
 */
function createImportPreviewFromText(jsonText) {
    const parseResult = parseProjectJsonText(jsonText);

    if (!parseResult.ok) {
        return {
            ok: false,
            status: "error",
            projectPreview: null,
            qa: null,
            warnings: [],
            errors: parseResult.errors,
            canImport: false,
        };
    }

    return createImportPreviewFromObject(parseResult.data);
}

export {
    parseProjectJsonText,
    createImportPreviewFromText,
    createImportPreviewFromObject
};
