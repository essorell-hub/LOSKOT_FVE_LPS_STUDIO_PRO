import { v4 as uuidv4 } from 'uuid';

// --- Constants ---
// Consider defining these if they are not globally available or imported elsewhere.
// For now, assuming they might be defined in a shared constants file or similar.
// If not, they'd need to be defined here or imported.
// Example: const DATA_MODEL_VERSION = "v21";
// Example: const APP_VERSION = "v21";

// --- Helper Functions ---

/**
 * Creates a deep clone of an object, ensuring immutability.
 * Uses JSON parse/stringify as a simple deep clone method.
 * @param {object} obj The object to clone.
 * @returns {object} A deep clone of the object.
 */
function deepClone(obj) {
    if (!obj) return obj;
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Safely gets a section from the project object, returning a fallback if the section is missing or invalid.
 * @param {object} project The project object.
 * @param {string} sectionName The name of the section to retrieve.
 * @param {*} fallbackValue The value to return if the section is not found or invalid.
 * @returns {*} The project section or the fallback value.
 */
function safeGetProjectSection(project, sectionName, fallbackValue) {
    if (!project || typeof project !== 'object') {
        return fallbackValue;
    }
    // Use hasOwnProperty for a more robust check against prototype properties
    if (Object.prototype.hasOwnProperty.call(project, sectionName)) {
        return project[sectionName];
    }
    return fallbackValue;
}

/**
 * Creates a deep clone of the project's panels array.
 * @param {Array<object>} panels The original panels array.
 * @returns {Array<object>} A deep clone of the panels array.
 */
function clonePanelsArray(panels) {
    return panels.map(panel => deepClone(panel));
}

// --- Core Selection State Management ---

/**
 * Creates the initial state for panel selection.
 * @param {Array<object>} allPanels An array of all panel objects available in the project.
 * @returns {object} The initial panel selection state.
 */
export function createPanelSelectionState(allPanels = []) {
    const panelsArray = Array.isArray(allPanels) ? allPanels : [];
    const selectedPanelIds = new Set();
    const allPanelIds = new Set(panelsArray.map(panel => panel.id)); // Assuming each panel has a unique 'id'

    return {
        allPanelIds: allPanelIds,
        selectedPanelIds: selectedPanelIds,
        // Add any other relevant state here, e.g., selection mode, filtered panels, etc.
    };
}

/**
 * Selects all panels in the given project.
 * @param {object} currentSelectionState The current panel selection state.
 * @param {Array<object>} allPanels An array of all panel objects in the project.
 * @returns {object} The new panel selection state with all panels selected.
 */
export function selectAllPanels(currentSelectionState, allPanels = []) {
    const panelsArray = Array.isArray(allPanels) ? allPanels : [];
    const newSelectedPanelIds = new Set(panelsArray.map(panel => panel.id));
    return {
        ...currentSelectionState,
        selectedPanelIds: newSelectedPanelIds,
    };
}

/**
 * Selects a subset of panels based on provided IDs.
 * This will merge with existing selections or replace them depending on the desired behavior.
 * This implementation merges the new IDs with existing selected IDs.
 * @param {object} currentSelectionState The current panel selection state.
 * @param {Array<string>} panelIdsToSelect An array of panel IDs to select.
 * @returns {object} The new panel selection state with specified panels selected.
 */
export function selectPartialPanels(currentSelectionState, panelIdsToSelect = []) {
    const newSelectedPanelIds = new Set(currentSelectionState.selectedPanelIds);
    panelIdsToSelect.forEach(id => {
        if (id) { // Ensure ID is not null/undefined/empty
            newSelectedPanelIds.add(id);
        }
    });
    return {
        ...currentSelectionState,
        selectedPanelIds: newSelectedPanelIds,
    };
}

/**
 * Clears the current panel selection, deselecting all panels.
 * @param {object} currentSelectionState The current panel selection state.
 * @returns {object} The new panel selection state with no panels selected.
 */
export function clearPanelSelection(currentSelectionState) {
    return {
        ...currentSelectionState,
        selectedPanelIds: new Set(),
    };
}

/**
 * Toggles the selection state of a specific panel.
 * If the panel is selected, it becomes deselected, and vice versa.
 * @param {object} currentSelectionState The current panel selection state.
 * @param {string} panelId The ID of the panel to toggle.
 * @returns {object} The new panel selection state with the panel's selection toggled.
 */
export function togglePanelSelection(currentSelectionState, panelId) {
    if (!panelId) {
        console.warn("togglePanelSelection called with invalid panelId.");
        return currentSelectionState; // Return current state if panelId is invalid
    }
    const newSelectedPanelIds = new Set(currentSelectionState.selectedPanelIds);
    if (newSelectedPanelIds.has(panelId)) {
        newSelectedPanelIds.delete(panelId);
    } else {
        newSelectedPanelIds.add(panelId);
    }
    return {
        ...currentSelectionState,
        selectedPanelIds: newSelectedPanelIds,
    };
}

/**
 * Moves selected panels to a different parent or location.
 * This is a placeholder function. Actual implementation would depend on the project structure
 * and how panels are related to other components (e.g., strings, roof sections).
 * This example assumes panels have a 'parentId' property that can be updated.
 * @param {object} currentSelectionState The current panel selection state.
 * @param {Array<object>} currentPanels The current array of all panel objects.
 * @param {string} newParentId The ID of the new parent to move the panels to.
 * @returns {{newSelectionState: object, updatedPanels: Array<object>}} An object containing the new selection state and the updated panels array.
 */
export function moveSelectedPanels(currentSelectionState, currentPanels, newParentId) {
    const updatedPanels = clonePanelsArray(currentPanels);
    const selectionToMove = Array.from(currentSelectionState.selectedPanelIds);

    if (!newParentId || selectionToMove.length === 0) {
        console.warn("moveSelectedPanels: No panels selected or invalid newParentId provided.");
        return {
            newSelectionState: currentSelectionState, // No change
            updatedPanels: currentPanels, // No change
        };
    }

    selectionToMove.forEach(panelId => {
        const panelIndex = updatedPanels.findIndex(panel => panel.id === panelId);
        if (panelIndex !== -1) {
            // Assuming panels have a 'parentId' property that needs updating
            updatedPanels[panelIndex] = {
                ...updatedPanels[panelIndex],
                parentId: newParentId,
            };
        }
    });

    // After moving, the selection might need to be cleared or adjusted.
    // Here, we'll clear the selection as they've been moved.
    const newSelectionState = clearPanelSelection(currentSelectionState);

    return {
        newSelectionState: newSelectionState,
        updatedPanels: updatedPanels,
    };
}

/**
 * Gets a summary of the current panel selection.
 * @param {object} currentSelectionState The current panel selection state.
 * @param {Array<object>} allPanels An array of all panel objects in the project.
 * @returns {object} An object containing the count of selected panels and the total number of panels.
 */
export function getPanelSelectionSummary(currentSelectionState, allPanels = []) {
    const panelsArray = Array.isArray(allPanels) ? allPanels : [];
    const totalPanels = panelsArray.length;
    const selectedCount = Array.from(currentSelectionState.selectedPanelIds).filter(id =>
        panelsArray.some(panel => panel.id === id) // Ensure the selected ID actually exists in the current panels list
    ).length;

    return {
        selectedCount: selectedCount,
        totalPanels: totalPanels,
        isAllSelected: selectedCount === totalPanels && totalPanels > 0,
        isNoneSelected: selectedCount === 0,
    };
}

// --- Example Usage (for testing/demonstration) ---
/*
// Assume you have a project with panels:
const samplePanels = [
    { id: 'panel-1', name: 'Panel A', parentId: 'string-1' },
    { id: 'panel-2', name: 'Panel B', parentId: 'string-1' },
    { id: 'panel-3', name: 'Panel C', parentId: 'string-2' },
];

let selectionState = createPanelSelectionState(samplePanels);
console.log("Initial State:", selectionState);
console.log("Initial Summary:", getPanelSelectionSummary(selectionState, samplePanels));

// Select panel-1
selectionState = togglePanelSelection(selectionState, 'panel-1');
console.log("After selecting panel-1:", selectionState);
console.log("Summary:", getPanelSelectionSummary(selectionState, samplePanels));

// Select all panels
selectionState = selectAllPanels(selectionState, samplePanels);
console.log("After selecting all:", selectionState);
console.log("Summary:", getPanelSelectionSummary(selectionState, samplePanels));

// Clear selection
selectionState = clearPanelSelection(selectionState);
console.log("After clearing selection:", selectionState);
console.log("Summary:", getPanelSelectionSummary(selectionState, samplePanels));

// Select partial panels
selectionState = selectPartialPanels(selectionState, ['panel-1', 'panel-3']);
console.log("After selecting partial [panel-1, panel-3]:", selectionState);
console.log("Summary:", getPanelSelectionSummary(selectionState, samplePanels));

// Move selected panels (panel-1, panel-3) to a new string 'string-3'
const { newSelectionState: movedState, updatedPanels } = moveSelectedPanels(selectionState, samplePanels, 'string-3');
console.log("After moving selected panels:", movedState);
console.log("Updated Panels:", updatedPanels);
console.log("Summary after move:", getPanelSelectionSummary(movedState, updatedPanels));
*/
