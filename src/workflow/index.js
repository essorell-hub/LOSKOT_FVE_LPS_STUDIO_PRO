import * as projectWorkflowEngine from './projectWorkflowEngine';

// Export the public API of the workflow engine
export const {
    normalizeWorkflowProject,
    createWorkflowProject,
    runWorkflowQa,
    createWorkflowSummary,
    saveWorkflowProject,
    loadWorkflowProject,
    createWorkflowExportManifest,
    runFullWorkflowPreview,
} = projectWorkflowEngine;

// Export constants
export const WORKFLOW_STATUS = projectWorkflowEngine.WORKFLOW_STATUS;
