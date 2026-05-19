import { createDocumentsExportFunctionalDesignCoreV381, validateDocumentsExportFunctionalDesignCoreV381 } from '../../src/runtime/documentsExportFunctionalDesignCoreV381.js';
import { createDocumentsExportFunctionalTemplateResolverV382, validateDocumentsExportFunctionalTemplateResolverV382 } from '../../src/runtime/documentsExportFunctionalTemplateResolverV382.js';
import { createDocumentsExportFunctionalTechnicalReportComposerV383, validateDocumentsExportFunctionalTechnicalReportComposerV383 } from '../../src/runtime/documentsExportFunctionalTechnicalReportComposerV383.js';
import { createDocumentsExportFunctionalBomComposerV384, validateDocumentsExportFunctionalBomComposerV384 } from '../../src/runtime/documentsExportFunctionalBomComposerV384.js';
import { createDocumentsExportFunctionalDeviceListComposerV385, validateDocumentsExportFunctionalDeviceListComposerV385 } from '../../src/runtime/documentsExportFunctionalDeviceListComposerV385.js';
import { createDocumentsExportFunctionalSchemaExportComposerV386, validateDocumentsExportFunctionalSchemaExportComposerV386 } from '../../src/runtime/documentsExportFunctionalSchemaExportComposerV386.js';
import { createDocumentsExportFunctionalQaReportComposerV387, validateDocumentsExportFunctionalQaReportComposerV387 } from '../../src/runtime/documentsExportFunctionalQaReportComposerV387.js';
import { createDocumentsExportFunctionalPdfPackagePlannerV388, validateDocumentsExportFunctionalPdfPackagePlannerV388 } from '../../src/runtime/documentsExportFunctionalPdfPackagePlannerV388.js';
import { createDocumentsExportFunctionalDocxPackagePlannerV389, validateDocumentsExportFunctionalDocxPackagePlannerV389 } from '../../src/runtime/documentsExportFunctionalDocxPackagePlannerV389.js';
import { createDocumentsExportFunctionalJsonExportPlannerV390, validateDocumentsExportFunctionalJsonExportPlannerV390 } from '../../src/runtime/documentsExportFunctionalJsonExportPlannerV390.js';
import { createDocumentsExportFunctionalRevisionTrackerV391, validateDocumentsExportFunctionalRevisionTrackerV391 } from '../../src/runtime/documentsExportFunctionalRevisionTrackerV391.js';
import { createDocumentsExportFunctionalFqMappingValidatorV392, validateDocumentsExportFunctionalFqMappingValidatorV392 } from '../../src/runtime/documentsExportFunctionalFqMappingValidatorV392.js';
import { createDocumentsExportFunctionalSchemaCrossCheckerV393, validateDocumentsExportFunctionalSchemaCrossCheckerV393 } from '../../src/runtime/documentsExportFunctionalSchemaCrossCheckerV393.js';
import { createDocumentsExportFunctionalHandoffPackagePlannerV394, validateDocumentsExportFunctionalHandoffPackagePlannerV394 } from '../../src/runtime/documentsExportFunctionalHandoffPackagePlannerV394.js';
import { createDocumentsExportFunctionalPrintSetPlannerV395, validateDocumentsExportFunctionalPrintSetPlannerV395 } from '../../src/runtime/documentsExportFunctionalPrintSetPlannerV395.js';
import { createDocumentsExportFunctionalArchivePlannerV396, validateDocumentsExportFunctionalArchivePlannerV396 } from '../../src/runtime/documentsExportFunctionalArchivePlannerV396.js';
import { createDocumentsExportFunctionalExportAdapterV397, validateDocumentsExportFunctionalExportAdapterV397 } from '../../src/runtime/documentsExportFunctionalExportAdapterV397.js';
import { createDocumentsExportFunctionalReleaseGateV398, validateDocumentsExportFunctionalReleaseGateV398 } from '../../src/runtime/documentsExportFunctionalReleaseGateV398.js';
import { createDocumentsExportFunctionalDeepAuditV399, validateDocumentsExportFunctionalDeepAuditV399 } from '../../src/runtime/documentsExportFunctionalDeepAuditV399.js';
import { createDocumentsExportFunctionalMilestoneV400, validateDocumentsExportFunctionalMilestoneV400 } from '../../src/runtime/documentsExportFunctionalMilestoneV400.js';
import assert from 'node:assert/strict';

console.log('Starting V381-V400 functional deep audit test...');

const routeKeys = ['dashboard','fve-2d-layout','lps-lightning-protection','spd','documents','reports-statements','database','exports','settings'];
const allResults = [];
for (const routeKey of routeKeys) {
  const project = { id: 'V381-V400-' + routeKey, name: 'documents export functional core', revision: 'deep-audit' };
  const results = [];
    {
      const model = createDocumentsExportFunctionalDesignCoreV381({ routeKey, project });
      const validation = validateDocumentsExportFunctionalDesignCoreV381(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalTemplateResolverV382({ routeKey, project });
      const validation = validateDocumentsExportFunctionalTemplateResolverV382(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalTechnicalReportComposerV383({ routeKey, project });
      const validation = validateDocumentsExportFunctionalTechnicalReportComposerV383(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalBomComposerV384({ routeKey, project });
      const validation = validateDocumentsExportFunctionalBomComposerV384(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalDeviceListComposerV385({ routeKey, project });
      const validation = validateDocumentsExportFunctionalDeviceListComposerV385(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalSchemaExportComposerV386({ routeKey, project });
      const validation = validateDocumentsExportFunctionalSchemaExportComposerV386(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalQaReportComposerV387({ routeKey, project });
      const validation = validateDocumentsExportFunctionalQaReportComposerV387(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalPdfPackagePlannerV388({ routeKey, project });
      const validation = validateDocumentsExportFunctionalPdfPackagePlannerV388(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalDocxPackagePlannerV389({ routeKey, project });
      const validation = validateDocumentsExportFunctionalDocxPackagePlannerV389(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalJsonExportPlannerV390({ routeKey, project });
      const validation = validateDocumentsExportFunctionalJsonExportPlannerV390(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalRevisionTrackerV391({ routeKey, project });
      const validation = validateDocumentsExportFunctionalRevisionTrackerV391(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalFqMappingValidatorV392({ routeKey, project });
      const validation = validateDocumentsExportFunctionalFqMappingValidatorV392(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalSchemaCrossCheckerV393({ routeKey, project });
      const validation = validateDocumentsExportFunctionalSchemaCrossCheckerV393(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalHandoffPackagePlannerV394({ routeKey, project });
      const validation = validateDocumentsExportFunctionalHandoffPackagePlannerV394(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalPrintSetPlannerV395({ routeKey, project });
      const validation = validateDocumentsExportFunctionalPrintSetPlannerV395(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalArchivePlannerV396({ routeKey, project });
      const validation = validateDocumentsExportFunctionalArchivePlannerV396(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalExportAdapterV397({ routeKey, project });
      const validation = validateDocumentsExportFunctionalExportAdapterV397(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalReleaseGateV398({ routeKey, project });
      const validation = validateDocumentsExportFunctionalReleaseGateV398(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalDeepAuditV399({ routeKey, project });
      const validation = validateDocumentsExportFunctionalDeepAuditV399(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
    {
      const model = createDocumentsExportFunctionalMilestoneV400({ routeKey, project });
      const validation = validateDocumentsExportFunctionalMilestoneV400(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      assert.equal(model.functionalOutputs.qaReady, true);
      assert.equal(model.functionalOutputs.exportReady, true);
      results.push(validation);
    }
  allResults.push({ routeKey, results });
}
const finalResult = allResults.at(-1).results.at(-1);
assert.equal(finalResult.ok, true);
assert.equal(finalResult.phaseId, 'V381-V400');
assert.equal(finalResult.runtimeStep, 400);
console.log('V381-V400 functional deep audit test passed:', JSON.stringify({
  phaseId: 'V381-V400',
  routeCount: routeKeys.length,
  checkedModels: allResults.reduce((sum, item) => sum + item.results.length, 0),
  finalResult
}, null, 2));
