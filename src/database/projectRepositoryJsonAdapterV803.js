import { exportProjectToJsonPackageV781 } from '../export/projectJsonExportV781.js';
import { importProjectFromJsonV782 } from '../export/projectJsonImportV782.js';
import {
  PROJECT_REPOSITORY_CAPABILITIES_V801,
  createProjectRepositoryResultV801,
} from './projectRepositoryContractV801.js';

export function createProjectRepositoryJsonAdapterV803() {
  return {
    adapterName: 'projectRepositoryJsonAdapterV803',
    capabilities: [
      PROJECT_REPOSITORY_CAPABILITIES_V801.exportJson,
      PROJECT_REPOSITORY_CAPABILITIES_V801.importJson,
    ],

    exportJson(unifiedProject, options = {}) {
      const result = exportProjectToJsonPackageV781(unifiedProject, options);
      return createProjectRepositoryResultV801({
        ok: result.ok,
        data: result.package,
        errors: result.errors,
        warnings: result.warnings,
        qaFindings: result.qaFindings,
      });
    },

    importJson(jsonReadyObject) {
      const result = importProjectFromJsonV782(jsonReadyObject);
      return createProjectRepositoryResultV801({
        ok: result.ok,
        data: result.normalizedProject,
        errors: result.errors,
        warnings: result.warnings,
        qaFindings: result.qaFindings,
      });
    },
  };
}
