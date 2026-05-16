import { v4 as uuidv4 } from 'uuid';

const DATA_MODEL_VERSION = "v29";
const APP_VERSION = "v30"; // Assuming this is the current app version based on the prompt context

function createEmptyProject() {
    const now = new Date();
    const timestamp = now.toISOString();

    return {
        projectId: uuidv4(),
        dataModelVersion: DATA_MODEL_VERSION,
        appVersion: APP_VERSION,
        createdAt: timestamp,
        updatedAt: timestamp,
        projectInfo: {},
        building: {},
        roofs: [],
        fve: {},
        lps: {},
        cad: {},
        documents: [],
        exports: [],
        qa: {},
        migrationHistory: []
    };
}

function normalizeProject(project) {
    const warnings = [];
    const originalProject = JSON.parse(JSON.stringify(project)); // Deep clone to preserve original data
    const now = new Date();
    const timestamp = now.toISOString();

    // Ensure project has a structure, provide fallback if null/undefined
    project = project || {};

    // Add or update updatedAt timestamp
    project.updatedAt = timestamp;

    // Add missing top-level sections with fallbacks
    const requiredSections = [
        { name: "projectId", fallback: uuidv4() },
        { name: "dataModelVersion", fallback: DATA_MODEL_VERSION },
        { name: "appVersion", fallback: APP_VERSION },
        { name: "createdAt", fallback: timestamp },
        { name: "projectInfo", fallback: {} },
        { name: "building", fallback: {} },
        { name: "roofs", fallback: [] },
        { name: "fve", fallback: {} },
        { name: "lps", fallback: {} },
        { name: "cad", fallback: {} },
        { name: "documents", fallback: [] },
        { name: "exports", fallback: [] },
        { name: "qa", fallback: {} },
        { name: "migrationHistory", fallback: [] }
    ];

    requiredSections.forEach(({ name, fallback }) => {
        if (project[name] === undefined || project[name] === null) {
            project[name] = fallback;
            warnings.push(`Missing section '${name}', added with fallback value.`);
        }
    });

    // Preserve unknown fields by making a deep copy of the original project and then merging
    // This ensures that any fields not explicitly handled here are kept.
    const normalized = { ...originalProject, ...project };

    // Ensure nested arrays/objects are also handled if they were missing and are now added
    // Example: if 'roofs' was missing and added as [], ensure its elements are processed if any exist in originalProject
    // This is a simplified approach; a more robust solution might recursively normalize nested structures.

    if (warnings.length > 0) {
        return { ok: true, project: normalized, warnings: warnings };
    } else {
        return { ok: true, project: normalized, warnings: [] };
    }
}


function getProjectSummary(project) {
    if (!project) {
        return {
            projectId: "N/A",
            projectName: "N/A",
            buildingName: "N/A",
            address: "N/A",
            createdAt: "N/A",
            updatedAt: "N/A",
            dataModelVersion: DATA_MODEL_VERSION,
            appVersion: APP_VERSION,
        };
    }

    const projectInfo = project.projectInfo || {};
    const building = project.building || {};

    return {
        projectId: project.projectId || "N/A",
        projectName: projectInfo.projectName || "N/A",
        buildingName: building.name || "N/A",
        address: projectInfo.address || "N/A",
        createdAt: project.createdAt || "N/A",
        updatedAt: project.updatedAt || "N/A",
        dataModelVersion: project.dataModelVersion || DATA_MODEL_VERSION,
        appVersion: project.appVersion || APP_VERSION,
    };
}

function safeGetProjectSection(project, sectionName, fallbackValue) {
    if (!project || typeof project !== 'object') {
        return fallbackValue;
    }
    if (project.hasOwnProperty(sectionName)) {
        return project[sectionName];
    }
    return fallbackValue;
}

export {
    DATA_MODEL_VERSION,
    createEmptyProject,
    normalizeProject,
    getProjectSummary,
    safeGetProjectSection
};
