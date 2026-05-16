import { lpsObjectModel, riskAssessmentPlaceholder } from '../../src/lps/index.js';

console.log("Starting LPS module smoke tests...");

// Test lpsObjectModel
try {
    console.log("Testing lpsObjectModel...");
    // Assuming lpsObjectModel has functions like createLpsObject, normalizeLpsObject, etc.
    const mockGeometry = { type: "LineString", coordinates: [[0, 0], [1, 1]] };
    const newLpsObject = lpsObjectModel.createLpsObject({
        type: "Conductor",
        name: "Test Conductor",
        geometryType: "LineString",
        geometry: mockGeometry,
        layerId: "lpsLayer1"
    });
    console.log("lpsObjectModel.createLpsObject test passed.");
    const normalizedLpsObject = lpsObjectModel.normalizeLpsObject(newLpsObject);
    console.log("lpsObjectModel.normalizeLpsObject test passed.");

} catch (error) {
    console.error("LPS lpsObjectModel test failed:", error);
}

// Test riskAssessmentPlaceholder
try {
    console.log("Testing riskAssessmentPlaceholder...");
    const riskInputDefaults = riskAssessmentPlaceholder.createRiskInputDefaults();
    console.log("riskAssessmentPlaceholder.createRiskInputDefaults test passed.");
    const estimatedLpsClass = riskAssessmentPlaceholder.estimateLpsClassPlaceholder(riskInputDefaults);
    console.log("riskAssessmentPlaceholder.estimateLpsClassPlaceholder test passed. Estimated LPS Class:", estimatedLpsClass);
    const riskAssessmentSummary = riskAssessmentPlaceholder.createRiskAssessmentSummary(riskInputDefaults, estimatedLpsClass);
    console.log("riskAssessmentPlaceholder.createRiskAssessmentSummary test passed.");
    const validationResult = riskAssessmentPlaceholder.validateRiskInput(riskInputDefaults);
    console.log("riskAssessmentPlaceholder.validateRiskInput test passed. Is Valid:", validationResult.isValid);

} catch (error) {
    console.error("LPS riskAssessmentPlaceholder test failed:", error);
}

console.log("LPS module smoke tests finished.");
