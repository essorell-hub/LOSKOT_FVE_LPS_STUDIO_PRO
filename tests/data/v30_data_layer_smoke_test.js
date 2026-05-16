import { createEmptyProject, normalizeProject } from '../../src/data/projectModel.js';
import { validateBasicProject, VALIDATION_STATUS } from '../../src/validation/basicProjectValidation.js';
import { runProjectQa, QA_STATUS } from '../../src/validation/qaStatusEngine.js';
import { createImportPreviewFromObject } from '../../src/importExport/jsonImportPreview.js';
import { createProjectExportObject } from '../../src/importExport/jsonExportProject.js';

// Mocking necessary functions/objects if they are not directly importable or for isolation
// In this case, we assume they are importable from the specified paths.

console.log("Starting v30 data layer smoke tests...");

// Test 1: createEmptyProject
try {
    const emptyProject = createEmptyProject();
    if (emptyProject && typeof emptyProject === 'object' && !Array.isArray(emptyProject)) {
        console.log("PASS: createEmptyProject() returned a valid project object.");
    } else {
        console.error("FAIL: createEmptyProject() did not return a valid project object.");
    }
} catch (e) {
    console.error(`FAIL: createEmptyProject() threw an error: ${e.message}`);
}

// Test 2: normalizeProject
try {
    // Create a minimal project that might be missing some sections
    const incompleteProject = {
        projectId: "test-project-id",
        projectInfo: { projectName: "Test Project" },
        // Missing building, roofs, fve, lps, cad, documents, exports, qa, createdAt, updatedAt, dataModelVersion, appVersion
    };
    const normalizationResult = normalizeProject(incompleteProject);
    if (normalizationResult.ok && normalizationResult.project && Object.keys(normalizationResult.project).length > 10) { // Check if sections were added
        console.log("PASS: normalizeProject() correctly added missing sections.");
    } else {
        console.error("FAIL: normalizeProject() did not return a valid normalized project or failed to add sections.", normalizationResult);
    }
} catch (e) {
    console.error(`FAIL: normalizeProject() threw an error: ${e.message}`);
}

// Test 3: validateBasicProject
try {
    // Use a project that normalizeProject would create
    const projectForValidation = createEmptyProject();
    const basicValidationResult = validateBasicProject(projectForValidation);
    if (basicValidationResult && basicValidationResult.status !== undefined) {
        console.log(`PASS: validateBasicProject() completed with status: ${basicValidationResult.status}`);
    } else {
        console.error("FAIL: validateBasicProject() did not return a valid result object.");
    }
} catch (e) {
    console.error(`FAIL: validateBasicProject() threw an error: ${e.message}`);
}

// Test 4: runProjectQa
try {
    const projectForQa = createEmptyProject(); // Use a normalized project
    const qaResult = runProjectQa(projectForQa);
    if (qaResult && qaResult.status !== undefined) {
        console.log(`PASS: runProjectQa() completed with status: ${qaResult.status}`);
    } else {
        console.error("FAIL: runProjectQa() did not return a valid result object.");
    }
} catch (e) {
    console.error(`FAIL: runProjectQa() threw an error: ${e.message}`);
}

// Test 5: createImportPreviewFromObject
try {
    const sampleProject = createEmptyProject(); // Use a valid project structure
    const importPreviewResult = createImportPreviewFromObject(sampleProject);
    if (importPreviewResult && importPreviewResult.ok !== undefined && importPreviewResult.projectPreview !== null) {
        console.log("PASS: createImportPreviewFromObject() completed successfully.");
    } else {
        console.error("FAIL: createImportPreviewFromObject() did not return a valid result object.", importPreviewResult);
    }
} catch (e) {
    console.error(`FAIL: createImportPreviewFromObject() threw an error: ${e.message}`);
}

// Test 6: createProjectExportObject
try {
    const sampleProject = createEmptyProject(); // Use a valid project structure
    const exportResult = createProjectExportObject(sampleProject);
    if (exportResult && exportResult.ok && exportResult.project && exportResult.qa && exportResult.manifest) {
        console.log("PASS: createProjectExportObject() completed successfully.");
    } else {
        console.error("FAIL: createProjectExportObject() did not return a valid result object.", exportResult);
    }
} catch (e) {
    console.error(`FAIL: createProjectExportObject() threw an error: ${e.message}`);
}

console.log("Finished v30 data layer smoke tests.");
