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
    // Create a deep clone to ensure we don't modify the original object passed into the function
    // and to preserve original fields that might not be in the current schema.
    const originalProjectClone = JSON.parse(JSON.stringify(project || {}));
    const now = new Date();
    const timestamp = now.toISOString();

    // Ensure the project object itself is at least an empty object if null/undefined
    const workingProject = project || {};

    // Update timestamp
    workingProject.updatedAt = timestamp;

    // Ensure essential top-level sections exist, adding them with fallbacks if missing.
    const requiredTopLevelSections = [
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

    requiredTopLevelSections.forEach(({ name, fallback }) => {
        if (workingProject[name] === undefined || workingProject[name] === null) {
            workingProject[name] = fallback;
            // Only warn if the fallback is different from what might have been in the original clone
            if (originalProjectClone[name] !== fallback) {
                warnings.push(`Missing top-level section '${name}', added with fallback value.`);
            }
        }
    });

    // Merge the potentially modified workingProject back into a clone of the original.
    // This ensures that any fields present in the original project but not explicitly handled
    // here are preserved. The workingProject values take precedence if they were added/modified.
    const normalized = { ...originalProjectClone, ...workingProject };

    // If there were issues (warnings), return them. Otherwise, return empty.
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
    // Use hasOwnProperty for a more robust check against prototype properties
    if (Object.prototype.hasOwnProperty.call(project, sectionName)) {
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
