import {
    createWorkflowProject,
    runWorkflowQa,
    createWorkflowSummary,
    saveWorkflowProject,
    loadWorkflowProject,
    createWorkflowExportManifest,
    runFullWorkflowPreview,
    WORKFLOW_STATUS
} from '../workflow'; // Assuming projectWorkflowEngine is the default export or correctly aliased

// Mock the projectRepositoryPreview store for testing save/load
const mockProjectRepositoryPreview = {
    projects: {}, // In-memory store for testing
    nextProjectId: 1,

    // Mock saveProject function
    saveProject: async function(projectData) {
        if (!projectData || !projectData.id) {
            throw new Error("Project data or ID is missing for saving.");
        }
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10));
        this.projects[projectData.id] = JSON.parse(JSON.stringify(projectData)); // Deep clone
        console.log(`Mock save: Project ${projectData.id} saved.`);
    },

    // Mock loadProject function
    loadProject: async function(projectId) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10));
        const project = this.projects[projectId];
        if (!project) {
            console.log(`Mock load: Project ${projectId} not found.`);
            return null;
        }
        console.log(`Mock load: Project ${projectId} loaded.`);
        return JSON.parse(JSON.stringify(project)); // Deep clone
    },

    // Helper to clear the mock store
    clear: function() {
        this.projects = {};
        this.nextProjectId = 1;
        console.log("Mock store cleared.");
    }
};

// --- Test Suite ---
async function runSmokeTests() {
    console.log("Starting v32 Workflow Engine Smoke Tests...\n");
    let allTestsPassed = true;
    const testResults = [];

    // Helper to run a single test and report results
    const runTest = async (testName, testFn) => {
        console.log(`--- Running Test: ${testName} ---`);
        try {
            await testFn();
            console.log(`--- Test Passed: ${testName} ---\n`);
            testResults.push({ name: testName, passed: true });
        } catch (error) {
            console.error(`--- Test Failed: ${testName} ---`);
            console.error(error);
            console.error(`-----------------------------------\n`);
            allTestsPassed = false;
            testResults.push({ name: testName, passed: false, error: error.message });
        }
    };

    // --- Test Cases ---

    // Test 1: Create Workflow Project
    await runTest("Create Workflow Project", async () => {
        const newProject = createWorkflowProject({ name: "Test Project Alpha" });
        if (!newProject || !newProject.id || newProject.name !== "Test Project Alpha") {
            throw new Error("Failed to create a valid workflow project.");
        }
        console.log("Project created:", newProject.id, newProject.name);
    });

    // Test 2: QA Workflow
    await runTest("QA Workflow - Basic Checks", async () => {
        const project = createWorkflowProject({ name: "Test Project Beta" }); // Minimal project
        const qaResult = runWorkflowQa(project);

        if (qaResult.status !== WORKFLOW_STATUS.WARNING) { // Expecting warnings for missing components
             throw new Error(`Expected status WARNING, but got ${qaResult.status}`);
        }
        if (qaResult.errors.length > 0) {
            throw new Error(`Expected 0 errors, but found ${qaResult.errors.length}`);
        }
        if (qaResult.warnings.length < 3) { // Expecting warnings for FVE, CAD, LPS
            throw new Error(`Expected at least 3 warnings, but found ${qaResult.warnings.length}`);
        }
        console.log(`QA found ${qaResult.warnings.length} warnings and ${qaResult.errors.length} errors.`);
    });

     // Test 3: QA Workflow - With some data
     await runTest("QA Workflow - With FVE Data", async () => {
        const project = createWorkflowProject({ name: "Test Project Gamma" });
        project.fve = { panels: [{ id: 'p1', name: 'Panel 1' }] }; // Add minimal FVE data
        const qaResult = runWorkflowQa(project);

        if (qaResult.status !== WORKFLOW_STATUS.WARNING) { // Still expecting warnings for CAD, LPS etc.
             throw new Error(`Expected status WARNING, but got ${qaResult.status}`);
        }
        const fveWarning = qaResult.warnings.find(w => w.message.includes("Žádné FVE panely"));
        if (fveWarning) {
            throw new Error("Found unexpected FVE panel warning when data was provided.");
        }
         console.log(`QA with FVE data passed (warnings: ${qaResult.warnings.length}).`);
    });

    // Test 4: Summary Creation
    await runTest("Summary Creation", async () => {
        const project = createWorkflowProject({ name: "Test Project Delta" });
        // Add some data to influence summary, e.g., a missing required document
        project.documents = []; // Ensure no documents
        const summary = createWorkflowSummary(project);

        if (!summary) {
            throw new Error("Summary creation returned null or undefined.");
        }
        if (summary.totalErrors === 0) {
             throw new Error("Expected errors in summary (e.g., missing documents), but found none.");
        }
        if (summary.overallStatus !== WORKFLOW_STATUS.WARNING) { // Expecting at least warnings
            throw new Error(`Expected overall status WARNING, but got ${summary.overallStatus}`);
        }
        console.log("Summary created successfully:", summary);
    });

    // Test 5: Save and Load Project via Preview Repository
    await runTest("Save and Load Project", async () => {
        mockProjectRepositoryPreview.clear(); // Ensure clean state
        const originalProject = createWorkflowProject({ name: "Test Project Epsilon" });
        originalProject.workflow.status = WORKFLOW_STATUS.SUCCESS; // Manually set for test clarity

        // Save the project
        await saveWorkflowProject(mockProjectRepositoryPreview, originalProject);

        // Load the project
        const loadedProject = await loadWorkflowProject(mockProjectRepositoryPreview, originalProject.id);

        if (!loadedProject) {
            throw new Error("Failed to load the saved project.");
        }
        if (loadedProject.id !== originalProject.id) {
            throw new Error("Loaded project ID does not match original project ID.");
        }
        if (loadedProject.name !== originalProject.name) {
            throw new Error("Loaded project name does not match original project name.");
        }
        // Check if updatedAt was updated during save
        if (loadedProject.workflow.updatedAt <= originalProject.workflow.createdAt) {
             throw new Error("Project updatedAt was not updated during save.");
        }
        console.log(`Project ${originalProject.id} saved and loaded successfully.`);
    });

    // Test 6: Export Manifest Creation
    await runTest("Export Manifest Creation", async () => {
        const project = createWorkflowProject({ name: "Test Project Zeta" });
        // Add some data to make manifest more interesting
        project.fve = { panels: [{ id: 'p1' }] };
        project.cad = { layers: [{ id: 'l1' }] };
        project.documents = [{ id: 'd1', type: 'TECHNICAL_REPORT', name: 'Report 1' }];
        project.workflow.status = WORKFLOW_STATUS.SUCCESS;

        const manifest = createWorkflowExportManifest(project);

        if (!manifest) {
            throw new Error("Export manifest creation returned null or undefined.");
        }
        if (manifest.projectName !== project.name) {
            throw new Error("Manifest projectName mismatch.");
        }
        if (!manifest.generatedAt) {
            throw new Error("Manifest generatedAt timestamp is missing.");
        }
        if (!manifest.includedModules.fve) {
            throw new Error("Manifest includedModules.fve should be true.");
        }
        if (!manifest.includedModules.cad) {
             throw new Error("Manifest includedModules.cad should be true.");
        }
         if (manifest.includedModules.lps) { // LPS has no objects in this setup
             throw new Error("Manifest includedModules.lps should be false.");
         }
         if (!manifest.includedModules.documents) {
             throw new Error("Manifest includedModules.documents should be true.");
         }
        console.log("Export manifest created successfully:", manifest);
    });

    // Test 7: Run Full Workflow Preview
    await runTest("Run Full Workflow Preview", async () => {
        mockProjectRepositoryPreview.clear();
        const project = createWorkflowProject({ name: "Test Project Eta" });
        project.fve = { panels: [{ id: 'p1' }] }; // Add minimal data
        project.cad = { objects: [{ id: 'o1' }] };
        project.lps = { objects: [{ id: 'lo1' }] };
        project.documents = [documentModel.createDocumentDefinition({ id: 'd1', type: 'TECHNICAL_REPORT', name: 'Report 1' })];

        const previewResult = await runFullWorkflowPreview(mockProjectRepositoryPreview, project);

        if (!previewResult || !previewResult.project) {
            throw new Error("runFullWorkflowPreview did not return a project.");
        }
        if (previewResult.status !== WORKFLOW_STATUS.WARNING) { // Expecting warning for placeholder LPS risk
            throw new Error(`Expected status WARNING, but got ${previewResult.status}`);
        }
        if (previewResult.warnings.length < 2) { // Expect warning for LPS placeholder and maybe others
            throw new Error(`Expected at least 2 warnings, but got ${previewResult.warnings.length}`);
        }
         if (previewResult.errors.length > 0) {
            throw new Error(`Expected 0 errors, but found ${previewResult.errors.length}`);
        }

        // Check if the project was saved after preview
        const savedProject = await mockProjectRepositoryPreview.loadProject(previewResult.project.id);
        if (!savedProject) {
            throw new Error("Project was not saved after runFullWorkflowPreview.");
        }
        if (savedProject.workflow.status !== previewResult.status) {
            throw new Error("Saved project workflow status does not match preview result status.");
        }

        console.log("Full workflow preview completed successfully.");
    });

    // --- Reporting ---
    console.log("--- Smoke Test Summary ---");
    testResults.forEach(result => {
        console.log(`- ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
        if (!result.passed) {
            console.log(`  Error: ${result.error}`);
        }
    });

    if (allTestsPassed) {
        console.log("\nAll smoke tests passed!");
    } else {
        console.error("\nSome smoke tests failed.");
    }

    return allTestsPassed;
}

// Execute the tests if this script is run directly
if (require.main === module) {
    runSmokeTests().catch(error => {
        console.error("An unexpected error occurred during smoke test execution:", error);
        process.exit(1);
    });
}

// Export the function to be used by other modules if needed (though typically run directly)
module.exports = {
    runSmokeTests
};
