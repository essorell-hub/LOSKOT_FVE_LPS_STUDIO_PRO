import 'core-js/stable'; // polyfill other es6 features
import 'regenerator-runtime/runtime'; // polyfill async/await

// Import modules to test
import * as data from '../../src/data/index.js';
import * as validation from '../../src/validation/index.js';
import * as importExport from '../../src/importExport/index.js';

// Helper function for safe async execution
async function runTest() {
    let exitCode = 0;
    console.log('Starting v30 data layer node runner...');

    try {
        // Test createEmptyProject
        console.log('Testing createEmptyProject...');
        const emptyProject = data.createEmptyProject();
        console.log('createEmptyProject successful.');
        // console.log('Empty Project:', JSON.stringify(emptyProject, null, 2)); // Optional: log the created project

        // Test normalizeProject
        console.log('Testing normalizeProject...');
        const normalizedProject = data.normalizeProject(emptyProject);
        console.log('normalizeProject successful.');
        // console.log('Normalized Project:', JSON.stringify(normalizedProject, null, 2)); // Optional: log normalized project

        // Test createProjectStore
        console.log('Testing createProjectStore...');
        const projectStore = data.createProjectStore(normalizedProject);
        console.log('createProjectStore successful.');
        // console.log('Project Store:', projectStore); // Optional: log the store

        // Test createAppProjectState
        console.log('Testing createAppProjectState...');
        const appProjectState = data.createAppProjectState(projectStore);
        console.log('createAppProjectState successful.');
        // console.log('App Project State:', appProjectState); // Optional: log the state

        // Test runProjectQa
        console.log('Testing runProjectQa...');
        const qaResult = validation.runProjectQa(normalizedProject);
        console.log('runProjectQa successful.');
        // console.log('QA Result:', JSON.stringify(qaResult, null, 2)); // Optional: log QA results

        // Test createImportPreviewFromObject
        console.log('Testing createImportPreviewFromObject...');
        const importPreview = importExport.jsonImportPreview.createImportPreviewFromObject(normalizedProject);
        console.log('createImportPreviewFromObject successful.');
        // console.log('Import Preview:', JSON.stringify(importPreview, null, 2)); // Optional: log import preview

        // Test createProjectExportObject
        console.log('Testing createProjectExportObject...');
        const exportObject = importExport.jsonExportProject.createProjectExportObject(normalizedProject);
        console.log('createProjectExportObject successful.');
        // console.log('Export Object:', JSON.stringify(exportObject, null, 2)); // Optional: log export object

        console.log('v30 data layer node runner finished successfully.');

    } catch (error) {
        console.error('v30 data layer node runner encountered an error:');
        console.error(error);
        exitCode = 1;
    } finally {
        process.exitCode = exitCode;
    }
}

runTest();
import 'core-js/stable'; // polyfill other es6 features
import 'regenerator-runtime/runtime'; // polyfill async/await

// Import modules to test
import * as data from '../../src/data/index.js';
import * as validation from '../../src/validation/index.js';
import * as importExport from '../../src/importExport/index.js';

// Helper function for safe async execution
async function runTest() {
    let exitCode = 0;
    console.log('Starting v30 data layer node runner...');

    try {
        // Test createEmptyProject
        console.log('Testing createEmptyProject...');
        const emptyProject = data.createEmptyProject();
        console.log('createEmptyProject successful.');
        // console.log('Empty Project:', JSON.stringify(emptyProject, null, 2)); // Optional: log the created project

        // Test normalizeProject
        console.log('Testing normalizeProject...');
        // We need to pass a project object to normalizeProject. Using the empty one created above.
        const normalizationResult = data.normalizeProject(emptyProject);
        const normalizedProject = normalizationResult.project; // Assuming normalizeProject returns { project: ..., warnings: ... }
        console.log('normalizeProject successful.');
        // console.log('Normalized Project:', JSON.stringify(normalizedProject, null, 2)); // Optional: log normalized project

        // Test createProjectStore
        console.log('Testing createProjectStore...');
        const projectStore = data.createProjectStore(normalizedProject);
        console.log('createProjectStore successful.');
        // console.log('Project Store:', projectStore); // Optional: log the store

        // Test createAppProjectState
        console.log('Testing createAppProjectState...');
        // createAppProjectState expects an initialProject, which should be the project data, not the store itself.
        const appProjectState = data.createAppProjectState(normalizedProject);
        console.log('createAppProjectState successful.');
        // console.log('App Project State:', appProjectState); // Optional: log the state

        // Test runProjectQa
        console.log('Testing runProjectQa...');
        const qaResult = validation.runProjectQa(normalizedProject);
        console.log('runProjectQa successful.');
        // console.log('QA Result:', JSON.stringify(qaResult, null, 2)); // Optional: log QA results

        // Test createImportPreviewFromObject
        console.log('Testing createImportPreviewFromObject...');
        const importPreview = importExport.jsonImportPreview.createImportPreviewFromObject(normalizedProject);
        console.log('createImportPreviewFromObject successful.');
        // console.log('Import Preview:', JSON.stringify(importPreview, null, 2)); // Optional: log import preview

        // Test createProjectExportObject
        console.log('Testing createProjectExportObject...');
        const exportObject = importExport.jsonExportProject.createProjectExportObject(normalizedProject);
        console.log('createProjectExportObject successful.');
        // console.log('Export Object:', JSON.stringify(exportObject, null, 2)); // Optional: log export object

        console.log('v30 data layer node runner finished successfully.');

    } catch (error) {
        console.error('v30 data layer node runner encountered an error:');
        console.error(error);
        exitCode = 1;
    } finally {
        process.exitCode = exitCode;
    }
}

runTest();
