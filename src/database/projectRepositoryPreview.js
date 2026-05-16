import { v4 as uuidv4 } from 'uuid';

// --- Default Store ---
// Using a Map as a fallback in-memory store for preview purposes.
// In a real application, this would be replaced by a database connection (e.g., SQLite).
const projectStore = new Map();
let nextProjectId = 1;

// --- Helper Functions ---

/**
 * Creates a default project record structure.
 * @returns {object} A new, empty project record.
 */
function createEmptyProjectRecord() {
    const now = new Date();
    const timestamp = now.toISOString();
    const projectId = `preview_${nextProjectId++}`;

    return {
        id: projectId,
        name: "New Project",
        description: "",
        createdAt: timestamp,
        updatedAt: timestamp,
        // Initialize with empty structures for all main sections
        // as defined in the shared project model (v21)
        zakazka: {},
        objekt: {},
        strecha: {},
        fve: {
            panels: [],
            strings: [],
            inverters: [],
            dc_circuits: [],
        },
        lps: {
            components: [],
            // ... other LPS specific fields
        },
        spd: {
            devices: [],
            // ... other SPD specific fields
        },
        lpz: {
            zones: [],
            // ... other LPZ specific fields
        },
        cad: {
            objects: [],
            layers: [],
        },
        dokumenty: [],
        databaze: {
            // e.g., devices, materials
            devices: [],
        },
        exporty: {
            // Configuration for various export types
        },
        qa: {
            // QA status and related data
            status: "NOT_STARTED",
            issues: [],
        },
        // Add any other top-level project properties
    };
}

/**
 * Normalizes a project record for storage, ensuring consistency.
 * This is a simplified version for preview; a real implementation
 * would handle schema evolution and data validation more rigorously.
 * @param {object} projectRecord - The project record to normalize.
 * @param {boolean} [updateTimestamp=true] - Whether to update the updatedAt timestamp.
 * @returns {object} The normalized project record.
 */
function normalizeProjectRecord(projectRecord, updateTimestamp = true) {
    if (!projectRecord) return null;

    const now = new Date();
    const timestamp = updateTimestamp ? now.toISOString() : projectRecord.updatedAt || now.toISOString();

    const normalized = {
        ...projectRecord,
        id: projectRecord.id || `preview_${nextProjectId++}`, // Ensure ID exists
        name: projectRecord.name || "Unnamed Project",
        description: projectRecord.description || "",
        createdAt: projectRecord.createdAt || timestamp,
        updatedAt: timestamp,
        // Ensure all expected sections are at least empty objects/arrays
        zakazka: projectRecord.zakazka || {},
        objekt: projectRecord.objekt || {},
        strecha: projectRecord.strecha || {},
        fve: {
            panels: projectRecord.fve?.panels || [],
            strings: projectRecord.fve?.strings || [],
            inverters: projectRecord.fve?.inverters || [],
            dc_circuits: projectRecord.fve?.dc_circuits || [],
            ...projectRecord.fve, // Spread remaining fve properties
        },
        lps: {
            components: projectRecord.lps?.components || [],
            ...projectRecord.lps,
        },
        spd: {
            devices: projectRecord.spd?.devices || [],
            ...projectRecord.spd,
        },
        lpz: {
            zones: projectRecord.lpz?.zones || [],
            ...projectRecord.lpz,
        },
        cad: {
            objects: projectRecord.cad?.objects || [],
            layers: projectRecord.cad?.layers || [],
            ...projectRecord.cad,
        },
        dokumenty: projectRecord.dokumenty || [],
        databaze: {
            devices: projectRecord.databaze?.devices || [],
            ...projectRecord.databaze,
        },
        exporty: projectRecord.exporty || {},
        qa: {
            status: projectRecord.qa?.status || "NOT_STARTED",
            issues: projectRecord.qa?.issues || [],
            ...projectRecord.qa,
        },
    };

    return normalized;
}


// --- Repository Functions (Preview) ---

/**
 * Saves a project preview to the in-memory store.
 * @param {object} projectData - The project data to save.
 * @returns {Promise<object>} The saved and normalized project record.
 */
async function saveProjectPreview(projectData) {
    const normalizedProject = normalizeProjectRecord(projectData);
    projectStore.set(normalizedProject.id, normalizedProject);
    console.log(`[ProjectRepositoryPreview] Saved project: ${normalizedProject.id}`);
    return normalizedProject;
}

/**
 * Loads a project preview from the in-memory store by its ID.
 * @param {string} projectId - The ID of the project to load.
 * @returns {Promise<object|null>} The loaded project record or null if not found.
 */
async function loadProjectPreview(projectId) {
    const project = projectStore.get(projectId);
    if (project) {
        console.log(`[ProjectRepositoryPreview] Loaded project: ${projectId}`);
        return JSON.parse(JSON.stringify(project)); // Return a deep clone
    }
    console.log(`[ProjectRepositoryPreview] Project not found: ${projectId}`);
    return null;
}

/**
 * Lists all projects currently in the in-memory store.
 * @returns {Promise<Array<object>>} An array of project summary objects.
 */
async function listProjectsPreview() {
    const projects = Array.from(projectStore.values());
    // Return a simplified view for the project list
    const projectSummaries = projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    }));
    console.log(`[ProjectRepositoryPreview] Listed ${projectSummaries.length} projects.`);
    return projectSummaries;
}

/**
 * Deletes a project preview from the in-memory store by its ID.
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<boolean>} True if the project was deleted, false otherwise.
 */
async function deleteProjectPreview(projectId) {
    const deleted = projectStore.delete(projectId);
    if (deleted) {
        console.log(`[ProjectRepositoryPreview] Deleted project: ${projectId}`);
    } else {
        console.log(`[ProjectRepositoryPreview] Project not found for deletion: ${projectId}`);
    }
    return deleted;
}

/**
 * Creates a summary of the repository's current state.
 * @returns {Promise<object>} An object containing repository summary information.
 */
async function createRepositorySummary() {
    const totalProjects = projectStore.size;
    const lastUpdated = Array.from(projectStore.values()).reduce((latest, project) => {
        return latest === null || new Date(project.updatedAt) > new Date(latest) ? project.updatedAt : latest;
    }, null);

    return {
        totalProjects,
        lastUpdated: lastUpdated || "N/A",
        storageType: "InMemory (Preview)",
        // Add more summary details as needed
    };
}

// --- Exports ---
export {
    createEmptyProjectRecord,
    normalizeProjectRecord,
    saveProjectPreview,
    loadProjectPreview,
    listProjectsPreview,
    deleteProjectPreview,
    createRepositorySummary,
};
