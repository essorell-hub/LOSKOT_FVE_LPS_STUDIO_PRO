import { v4 as uuidv4 } from 'uuid';
import { VALIDATION_STATUS } from './basicProjectValidation'; // Assuming VALIDATION_STATUS is exported from basicProjectValidation

// Helper to safely get a section from the project
function safeGetProjectSection(project, sectionName, fallbackValue) {
    if (!project || typeof project !== 'object') {
        return fallbackValue;
    }
    if (project.hasOwnProperty(sectionName)) {
        return project[sectionName];
    }
    return fallbackValue;
}

// Helper to create a validation issue object
function createValidationIssue(input) {
    const { type, message, section, detail } = input;
    const now = new Date();
    const timestamp = now.toISOString();

    return {
        type: type || VALIDATION_STATUS.INFO, // Default to INFO if not specified
        message: message || "No specific message provided.",
        section: section || "general", // Default to 'general' section
        detail: detail || null,
        timestamp: timestamp,
    };
}

// Collects all entity IDs from various sections of the project
function collectEntityIds(project) {
    const ids = {
        strings: new Set(),
        inverters: new Set(),
        panels: new Set(),
        layers: new Set(),
        cadObjects: new Set(),
        qaRelatedEntities: new Set(),
        // Add other entity types as needed
    };

    // Collect from 'fve' section (panels and strings)
    const fveData = safeGetProjectSection(project, 'fve', {});
    if (fveData.panels) {
        fveData.panels.forEach(panel => {
            if (panel.panelId) ids.panels.add(panel.panelId);
            if (panel.stringId) ids.strings.add(panel.stringId);
        });
    }
    if (fveData.strings) {
        fveData.strings.forEach(str => {
            if (str.stringId) ids.strings.add(str.stringId);
            if (str.inverterId) ids.inverters.add(str.inverterId);
        });
    }

    // Collect from 'cad' section
    const cadData = safeGetProjectSection(project, 'cad', {});
    if (cadData.layers) {
        cadData.layers.forEach(layer => {
            if (layer.layerId) ids.layers.add(layer.layerId);
        });
    }
    if (cadData.objects) {
        cadData.objects.forEach(obj => {
            if (obj.objectId) ids.cadObjects.add(obj.objectId);
            // Assuming cad objects might reference other entities, though not explicitly required by prompt
        });
    }

    // Collect from 'qa' section
    const qaData = safeGetProjectSection(project, 'qa', {});
    if (qaData.results) {
        qaData.results.forEach(result => {
            if (result.relatedEntityRef) {
                ids.qaRelatedEntities.add(result.relatedEntityRef);
            }
        });
    }

    return ids;
}

// Validates that string references in panels exist in the strings section
function validatePanelStringReferences(project) {
    const issues = [];
    const panels = safeGetProjectSection(project, 'fve', {}).panels || [];
    const stringIds = collectEntityIds(project).strings;

    panels.forEach(panel => {
        if (panel.stringId && !stringIds.has(panel.stringId)) {
            issues.push(createValidationIssue({
                type: VALIDATION_STATUS.ERROR,
                message: `Panel refers to a non-existent string ID.`,
                section: "fve.panels",
                detail: `Panel ID: ${panel.panelId || 'N/A'}, Missing String ID: ${panel.stringId}`,
            }));
        }
    });

    return issues;
}

// Validates that entity references in CAD objects exist
function validateCadEntityReferences(project) {
    const issues = [];
    const cadObjects = safeGetProjectSection(project, 'cad', {}).objects || [];
    const layers = collectEntityIds(project).layers;
    // Add other entity ID sets if CAD objects reference them (e.g., specific FVE or LPS components)

    cadObjects.forEach(obj => {
        // Validate layerId reference
        if (obj.layerId && !layers.has(obj.layerId)) {
            issues.push(createValidationIssue({
                type: VALIDATION_STATUS.ERROR,
                message: `CAD object refers to a non-existent layer ID.`,
                section: "cad.objects",
                detail: `CAD Object ID: ${obj.objectId || 'N/A'}, Missing Layer ID: ${obj.layerId}`,
            }));
        }
        // Add checks for other references here if needed based on data model
    });

    return issues;
}

// Validates that related entity references in QA results are valid
function validateQaEntityReferences(project) {
    const issues = [];
    const qaResults = safeGetProjectSection(project, 'qa', {}).results || [];
    const entityIds = collectEntityIds(project); // Contains sets for panels, strings, inverters, layers, cadObjects etc.

    qaResults.forEach(result => {
        if (result.relatedEntityRef) {
            const refParts = result.relatedEntityRef.split(':');
            if (refParts.length < 2) {
                issues.push(createValidationIssue({
                    type: VALIDATION_STATUS.WARNING,
                    message: `QA relatedEntityRef has an invalid format.`,
                    section: "qa.results",
                    detail: `Invalid Reference: ${result.relatedEntityRef}`,
                }));
                return; // Skip further checks for this invalid format
            }
            const entityType = refParts[0];
            const entityId = refParts[1];

            let exists = false;
            switch (entityType) {
                case 'panel': exists = entityIds.panels.has(entityId); break;
                case 'string': exists = entityIds.strings.has(entityId); break;
                case 'inverter': exists = entityIds.inverters.has(entityId); break;
                case 'layer': exists = entityIds.layers.has(entityId); break;
                case 'cadObject': exists = entityIds.cadObjects.has(entityId); break;
                // Add checks for other entity types referenced by QA
                default:
                    issues.push(createValidationIssue({
                        type: VALIDATION_STATUS.WARNING,
                        message: `QA relatedEntityRef has an unknown entity type.`,
                        section: "qa.results",
                        detail: `Unknown Entity Type: ${entityType} in Reference: ${result.relatedEntityRef}`,
                    }));
                    return; // Skip further checks for unknown types
            }

            if (!exists) {
                issues.push(createValidationIssue({
                    type: VALIDATION_STATUS.WARNING,
                    message: `QA relatedEntityRef points to a non-existent entity.`,
                    section: "qa.results",
                    detail: `Missing Reference: ${result.relatedEntityRef}`,
                }));
            }
        }
    });

    return issues;
}

// Validates all project-wide references
function validateProjectReferences(project) {
    const allIssues = [];

    // Collect all known IDs first to ensure consistency across checks
    const entityIds = collectEntityIds(project);

    // 1. Validate panel.stringId references
    const panelStringIssues = validatePanelStringReferences(project);
    allIssues.push(...panelStringIssues);

    // 2. Validate CAD entity references
    const cadIssues = validateCadEntityReferences(project);
    allIssues.push(...cadIssues);

    // 3. Validate QA entity references
    const qaIssues = validateQaEntityReferences(project);
    allIssues.push(...qaIssues);

    // Add other reference validation functions here

    // Determine overall status
    const errors = allIssues.filter(issue => issue.type === VALIDATION_STATUS.ERROR);
    const warnings = allIssues.filter(issue => issue.type === VALIDATION_STATUS.WARNING);
    const infos = allIssues.filter(issue => issue.type === VALIDATION_STATUS.INFO);

    const ok = errors.length === 0;
    const status = ok ? VALIDATION_STATUS.OK : (warnings.length > 0 ? VALIDATION_STATUS.WARNING : VALIDATION_STATUS.ERROR);

    const summary = [];
    summary.push(`Total Issues: ${allIssues.length}`);
    summary.push(`Errors: ${errors.length}`);
    summary.push(`Warnings: ${warnings.length}`);
    summary.push(`Infos: ${infos.length}`);

    return {
        ok: ok,
        status: status,
        errors: errors,
        warnings: warnings,
        summary: summary.join(' | '),
    };
}

export {
    collectEntityIds,
    validatePanelStringReferences,
    validateCadEntityReferences,
    validateQaEntityReferences,
    validateProjectReferences,
};
