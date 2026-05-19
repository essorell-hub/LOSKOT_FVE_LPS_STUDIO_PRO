import { normalizeProject, DATA_MODEL_VERSION, APP_VERSION } from './projectModel.js';

// Define the paths to the sample project JSON files
const SAMPLE_PROJECT_PATHS = {
    minimal: 'database/sample-projects/v29/v29_minimal_project.json',
    fullFveLps: 'database/sample-projects/v29/v29_full_fve_lps_project.json',
    roofGeometry: 'database/sample-projects/v29/v29_roof_geometry_project.json',
    qaWarning: 'database/sample-projects/v29/v29_qa_warning_project.json',
};

/**
 * Returns the file path for a given sample project name.
 * @param {string} sampleName - The name of the sample project (e.g., 'minimal', 'fullFveLps').
 * @returns {string|null} The file path or null if not found.
 */
function getSampleProjectPath(sampleName) {
    return SAMPLE_PROJECT_PATHS[sampleName] || null;
}

/**
 * Loads a sample project from a raw project object.
 * In a browser/preview environment, this function doesn't actually read files from disk.
 * It uses the provided raw project object and normalizes it.
 *
 * @param {object} rawProject - The raw project data object.
 * @returns {{ok: boolean, project: object|null, warnings: string[], source: string}}
 */
function loadSampleProjectFromObject(rawProject) {
    if (!rawProject || typeof rawProject !== 'object') {
        return { ok: false, project: null, warnings: ['Invalid raw project data provided.'], source: 'directObject' };
    }

    // Simulate loading by directly using the provided object
    const { ok, project, warnings } = normalizeProject(rawProject);
    const source = 'directObject'; // Indicate that the source was a direct object

    return { ok, project, warnings, source };
}

/**
 * Lists all known sample project names.
 * @returns {string[]} An array of sample project names.
 */
function listKnownSampleProjects() {
    return Object.keys(SAMPLE_PROJECT_PATHS);
}

export {
  SAMPLE_PROJECT_PATHS,
  getSampleProjectPath,
  loadSampleProjectFromObject,
  listKnownSampleProjects
};
