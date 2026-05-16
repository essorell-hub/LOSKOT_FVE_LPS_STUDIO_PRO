// Constants for validation status
const VALIDATION_STATUS = {
    OK: "OK",
    ERROR: "ERROR",
    WARNING: "WARNING",
    INFO: "INFO",
};

// Helper to create a validation issue object
function createValidationIssue(input) {
    const { type, message, section, detail } = input;
    const now = new Date();
    const timestamp = now.toISOString();

    return {
        type: type || VALIDATION_STATUS.INFO, // Default to INFO if not specified
        message: message || "No specific message provided.",
        section: section || "general", // Default to 'general' section
        detail: detail || null,
        timestamp: timestamp,
    };
}

// Validate required top-level sections of the project
function validateRequiredSections(project) {
    const issues = [];
    const requiredSections = [
        "building",
        "roofs",
        "fve",
        "lps",
        "cad",
        "documents",
        "exports",
        "qa",
    ];

    if (!project) {
        issues.push(createValidationIssue({
            type: VALIDATION_STATUS.ERROR,
            message: "Project is null or undefined.",
            section: "project",
        }));
        return issues; // Stop further checks if project itself is missing
    }

    requiredSections.forEach(sectionName => {
        if (!project.hasOwnProperty(sectionName) || project[sectionName] === null || project[sectionName] === undefined) {
            issues.push(createValidationIssue({
                type: VALIDATION_STATUS.ERROR,
                message: `Required section '${sectionName}' is missing or empty.`,
                section: sectionName,
            }));
        }
    });

    return issues;
}

// Validate the dataModelVersion
function validateDataModelVersion(project) {
    const issues = [];
    if (!project || !project.dataModelVersion) {
        issues.push(createValidationIssue({
            type: VALIDATION_STATUS.ERROR,
            message: "Project's dataModelVersion is missing.",
            section: "projectInfo",
        }));
        return issues;
    }

    // Add more sophisticated version checks here if needed in the future
    // For now, just check if it exists and is a string.
    if (typeof project.dataModelVersion !== 'string' || project.dataModelVersion.trim() === '') {
         issues.push(createValidationIssue({
            type: VALIDATION_STATUS.WARNING,
            message: `Project's dataModelVersion ('${project.dataModelVersion}') might be invalid or in an unexpected format.`,
            section: "projectInfo",
        }));
    }

    return issues;
}

// Validate project information like projectId, projectName, etc.
function validateProjectInfo(project) {
    const issues = [];
    if (!project) return issues; // Already handled in validateRequiredSections, but good for safety

    const projectInfo = project.projectInfo || {}; // Use fallback if projectInfo is missing

    if (!projectInfo.projectId) {
        issues.push(createValidationIssue({
            type: VALIDATION_STATUS.ERROR,
            message: "Project ID is missing.",
            section: "projectInfo",
        }));
    }
    if (!projectInfo.projectName) {
        issues.push(createValidationIssue({
            type: VALIDATION_STATUS.WARNING,
            message: "Project name is missing.",
            section: "projectInfo",
        }));
    }
    if (!projectInfo.buildingName && project.building && project.building.name) {
         // If projectInfo.buildingName is missing but building.name exists, create a warning/info
         issues.push(createValidationIssue({
            type: VALIDATION_STATUS.INFO,
            message: `Building name found in 'building.name' but not in 'projectInfo.buildingName'. Consider consolidating.`,
            section: "projectInfo",
            detail: {
                projectInfoBuildingName: projectInfo.buildingName,
                buildingName: project.building.name
            }
        }));
    }
     if (!projectInfo.address) {
        issues.push(createValidationIssue({
            type: VALIDATION_STATUS.WARNING,
            message: "Project address is missing.",
            section: "projectInfo",
        }));
    }

    return issues;
}

// Main function to validate the basic structure of a project
function validateBasicProject(project) {
    let ok = true;
    const errors = [];
    const warnings = [];
    const info = [];
    const summary = []; // For a high-level summary

    // Initial check for project object itself
    if (!project) {
        errors.push(createValidationIssue({
            type: VALIDATION_STATUS.ERROR,
            message: "Project data is null or undefined. Cannot perform validation.",
            section: "project",
        }));
        ok = false;
        // Return early if project is fundamentally missing
        return { ok, status: VALIDATION_STATUS.ERROR, errors, warnings, info, summary };
    }

    // Check Data Model Version first, as it dictates other validations
    const dmvIssues = validateDataModelVersion(project);
    dmvIssues.forEach(issue => {
        if (issue.type === VALIDATION_STATUS.ERROR) {
            errors.push(issue);
            ok = false;
        } else if (issue.type === VALIDATION_STATUS.WARNING) {
            warnings.push(issue);
        } else {
            info.push(issue);
        }
    });
    summary.push(`Data Model Version validation: ${dmvIssues.length > 0 ? errors.length > 0 ? VALIDATION_STATUS.ERROR : warnings.length > 0 ? VALIDATION_STATUS.WARNING : VALIDATION_STATUS.OK : 'Skipped'}`);

    // Check Project Info
    const piIssues = validateProjectInfo(project);
     piIssues.forEach(issue => {
        if (issue.type === VALIDATION_STATUS.ERROR) {
            errors.push(issue);
            ok = false;
        } else if (issue.type === VALIDATION_STATUS.WARNING) {
            warnings.push(issue);
        } else {
            info.push(issue);
        }
    });
    summary.push(`Project Info validation: ${piIssues.length > 0 ? errors.length > 0 ? VALIDATION_STATUS.ERROR : warnings.length > 0 ? VALIDATION_STATUS.WARNING : VALIDATION_STATUS.OK : 'Skipped'}`);

    // Check Required Sections
    const rsIssues = validateRequiredSections(project);
     rsIssues.forEach(issue => {
        if (issue.type === VALIDATION_STATUS.ERROR) {
            errors.push(issue);
            ok = false;
        } else if (issue.type === VALIDATION_STATUS.WARNING) {
            warnings.push(issue);
        } else {
            info.push(issue);
        }
    });
    summary.push(`Required Sections validation: ${rsIssues.length > 0 ? errors.length > 0 ? VALIDATION_STATUS.ERROR : warnings.length > 0 ? VALIDATION_STATUS.WARNING : VALIDATION_STATUS.OK : 'Skipped'}`);

    // If fundamental checks pass, proceed with more detailed checks if needed in the future.
    // For this basic validation, the above checks cover the requirements.

    // Determine overall status
    let overallStatus = VALIDATION_STATUS.OK;
    if (errors.length > 0) {
        overallStatus = VALIDATION_STATUS.ERROR;
    } else if (warnings.length > 0) {
        overallStatus = VALIDATION_STATUS.WARNING;
    } else if (info.length > 0) {
        overallStatus = VALIDATION_STATUS.INFO;
    }

    // Construct the final result object
    const result = {
        ok: ok, // Overall success flag
        status: overallStatus, // The highest severity status found
        errors: errors,
        warnings: warnings,
        info: info,
        summary: summary.join('; ') // Join summary points into a single string
    };

    return result;
}

// Export constants and functions
export {
    VALIDATION_STATUS,
    createValidationIssue,
    validateRequiredSections,
    validateDataModelVersion,
    validateProjectInfo,
    validateBasicProject,
};
