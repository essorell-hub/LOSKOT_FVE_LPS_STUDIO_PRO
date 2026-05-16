// Exporting from projectModel.js
export * from './projectModel.js';
export { DATA_MODEL_VERSION, APP_VERSION, createEmptyProject, normalizeProject, getProjectSummary, safeGetProjectSection } from './projectModel.js';

// Exporting from sampleProjectLoader.js
export * from './sampleProjectLoader.js';
export { SAMPLE_PROJECT_PATHS, getSampleProjectPath, loadSampleProjectFromObject, listKnownSampleProjects } from './sampleProjectLoader.js';

// Exporting from projectStore.js
export * from './projectStore.js';
export { createProjectStore, createSafeProjectSnapshot, getProjectStoreSummary, QA_STATUS as STORE_QA_STATUS, VALIDATION_STATUS as STORE_VALIDATION_STATUS } from './projectStore.js';

// Exporting from projectStateAdapter.js
export * from './projectStateAdapter.js';
export { createAppProjectState, QA_STATUS as ADAPTER_QA_STATUS } from './projectStateAdapter.js';

// Exporting validation modules
export * from '../validation/basicProjectValidation.js';
export * from '../validation/referenceValidation.js';
export * from '../validation/qaStatusEngine.js';
export { VALIDATION_STATUS as VALIDATION_MODULE_STATUS } from '../validation/basicProjectValidation.js'; // Assuming basicProjectValidation exports VALIDATION_STATUS
