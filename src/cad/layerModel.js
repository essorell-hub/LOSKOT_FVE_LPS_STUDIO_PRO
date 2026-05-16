import { v4 as uuidv4 } from 'uuid';

const DEFAULT_LAYER_VISIBILITY = true;
const DEFAULT_LAYER_LOCK = false;

// Define the layers
const layers = [
    { id: 'roof', name: 'Střecha', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
    { id: 'fve', name: 'FVE', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
    { id: 'lps', name: 'LPS', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
    { id: 'dc_route', name: 'DC trasa', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
    { id: 'ac_route', name: 'AC trasa', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
    { id: 'notes', name: 'Poznámky', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
    { id: 'map', name: 'Mapa', visible: DEFAULT_LAYER_VISIBILITY, locked: DEFAULT_LAYER_LOCK },
];

/**
 * Creates default CAD layers for a new project.
 * @returns {Array<Object>} An array of default layer objects.
 */
export function createDefaultCadLayers() {
    // Ensure unique IDs if this function were to be called multiple times within the same project context
    // For now, we assume a fresh set of defaults is always desired.
    return layers.map(layer => ({
        ...layer,
        uuid: uuidv4(), // Assign a unique ID for each instance
    }));
}

/**
 * Normalizes CAD layer data, ensuring all required properties exist.
 * @param {Array<Object>} currentLayers - The current array of layer objects.
 * @returns {Array<Object>} A normalized array of layer objects.
 */
export function normalizeCadLayers(currentLayers) {
    const normalized = [];
    const existingIds = new Set(currentLayers.map(l => l.id));

    // Ensure all predefined layers exist
    layers.forEach(defaultLayer => {
        const existingLayer = currentLayers.find(l => l.id === defaultLayer.id);
        if (existingLayer) {
            normalized.push({
                ...defaultLayer, // Start with default properties
                ...existingLayer, // Override with existing properties
                uuid: existingLayer.uuid || uuidv4(), // Preserve existing UUID or generate new one
            });
        } else {
            // This case should ideally not happen if createDefaultCadLayers was used,
            // but included for robustness.
            normalized.push({
                ...defaultLayer,
                uuid: uuidv4(),
                visible: DEFAULT_LAYER_VISIBILITY,
                locked: DEFAULT_LAYER_LOCK,
            });
        }
    });

    // Add any layers from currentLayers that are not in the default list (e.g., custom added layers)
    currentLayers.forEach(layer => {
        if (!existingIds.has(layer.id)) {
            normalized.push({
                ...layer,
                uuid: layer.uuid || uuidv4(), // Ensure UUID exists
            });
        }
    });

    return normalized;
}

/**
 * Toggles the visibility of a specific layer.
 * @param {Array<Object>} currentLayers - The current array of layer objects.
 * @param {string} layerId - The ID of the layer to toggle.
 * @returns {Array<Object>} A new array with the toggled layer.
 */
export function toggleLayerVisibility(currentLayers, layerId) {
    return currentLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
}

/**
 * Toggles the locked state of a specific layer.
 * @param {Array<Object>} currentLayers - The current array of layer objects.
 * @param {string} layerId - The ID of the layer to toggle.
 * @returns {Array<Object>} A new array with the toggled layer.
 */
export function toggleLayerLock(currentLayers, layerId) {
    return currentLayers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    );
}

/**
 * Counts the number of objects associated with each layer.
 * This function assumes an object structure like { layerId: 'someId', ... }
 * @param {Array<Object>} currentLayers - The current array of layer objects.
 * @param {Array<Object>} allObjects - An array of all objects that have layer associations.
 * @returns {Object} An object where keys are layer IDs and values are counts.
 */
export function getLayerObjectCounts(currentLayers, allObjects) {
    const counts = {};
    // Initialize counts for all defined layers
    currentLayers.forEach(layer => {
        counts[layer.id] = 0;
    });

    if (!allObjects) return counts;

    allObjects.forEach(obj => {
        if (obj && obj.layerId && counts.hasOwnProperty(obj.layerId)) {
            counts[obj.layerId]++;
        }
    });
    return counts;
}

/**
 * Filters layers to return only those that are currently visible and unlocked.
 * @param {Array<Object>} currentLayers - The current array of layer objects.
 * @returns {Array<Object>} An array of visible and unlocked layer objects.
 */
export function getVisibleUnlockedLayers(currentLayers) {
    return currentLayers.filter(layer => layer.visible && !layer.locked);
}
