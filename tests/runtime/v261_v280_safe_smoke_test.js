import { createProjectRuntimeCoreV261, validateProjectRuntimeCoreV261 } from '../../src/runtime/projectRuntimeCoreV261.js';
import { createProjectRuntimeDataContractV262, validateProjectRuntimeDataContractV262 } from '../../src/runtime/projectRuntimeDataContractV262.js';
import { createProjectRuntimeValidationMatrixV263, validateProjectRuntimeValidationMatrixV263 } from '../../src/runtime/projectRuntimeValidationMatrixV263.js';
import { createProjectRuntimeJobModelV264, validateProjectRuntimeJobModelV264 } from '../../src/runtime/projectRuntimeJobModelV264.js';
import { createProjectRuntimeSiteModelV265, validateProjectRuntimeSiteModelV265 } from '../../src/runtime/projectRuntimeSiteModelV265.js';
import { createProjectRuntimeRoofModelV266, validateProjectRuntimeRoofModelV266 } from '../../src/runtime/projectRuntimeRoofModelV266.js';
import { createProjectRuntimeElectricalModelV267, validateProjectRuntimeElectricalModelV267 } from '../../src/runtime/projectRuntimeElectricalModelV267.js';
import { createProjectRuntimeLpsModelV268, validateProjectRuntimeLpsModelV268 } from '../../src/runtime/projectRuntimeLpsModelV268.js';
import { createProjectRuntimeSpdModelV269, validateProjectRuntimeSpdModelV269 } from '../../src/runtime/projectRuntimeSpdModelV269.js';
import { createProjectRuntimeGroundingModelV270, validateProjectRuntimeGroundingModelV270 } from '../../src/runtime/projectRuntimeGroundingModelV270.js';
import { createProjectRuntimeDocumentModelV271, validateProjectRuntimeDocumentModelV271 } from '../../src/runtime/projectRuntimeDocumentModelV271.js';
import { createProjectRuntimeExportModelV272, validateProjectRuntimeExportModelV272 } from '../../src/runtime/projectRuntimeExportModelV272.js';
import { createProjectRuntimeQaModelV273, validateProjectRuntimeQaModelV273 } from '../../src/runtime/projectRuntimeQaModelV273.js';
import { createProjectRuntimeWorkflowModelV274, validateProjectRuntimeWorkflowModelV274 } from '../../src/runtime/projectRuntimeWorkflowModelV274.js';
import { createProjectRuntimeSnapshotModelV275, validateProjectRuntimeSnapshotModelV275 } from '../../src/runtime/projectRuntimeSnapshotModelV275.js';
import { createProjectRuntimePersistencePlanV276, validateProjectRuntimePersistencePlanV276 } from '../../src/runtime/projectRuntimePersistencePlanV276.js';
import { createProjectRuntimeRepositoryBridgeV277, validateProjectRuntimeRepositoryBridgeV277 } from '../../src/runtime/projectRuntimeRepositoryBridgeV277.js';
import { createProjectRuntimeReleaseGateV278, validateProjectRuntimeReleaseGateV278 } from '../../src/runtime/projectRuntimeReleaseGateV278.js';
import { createProjectRuntimeDeepAuditV279, validateProjectRuntimeDeepAuditV279 } from '../../src/runtime/projectRuntimeDeepAuditV279.js';
import { createProjectRuntimeMilestoneV280, validateProjectRuntimeMilestoneV280 } from '../../src/runtime/projectRuntimeMilestoneV280.js';
import assert from 'node:assert/strict';

console.log('Starting V261-V280 smoke test...');

const routeKeys = ['dashboard'];
const allResults = [];
for (const activeRouteKey of routeKeys) {
  const projectContext = { projectId: 'V261-V280-' + activeRouteKey, projectName: 'project runtime core', revision: 'smoke' };
  const results = [];
    {
      const model = createProjectRuntimeCoreV261({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeCoreV261(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeDataContractV262({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeDataContractV262(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeValidationMatrixV263({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeValidationMatrixV263(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeJobModelV264({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeJobModelV264(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeSiteModelV265({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeSiteModelV265(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeRoofModelV266({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeRoofModelV266(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeElectricalModelV267({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeElectricalModelV267(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeLpsModelV268({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeLpsModelV268(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeSpdModelV269({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeSpdModelV269(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeGroundingModelV270({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeGroundingModelV270(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeDocumentModelV271({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeDocumentModelV271(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeExportModelV272({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeExportModelV272(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeQaModelV273({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeQaModelV273(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeWorkflowModelV274({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeWorkflowModelV274(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeSnapshotModelV275({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeSnapshotModelV275(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimePersistencePlanV276({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimePersistencePlanV276(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeRepositoryBridgeV277({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeRepositoryBridgeV277(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeReleaseGateV278({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeReleaseGateV278(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeDeepAuditV279({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeDeepAuditV279(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
    {
      const model = createProjectRuntimeMilestoneV280({ activeRouteKey, projectContext });
      const validation = validateProjectRuntimeMilestoneV280(model);
      assert.equal(validation.ok, true);
      assert.equal(model.controls.canWriteUi, false);
      assert.equal(model.controls.canMutateVisuals, false);
      assert.equal(model.controls.canPush, false);
      assert.equal(model.controls.canMerge, false);
      assert.equal(model.controls.canChangePackage, false);
      results.push(validation);
    }
  allResults.push({ activeRouteKey, results });
}

const finalResult = allResults.at(-1).results.at(-1);
assert.equal(finalResult.ok, true);
assert.equal(finalResult.phaseId, 'V261-V280');
assert.equal(finalResult.runtimeStep, 280);

console.log('V261-V280 smoke test passed:', JSON.stringify({
  phaseId: 'V261-V280',
  routeCount: routeKeys.length,
  checkedModels: allResults.reduce((sum, item) => sum + item.results.length, 0),
  finalResult
}, null, 2));
