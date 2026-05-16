import { createProjectStore, getProjectStoreSummary } from './projectStore.js';
import { runProjectQa, QA_STATUS } from '../validation/qaStatusEngine.js';

/**
 * Creates a state adapter for the application project.
 * This adapter provides safe access to project data, QA status, and module data.
 * @param {object} [initialProject] - The initial project data to load.
 * @returns {object} An object containing the project store and methods to interact with it.
 */
function createAppProjectState(initialProject) {
    const store = createProjectStore(initialProject);

    /**
     * Safely retrieves inspector data from the project.
     * @returns {object} Inspector data including summaries and counts.
     */
    const getInspectorData = () => {
        const project = store.getProject();
        const qaStatus = runProjectQa(project); // Run QA to get latest status for counts

        // Ensure basic project info and building summary are available
        const projectSummary = store.getSummary() || {}; // Use store's summary
        const projectInfo = project?.projectInfo || {}; // Fallback for missing projectInfo
        const buildingSummary = project?.building || {}; // Fallback for missing building section

        // Safely count various components
        const roofs = project?.roofs?.length || 0;
        const panels = project?.fve?.panels?.length || 0;
        const strings = project?.fve?.strings?.length || 0;
        const lpsElements = project?.lps?.components?.length || 0; // Assuming 'components' is the array for LPS elements
        const cadObjects = project?.cad?.objects?.length || 0;
        const documents = project?.documents?.length || 0;
        const qaWarningsCount = qaStatus.warnings?.length || 0;

        return {
            projectSummary,
            projectInfo,
            buildingSummary,
            counts: {
                roofs,
                panels,
                strings,
                lpsElements,
                cadObjects,
                documents,
                qaWarnings: qaWarningsCount,
            },
        };
    };

    /**
     * Safely retrieves QA data for the project.
     * Runs the QA process and returns its results.
     * @returns {object} The result of the runProjectQa function.
     */
    const getQaData = () => {
        try {
            const project = store.getProject();
            return runProjectQa(project);
        } catch (error) {
            console.error("Error in getQaData:", error);
            // Return a structured error object instead of throwing
            return {
                ok: false,
                status: QA_STATUS.CRITICAL,
                score: 0,
                errors: [{ type: QA_STATUS.CRITICAL, message: "Failed to retrieve QA data.", detail: error.message }],
                warnings: [],
                info: [],
                checks: {},
                summary: `Critical error during QA: ${error.message}`,
                createdAt: new Date().toISOString(),
            };
        }
    };

    /**
     * Safely retrieves data for a specific module.
     * @param {string} moduleName - The name of the module (e.g., 'fve', 'lps', 'cad').
     * @returns {object} The data for the specified module, or an empty object if not found or an error occurs.
     */
    const getModuleData = (moduleName) => {
        try {
            const project = store.getProject();
            // Use a safe getter for project sections
            if (project && typeof project === 'object' && project.hasOwnProperty(moduleName)) {
                return project[moduleName] || {}; // Return module data or empty object
            }
            return {}; // Return empty object if moduleName is not a property of project
        } catch (error) {
            console.error(`Error in getModuleData for module "${moduleName}":`, error);
            // Return an empty object or a specific error structure for the module
            return { error: `Failed to load module data: ${error.message}` };
        }
    };

    /**
     * Sets the entire project data. This will trigger updates.
     * @param {object} project - The new project data.
     */
    const setProject = (project) => {
        store.setProject(project);
    };

    /**
     * Updates the project using an updater function.
     * @param {function(object): object} updater - A function that receives the current project and returns the updated project.
     */
    const updateProject = (updater) => {
        store.updateProject(updater);
    };

    return {
        store, // Expose the underlying store if needed for direct subscription, etc.
        getInspectorData,
        getQaData,
        getModuleData,
        setProject,
        updateProject,
    };
}

export {
    createAppProjectState,
    QA_STATUS // Export QA_STATUS for external use if needed
};
