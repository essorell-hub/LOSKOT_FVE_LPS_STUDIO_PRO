import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is available for generating IDs
import { VALIDATION_STATUS } from '../validation/validationConstants.js'; // Assuming this path is correct

// Define the types of exportable items
export const EXPORT_ITEM_TYPES = {
    PROJECT_JSON: 'project-json',
    TECHNICAL_REPORT_PDF: 'technical-report-pdf',
    TECHNICAL_REPORT_DOCX: 'technical-report-docx',
    DRAWINGS: 'drawings',
    DATASHEETS: 'datasheets',
    QA_REPORT: 'qa-report',
    DATABASE_BACKUP: 'database-backup',
    CHANGELOG: 'changelog',
};

// Function to create a manifest for an export package
export function createExportPackageManifest(projectName, version) {
    if (!projectName) throw new Error("Project name is required for export package manifest.");
    if (!version) throw new Error("Version is required for export package manifest.");

    return {
        id: uuidv4(),
        projectName: projectName,
        version: version,
        createdAt: new Date().toISOString(),
        items: [], // Array to hold export items
    };
}

// Function to add an item to the export package manifest
export function addExportItem(manifest, itemType, itemPath, description = "") {
    if (!manifest) throw new Error("Manifest is required to add an item.");
    if (!itemType || !Object.values(EXPORT_ITEM_TYPES).includes(itemType)) {
        throw new Error(`Invalid item type: ${itemType}. Valid types are: ${Object.values(EXPORT_ITEM_TYPES).join(', ')}`);
    }
    if (!itemPath) throw new Error("Item path is required.");

    const newItem = {
        id: uuidv4(),
        type: itemType,
        path: itemPath,
        description: description,
        addedAt: new Date().toISOString(),
    };

    manifest.items.push(newItem);
    return manifest;
}

// Function to validate the export package manifest
export function validateExportPackageManifest(manifest) {
    const validationIssues = [];

    if (!manifest) {
        validationIssues.push({
            type: VALIDATION_STATUS.ERROR,
            message: "Manifest object is missing.",
            section: "manifest",
        });
        return { isValid: false, issues: validationIssues };
    }

    if (!manifest.id) validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: "Manifest ID is missing.", section: "manifest" });
    if (!manifest.projectName) validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: "Project name is missing.", section: "manifest" });
    if (!manifest.version) validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: "Version is missing.", section: "manifest" });
    if (!manifest.createdAt) validationIssues.push({ type: VALIDATION_STATUS.WARN, message: "Creation timestamp is missing.", section: "manifest" });
    if (!Array.isArray(manifest.items)) {
        validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: "Manifest items must be an array.", section: "items" });
    } else {
        manifest.items.forEach((item, index) => {
            if (!item.id) validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: `Item at index ${index} is missing ID.`, section: `items[${index}]` });
            if (!item.type || !Object.values(EXPORT_ITEM_TYPES).includes(item.type)) {
                validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: `Item at index ${index} has an invalid or missing type.`, section: `items[${index}]` });
            }
            if (!item.path) validationIssues.push({ type: VALIDATION_STATUS.ERROR, message: `Item at index ${index} is missing path.`, section: `items[${index}]` });
            if (!item.addedAt) validationIssues.push({ type: VALIDATION_STATUS.WARN, message: `Item at index ${index} is missing timestamp.`, section: `items[${index}]` });
        });
    }

    return {
        isValid: validationIssues.length === 0,
        issues: validationIssues,
    };
}

// Function to create a summary of the export package
export function createExportPackageSummary(manifest) {
    const validation = validateExportPackageManifest(manifest);

    if (!validation.isValid) {
        console.error("Cannot create summary for an invalid manifest:", validation.issues);
        // Optionally, return a partial summary or throw an error
        return {
            projectName: manifest?.projectName || "Unknown Project",
            version: manifest?.version || "Unknown Version",
            createdAt: manifest?.createdAt || new Date().toISOString(),
            numberOfItems: manifest?.items?.length || 0,
            status: "Invalid Manifest",
            validationIssues: validation.issues,
        };
    }

    // Count items by type for the summary
    const itemTypeCounts = {};
    for (const itemType of Object.values(EXPORT_ITEM_TYPES)) {
        itemTypeCounts[itemType] = 0;
    }
    manifest.items.forEach(item => {
        if (itemTypeCounts.hasOwnProperty(item.type)) {
            itemTypeCounts[item.type]++;
        }
    });

    return {
        projectName: manifest.projectName,
        version: manifest.version,
        createdAt: manifest.createdAt,
        numberOfItems: manifest.items.length,
        itemCounts: itemTypeCounts,
        status: "Valid",
    };
}
