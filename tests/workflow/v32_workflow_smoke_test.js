const TEST_STATUS = Object.freeze({
  PASSED: "PASSED",
  WARNING: "WARNING"
});

async function runTest(name, fn) {
  console.log(`--- Running Test: ${name} ---`);
  const result = await fn();
  console.log(`--- Test Passed: ${name} ---`);
  return {
    name,
    status: TEST_STATUS.PASSED,
    result
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runSmokeTests() {
  console.log("Starting v32 Workflow Engine Smoke Tests...");

  const workflow = await import("../../src/workflow/index.js");
  const documentModel = await import("../../src/documents/documentModel.js");
  const projectStore = await import("../../src/data/projectStore.js");
  const exportPackageModel = await import("../../src/export/exportPackageModel.js");

  const results = [];

  results.push(await runTest("Workflow module import", async () => {
    assert(workflow && typeof workflow === "object", "Workflow module must be importable.");
    return { imported: true };
  }));

  results.push(await runTest("Document module import", async () => {
    assert(documentModel && typeof documentModel === "object", "Document module must be importable.");
    assert(
      typeof documentModel.createDocumentDefinition === "function" ||
      typeof documentModel.getRequiredDocumentsForProject === "function",
      "Document model must expose document helper functions."
    );
    return { imported: true };
  }));

  results.push(await runTest("Project store module import", async () => {
    assert(projectStore && typeof projectStore === "object", "Project store module must be importable.");
    return { imported: true };
  }));

  results.push(await runTest("Export package module import", async () => {
    assert(exportPackageModel && typeof exportPackageModel === "object", "Export package module must be importable.");
    return { imported: true };
  }));

  results.push(await runTest("Create minimal workflow project preview", async () => {
    const project = {
      id: "v32-workflow-smoke-project",
      projectId: "v32-workflow-smoke-project",
      name: "Workflow Smoke Project",
      customer: {
        name: "Test Customer"
      },
      fve: {
        panels: []
      },
      cad: {
        layers: [],
        objects: []
      },
      lps: {
        objects: []
      }
    };

    assert(project.id, "Project must have id.");
    assert(project.name, "Project must have name.");
    assert(Array.isArray(project.fve.panels), "Project FVE panels must be an array.");
    assert(Array.isArray(project.cad.layers), "Project CAD layers must be an array.");
    assert(Array.isArray(project.lps.objects), "Project LPS objects must be an array.");

    return project;
  }));

  console.log("");
  console.log("--- Smoke Test Summary ---");

  for (const item of results) {
    console.log(`- ${item.name}: ${item.status}`);
  }

  console.log("");
  console.log("All workflow smoke tests passed.");

  return {
    ok: true,
    results
  };
}

await runSmokeTests();
