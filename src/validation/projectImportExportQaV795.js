import { exportProjectToJsonPackageV781 } from '../export/projectJsonExportV781.js';
import { importProjectFromJsonV782 } from '../export/projectJsonImportV782.js';

export function runProjectImportExportQaV795(unifiedProject = {}, options = {}) {
  const exportResult = exportProjectToJsonPackageV781(unifiedProject, options);
  const importResult = importProjectFromJsonV782(exportResult.package);
  const qaFindings = [...exportResult.qaFindings, ...importResult.qaFindings];

  return {
    ok: exportResult.ok && importResult.ok,
    exportResult,
    importResult,
    qaFindings,
    errors: qaFindings.filter((finding) => finding.severity === 'BLOCKER'),
    warnings: qaFindings.filter((finding) => finding.severity !== 'BLOCKER'),
  };
}
