import {
    createEmptyProject,
    normalizeProject,
    getProjectSummary
} from './projectModel.js';

// Constants for validation and status
const QA_STATUS = {
    CRITICAL: 'CRITICAL',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    INFO: 'INFO',
    OK: 'OK',
    PENDING: 'PENDING',
    UNKNOWN: 'UNKNOWN',
};

const VALIDATION_STATUS = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
};

/**
 * Creates a snapshot of the project in a safe, JSON-serializable format.
 * This helps prevent accidental modifications to the live project data.
 * @param {object} project - The current project object.
 * @returns {object} A deep copy of the project object.
 */
function createSafeProjectSnapshot(project) {
    try {
        // Using JSON.parse(JSON.stringify(...)) for a deep clone
        return JSON.parse(JSON.stringify(project || {}));
    } catch (e) {
        console.error("Error creating project snapshot:", e);
        // Return a minimal structure to avoid crashing the UI
        return {
            projectId: "snapshot_error",
            dataModelVersion: "unknown",
            appVersion: "unknown",
            error: "Failed to create snapshot",
        };
    }
}

/**
 * Creates a project store with methods for managing project data.
 * Ensures all operations are safe and don't crash the UI.
 * @param {object} [initialProject] - Optional initial project data. If not provided, an empty project is created.
 * @returns {object} The project store object.
 */
function createProjectStore(initialProject) {
    let currentProject = createEmptyProject();
    let currentWarnings = [];
    let listeners = new Set();

    // Helper to safely normalize and update the project
    const updateAndNormalize = (projectData) => {
        const normalizationResult = normalizeProject(projectData);
        currentProject = normalizationResult.project;
        currentWarnings = normalizationResult.warnings || [];
        // Ensure the project is always valid, even if normalization failed partially
        if (!currentProject) {
            console.error("Normalization resulted in a null project. Resetting to empty.");
            currentProject = createEmptyProject();
            currentWarnings.push("Normalization failed, reset to empty project.");
        }
    };

    // Initialize with provided project or an empty one
    if (initialProject) {
        updateAndNormalize(initialProject);
    } else {
        // Ensure it's at least an empty, normalized project
        updateAndNormalize(createEmptyProject());
    }

    const notify = () => {
        listeners.forEach(listener => {
            try {
                listener();
            } catch (e) {
                console.error("Error in listener callback:", e);
            }
        });
    };

    return {
        /**
         * Gets the current project data. Returns a safe snapshot.
         * @returns {object} A snapshot of the current project.
         */
        getProject: () => {
            return createSafeProjectSnapshot(currentProject);
        },

        /**
         * Sets the entire project data to a new value.
         * Normalizes the new project and notifies listeners.
         * @param {object} nextProject - The new project data.
         */
        setProject: (nextProject) => {
            updateAndNormalize(nextProject);
            notify();
        },

        /**
         * Updates the project using an updater function.
         * The updater function receives the current project and should return the next project state.
         * @param {function(object): object} updater - A function that takes the current project and returns the next project state.
         */
        updateProject: (updater) => {
            try {
                const nextProjectState = updater(currentProject);
                updateAndNormalize(nextProjectState);
                notify();
            } catch (e) {
                console.error("Error during updateProject:", e);
                // Optionally notify about the error, or just log it
                // notify(); // Decide if an error in update should still trigger a notification
            }
        },

        /**
         * Resets the project to an empty, default state.
         */
        resetProject: () => {
            currentProject = createEmptyProject();
            currentWarnings = []; // Clear warnings on reset
            notify();
        },

        /**
         * Gets a summary of the current project.
         * @returns {object} A summary object of the project.
         */
        getSummary: () => {
            // Ensure we use the latest normalized project for summary
            return getProjectSummary(currentProject);
        },

        /**
         * Gets any warnings generated during the last normalization or update.
         * @returns {string[]} An array of warning messages.
         */
        getWarnings: () => {
            return [...currentWarnings]; // Return a copy to prevent external modification
        },

        /**
         * Subscribes a listener function to project changes.
         * The listener will be called whenever the project data changes.
         * @param {function(): void} listener - The callback function to execute on change.
         * @returns {function(): void} A function to unsubscribe the listener.
         */
        subscribe: (listener) => {
            if (typeof listener !== 'function') {
                console.error("Listener must be a function.");
                return () => {};
            }
            listeners.add(listener);
            // Return an unsubscribe function
            return () => {
                listeners.delete(listener);
            };
        },

        /**
         * Manually triggers a notification to all listeners.
         * Useful if an external process changes project data that the store is not aware of.
         */
        notify: () => {
            notify();
        }
    };
}

/**
 * Creates a summary of the project store's current state.
 * @param {object} store - The project store object.
 * @returns {object} A summary of the project store.
 */
function getProjectStoreSummary(store) {
    if (!store || typeof store.getSummary !== 'function') {
        console.error("Invalid project store provided to getProjectStoreSummary.");
        return {
            projectId: "invalid_store",
            projectName: "Invalid Store",
            buildingName: "N/A",
            address: "N/A",
            createdAt: "N/A",
            updatedAt: "N/A",
            dataModelVersion: "unknown",
            appVersion: "unknown",
            warningsCount: 0,
            hasErrors: false, // Assuming no direct error status here, only warnings
        };
    }

    const summary = store.getSummary();
    const warnings = store.getWarnings();

    return {
        ...summary,
        warningsCount: warnings.length,
        hasErrors: warnings.some(w => w.includes('Error')) || summary.projectId === "snapshot_error", // Simple check for errors in warnings
    };
}

export {
    createProjectStore,
    createSafeProjectSnapshot,
    getProjectStoreSummary
};
