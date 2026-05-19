import * as dataModule from '../../src/data/index.js';
import * as validationModule from '../../src/validation/index.js';
import * as importExportModule from '../../src/importExport/index.js';

function assertModuleLoaded(name, moduleValue) {
  if (!moduleValue || typeof moduleValue !== 'object') {
    throw new Error(name + ' module did not load as an object.');
  }
  const exportedKeys = Object.keys(moduleValue);
  if (exportedKeys.length === 0) {
    throw new Error(name + ' module has no exported members.');
  }
  return exportedKeys;
}

async function runV30DataLayerSmokeTest() {
  const dataKeys = assertModuleLoaded('data', dataModule);
  const validationKeys = assertModuleLoaded('validation', validationModule);
  const importExportKeys = assertModuleLoaded('importExport', importExportModule);

  const summary = {
    status: 'OK',
    test: 'v30_data_layer_node_runner',
    checks: {
      dataExports: dataKeys.length,
      validationExports: validationKeys.length,
      importExportExports: importExportKeys.length
    }
  };

  console.log(JSON.stringify(summary, null, 2));
}

runV30DataLayerSmokeTest().catch((error) => {
  console.error('V30 data layer smoke test failed.');
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
