import { VALIDATION_STATUS } from '../validation/validationStatus.js';
import { createValidationIssue } from '../validation/basicProjectValidation.js';
import { createLocalId } from "../shared/localId.js";

// Constants for calculations
const MIN_STRING_PANELS = 1; // Minimum number of panels in a string

/**
 * Calculates the power output of a single panel in kW.
 * @param {object} panel - The panel object.
 * @param {number} panel.powerRating - The power rating of the panel in W.
 * @returns {number} The power output in kW.
 */
function calculatePanelPowerKw(panel) {
    if (!panel || typeof panel.powerRating !== 'number' || panel.powerRating < 0) {
        // Return 0 or throw an error, depending on desired strictness
        return 0;
    }
    return panel.powerRating / 1000; // Convert Watts to Kilowatts
}

/**
 * Calculates total power, panel count, and detailed string information.
 * @param {object} project - The project object.
 * @param {Array<object>} project.fve.panels - Array of panel objects.
 * @param {Array<object>} project.fve.strings - Array of string objects.
 * @param {object} panelType - Object containing panel type properties.
 * @returns {object} An object containing totalKwp, panelCount, strings, and warnings.
 */
function calculateStringTotals(project, panelType) {
    const warnings = [];
    let totalKwp = 0;
    let panelCount = 0;
    const strings = [];

    if (!project || !project.fve || !Array.isArray(project.fve.panels) || !Array.isArray(project.fve.strings)) {
        warnings.push(createValidationIssue({
            type: VALIDATION_STATUS.ERROR,
            message: "Invalid project structure for string calculation.",
            section: "fve.strings",
        }));
        return { totalKwp: 0, panelCount: 0, strings: [], warnings };
    }

    const panels = project.fve.panels;
    const stringsData = project.fve.strings;

    // Calculate panel power and total panel count
    panels.forEach(panel => {
        if (panel && panel.panelTypeRef && panelType[panel.panelTypeRef]) {
            const panelPowerKw = calculatePanelPowerKw(panelType[panel.panelTypeRef]);
            panel.calculatedPowerKw = panelPowerKw; // Attach for reference
            totalKwp += panelPowerKw;
            panelCount++;
        } else {
            warnings.push(createValidationIssue({
                type: VALIDATION_STATUS.WARNING,
                message: `Panel ${panel.id || 'unknown'} has missing or invalid panelTypeRef.`,
                section: "fve.panels",
                detail: `Panel ID: ${panel.id}, Panel Type Ref: ${panel.panelTypeRef}`,
            }));
        }
    });

    // Process each string
    stringsData.forEach(str => {
        const stringPanels = panels.filter(p => p.stringId === str.id);
        const currentString = {
            id: str.id,
            name: str.name,
            panelIds: stringPanels.map(p => p.id),
            panelCount: stringPanels.length,
            totalPowerKw: 0,
            voltage: 0, // Placeholder, needs further calculation based on panel specs and temp
            current: 0, // Placeholder, needs further calculation
        };

        if (currentString.panelCount === 0) {
            warnings.push(createValidationIssue({
                type: VALIDATION_STATUS.WARNING,
                message: `String '${str.name}' (ID: ${str.id}) has no panels assigned.`,
                section: "fve.strings",
                detail: `String ID: ${str.id}`,
            }));
        } else if (currentString.panelCount < MIN_STRING_PANELS) {
             warnings.push(createValidationIssue({
                type: VALIDATION_STATUS.WARNING,
                message: `String '${str.name}' (ID: ${str.id}) has less than the minimum required panels (${MIN_STRING_PANELS}).`,
                section: "fve.strings",
                detail: `String ID: ${str.id}, Panel Count: ${currentString.panelCount}`,
            }));
        }

        // Calculate total power for the string
        currentString.totalPowerKw = stringPanels.reduce((sum, panel) => sum + (panel.calculatedPowerKw || 0), 0);

        // Placeholder for voltage and current calculations - these depend on more factors
        // like temperature, panel electrical characteristics (Voc, Isc, Vmp, Imp), etc.
        // For now, we can use a simplified estimation or mark as unknown.

        strings.push(currentString);
    });

    return { totalKwp, panelCount, strings, warnings };
}

/**
 * Calculates overall FVE totals based on string calculations.
 * @param {object} stringCalculationResult - The result from calculateStringTotals.
 * @returns {object} An object containing totalKwp, panelCount, and strings.
 */
function calculateFveTotals(stringCalculationResult) {
    // The stringCalculationResult already contains the aggregated totals.
    // This function might be useful for future aggregations or if string totals were calculated differently.
    return {
        totalKwp: stringCalculationResult.totalKwp,
        panelCount: stringCalculationResult.panelCount,
        strings: stringCalculationResult.strings,
    };
}

/**
 * Validates the voltage characteristics of strings based on panel data.
 * NOTE: This is a simplified validation. Real-world validation requires temperature considerations (VOCc).
 * @param {object} project - The project object.
 * @param {Array<object>} project.fve.strings - Array of string objects.
 * @param {Array<object>} project.fve.panels - Array of panel objects.
 * @param {object} panelType - Object containing panel type properties.
 * @returns {Array<object>} An array of validation issues.
 */
function validateStringVoltage(project, panelType) {
    const issues = [];

    if (!project || !project.fve || !Array.isArray(project.fve.strings) || !Array.isArray(project.fve.panels)) {
        issues.push(createValidationIssue({
            type: VALIDATION_STATUS.ERROR,
            message: "Invalid project structure for voltage validation.",
            section: "fve.strings",
        }));
        return issues;
    }

    const panels = project.fve.panels;
    const stringsData = project.fve.strings;

    stringsData.forEach(str => {
        const stringPanels = panels.filter(p => p.stringId === str.id);
        if (stringPanels.length === 0) {
            // Warning already generated in calculateStringTotals, skip here or add specific voltage-related note
            return;
        }

        // Get the first panel's type to infer voltage characteristics. Assumes all panels in a string are identical.
        const firstPanel = stringPanels[0];
        const panelTypeName = firstPanel.panelTypeRef;
        const panelTypeData = panelType[panelTypeName];

        if (!panelTypeData || typeof panelTypeData.voltageOpenCircuit !== 'number') {
            issues.push(createValidationIssue({
                type: VALIDATION_STATUS.WARNING,
                message: `Panel type '${panelTypeName}' for string '${str.name}' (ID: ${str.id}) has missing voltage information.`,
                section: "fve.strings",
                detail: `String ID: ${str.id}, Panel Type: ${panelTypeName}`,
            }));
            return; // Cannot validate voltage without data
        }

        const vocPerPanel = panelTypeData.voltageOpenCircuit;
        const calculatedStringVoltage = vocPerPanel * stringPanels.length;

        // Basic sanity check: String voltage should be positive.
        if (calculatedStringVoltage <= 0) {
             issues.push(createValidationIssue({
                type: VALIDATION_STATUS.ERROR,
                message: `String '${str.name}' (ID: ${str.id}) has a non-positive calculated voltage (${calculatedStringVoltage.toFixed(2)}V). Check panel data.`,
                section: "fve.strings",
                detail: `String ID: ${str.id}, Calculated Voltage: ${calculatedStringVoltage.toFixed(2)}V`,
            }));
        }

        // Add more sophisticated voltage validation logic here if needed, e.g., against inverter limits.
        // For now, we just check if it's calculable and positive.
    });

    return issues;
}


/**
 * Creates a summary of the FVE calculation results.
 * @param {object} fveTotals - The aggregated FVE totals.
 * @param {Array<object>} stringDetails - The detailed string calculations.
 * @param {Array<object>} validationIssues - Any validation issues found.
 * @returns {object} A summary object containing key calculation results and warnings.
 */
function createFveCalculationSummary(fveTotals, stringDetails, validationIssues) {
    const summary = {
        totalKwp: fveTotals.totalKwp,
        panelCount: fveTotals.panelCount,
        numberOfStrings: stringDetails.length,
        warnings: [...validationIssues], // Combine all warnings
    };

    // Optionally, add more detailed summaries or derived metrics here
    // For example, average string power, average panels per string, etc.

    return summary;
}

export {
    calculatePanelPowerKw,
    calculateStringTotals,
    calculateFveTotals,
    validateStringVoltage,
    createFveCalculationSummary,
};


export function calculateStrings(input = {}) {
  const panels = Array.isArray(input.panels) ? input.panels : [];
  const stringSize = Math.max(1, Number(input.stringSize || input.panelsPerString || 10));
  const strings = [];

  for (let i = 0; i < panels.length; i += stringSize) {
    const group = panels.slice(i, i + stringSize);
    strings.push({
      id: createLocalId("string"),
      panels: group,
      panelCount: group.length
    });
  }

  return {
    ok: true,
    strings,
    stringCount: strings.length,
    panelCount: panels.length,
    warnings: [],
    errors: []
  };
}
