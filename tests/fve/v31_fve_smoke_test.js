import { panelSelectionModel, stringCalculator } from '../../src/fve/index.js';

// Mocking external dependencies if any are used by the imported modules
// For example, if panelSelectionModel used uuidv4, we'd mock it here.

console.log("Starting FVE module smoke tests...");

// Test panelSelectionModel
try {
    console.log("Testing panelSelectionModel...");
    const initialState = panelSelectionModel.clearPanelSelection({});
    console.log("panelSelectionModel.clearPanelSelection test passed.");
    // Add more tests for other functions in panelSelectionModel if they exist and are exported
    // e.g., panelSelectionModel.selectPanel({...}, 'panel1');
} catch (error) {
    console.error("FVE panelSelectionModel test failed:", error);
}

// Test stringCalculator
try {
    console.log("Testing stringCalculator...");
    const result = stringCalculator.calculateStrings([{ panelCount: 10, panelConfig: {} }]); // Assuming calculateStrings takes an array of configurations
    console.log("stringCalculator.calculateStrings test passed with result:", result);
    // Add more tests for other functions in stringCalculator
} catch (error) {
    console.error("FVE stringCalculator test failed:", error);
}

console.log("FVE module smoke tests finished.");
