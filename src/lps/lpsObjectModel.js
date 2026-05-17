import { v4 as uuidv4 } from 'uuid';
import { createLocalId } from "../shared/localId.js";

// Define supported LPS object geometry types
export const SUPPORTED_LPS_GEOMETRY_TYPES = [
    "point", // For air terminals, earthing points, HVI points
    "line",  // For down conductors, HVI routes
    "polygon" // For LPZ zones, SPD areas
];

// --- Helper Functions ---

function createBaseLpsObject({ type, name, geometryType, geometry, layerId, properties = {} }) {
    if (!type) throw new Error("LPS object must have a type.");
    if (!name) throw new Error("LPS object must have a name.");
    if (!geometryType) throw new Error("LPS object must have a geometryType.");
    if (!SUPPORTED_LPS_GEOMETRY_TYPES.includes(geometryType)) {
        throw new Error(`Unsupported geometryType: ${geometryType}. Supported types are: ${SUPPORTED_LPS_GEOMETRY_TYPES.join(', ')}`);
    }
    if (!geometry) throw new Error("LPS object must have geometry data.");

    const now = new Date();
    const timestamp = now.toISOString();

    return {
        id: uuidv4(),
        type: type,
        name: name,
        geometryType: geometryType,
        geometry: geometry,
        layerId: layerId || null, // Optional layer association
        properties: {
            createdAt: timestamp,
            updatedAt: timestamp,
            ...properties
        },
        selected: false, // Default selection state
        visible: true,   // Default visibility
        locked: false    // Default lock state
    };
}

function normalizeLpsObject(lpsObject, updateTimestamp = true) {
    if (!lpsObject) return null;

    const now = new Date();
    const timestamp = now.toISOString();

    const normalized = {
        id: lpsObject.id || uuidv4(),
        type: lpsObject.type || "unknown",
        name: lpsObject.name || "Unnamed LPS Object",
        geometryType: lpsObject.geometryType,
        geometry: lpsObject.geometry,
        layerId: lpsObject.layerId || null,
        properties: {
            createdAt: lpsObject.properties?.createdAt || timestamp,
            updatedAt: updateTimestamp ? timestamp : (lpsObject.properties?.updatedAt || timestamp),
            ...lpsObject.properties
        },
        selected: lpsObject.selected || false,
        visible: lpsObject.visible !== undefined ? lpsObject.visible : true,
        locked: lpsObject.locked || false
    };

    // Validate geometryType after ensuring it exists
    if (!SUPPORTED_LPS_GEOMETRY_TYPES.includes(normalized.geometryType)) {
        console.warn(`LPS object "${normalized.name}" has an unsupported geometryType: "${normalized.geometryType}". Setting to null.`);
        normalized.geometryType = null; // Or handle as an error depending on strictness
    }

    return normalized;
}

// --- Factory Functions for LPS Objects ---

export function createAirTerminal({ name, geometry, layerId, properties = {} }) {
    return createBaseLpsObject({
        type: "airTerminal",
        name: name || "Air Terminal",
        geometryType: "point",
        geometry: geometry,
        layerId: layerId,
        properties: properties
    });
}

export function createDownConductor({ name, geometry, layerId, properties = {} }) {
    return createBaseLpsObject({
        type: "downConductor",
        name: name || "Down Conductor",
        geometryType: "line",
        geometry: geometry,
        layerId: layerId,
        properties: properties
    });
}

export function createHviRoute({ name, geometry, layerId, properties = {} }) {
    return createBaseLpsObject({
        type: "hviRoute",
        name: name || "HVI Route",
        geometryType: "line", // Assuming HVI routes are represented as lines
        geometry: geometry,
        layerId: layerId,
        properties: properties
    });
}

export function createEarthingPoint({ name, geometry, layerId, properties = {} }) {
    return createBaseLpsObject({
        type: "earthingPoint",
        name: name || "Earthing Point",
        geometryType: "point",
        geometry: geometry,
        layerId: layerId,
        properties: properties
    });
}

// Factory function for LPZ (Lightning Protection Zone) - could be polygon
export function createLpzZone({ name, geometry, layerId, properties = {} }) {
    return createBaseLpsObject({
        type: "lpzZone",
        name: name || "LPZ Zone",
        geometryType: "polygon",
        geometry: geometry,
        layerId: layerId,
        properties: properties
    });
}

// Factory function for SPD (Surge Protection Device) - could be point or polygon area
export function createSpdDevice({ name, geometry, layerId, properties = {} }) {
    return createBaseLpsObject({
        type: "spdDevice",
        name: name || "SPD Device",
        geometryType: "point", // Defaulting to point, adjust if polygon is needed for area
        geometry: geometry,
        layerId: layerId,
        properties: properties
    });
}


// --- Normalization ---

export function normalizeLpsObjects(currentLpsObjects) {
    if (!Array.isArray(currentLpsObjects)) {
        console.error("normalizeLpsObjects received non-array input:", currentLpsObjects);
        return [];
    }
    const normalized = [];
    const existingIds = new Set(currentLpsObjects.map(l => l.id));

    currentLpsObjects.forEach(lpsObj => {
        const normalizedObj = normalizeLpsObject(lpsObj);
        if (normalizedObj) {
            normalized.push(normalizedObj);
        }
    });
    return normalized;
}

// --- Utility Functions ---

export function getLpsObjectSummary(currentLpsObjects) {
    const summary = {
        totalObjects: currentLpsObjects.length,
        byType: {},
        byGeometryType: {},
        selectedCount: 0,
    };

    currentLpsObjects.forEach(obj => {
        // Count by type
        summary.byType[obj.type] = (summary.byType[obj.type] || 0) + 1;

        // Count by geometry type
        summary.byGeometryType[obj.geometryType] = (summary.byGeometryType[obj.geometryType] || 0) + 1;

        // Count selected objects
        if (obj.selected) {
            summary.selectedCount++;
        }
    });

    return summary;
}

export function selectLpsObject(currentLpsObjects, objectId) {
    return currentLpsObjects.map(obj => ({
        ...obj,
        selected: obj.id === objectId,
    }));
}

export function clearLpsSelection(currentLpsObjects) {
    return currentLpsObjects.map(obj => ({
        ...obj,
        selected: false,
    }));
}

export function toggleLpsObjectVisibility(currentLpsObjects, objectId) {
    return currentLpsObjects.map(obj =>
        obj.id === objectId ? { ...obj, visible: !obj.visible } : obj
    );
}

export function toggleLpsObjectLock(currentLpsObjects, objectId) {
    return currentLpsObjects.map(obj =>
        obj.id === objectId ? { ...obj, locked: !obj.locked } : obj
    );
}

export function moveLpsObjects(currentLpsObjects, { dx, dy }) {
    const now = new Date();
    const timestamp = now.toISOString();

    return currentLpsObjects.map(obj => {
        if (!obj.selected) return obj;

        // Deep clone geometry to avoid modifying original object directly if it's referenced elsewhere
        let movedGeometry = JSON.parse(JSON.stringify(obj.geometry));

        // Assuming geometry is in a format that supports dx, dy translation (e.g., points, lines)
        // This part might need significant adjustment based on actual geometry structure
        if (movedGeometry.type === 'Point' && movedGeometry.coordinates) {
            movedGeometry.coordinates[0] += dx;
            movedGeometry.coordinates[1] += dy;
        } else if (movedGeometry.type === 'LineString' && movedGeometry.coordinates) {
            movedGeometry.coordinates = movedGeometry.coordinates.map(coord => [coord[0] + dx, coord[1] + dy]);
        } else if (movedGeometry.type === 'Polygon' && movedGeometry.coordinates) {
             movedGeometry.coordinates = movedGeometry.coordinates.map(ring =>
                 ring.map(coord => [coord[0] + dx, coord[1] + dy])
             );
        }
        // Add other geometry types (e.g., MultiPoint, MultiLineString, MultiPolygon) as needed

        const updatedProperties = { ...obj.properties, updatedAt: timestamp };

        return {
            ...obj,
            geometry: movedGeometry,
            properties: updatedProperties
        };
    });
}


// --- Validation ---

// Basic validation for LPS objects, can be expanded
export function validateBasicLpsObjects(lpsObjects) {
    const issues = [];
    if (!Array.isArray(lpsObjects)) {
        issues.push({ type: "error", message: "LPS objects data is not an array.", section: "lps", detail: null });
        return issues;
    }

    lpsObjects.forEach((obj, index) => {
        const objPath = `LPS Object at index ${index} (ID: ${obj.id || 'N/A'})`;

        if (!obj.id) {
            issues.push({ type: "error", message: `${objPath}: Missing required field 'id'.`, section: "lps", detail: null });
        }
        if (!obj.type) {
            issues.push({ type: "error", message: `${objPath}: Missing required field 'type'.`, section: "lps", detail: null });
        } else if (!["airTerminal", "downConductor", "hviRoute", "earthingPoint", "lpzZone", "spdDevice"].includes(obj.type)) {
            issues.push({ type: "warning", message: `${objPath}: Unknown LPS object type '${obj.type}'.`, section: "lps", detail: null });
        }
        if (!obj.name) {
            issues.push({ type: "warning", message: `${objPath}: Missing 'name' field.`, section: "lps", detail: null });
        }
        if (!obj.geometryType) {
            issues.push({ type: "error", message: `${objPath}: Missing required field 'geometryType'.`, section: "lps", detail: null });
        } else if (!SUPPORTED_LPS_GEOMETRY_TYPES.includes(obj.geometryType)) {
            issues.push({ type: "error", message: `${objPath}: Unsupported geometryType '${obj.geometryType}'.`, section: "lps", detail: null });
        }
        if (!obj.geometry) {
            issues.push({ type: "error", message: `${objPath}: Missing required field 'geometry'.`, section: "lps", detail: null });
        } else {
            // Add geometry specific validation here if needed
            // e.g., check if coordinates are valid for the geometryType
        }

        // Example: Check if layerId exists if it's provided
        if (obj.layerId && !obj.layerId.toString().trim()) { // Check for empty string or whitespace
             issues.push({ type: "warning", message: `${objPath}: 'layerId' is provided but empty.`, section: "lps", detail: null });
        }
    });

    return issues;
}


export function createLpsObject(input = {}) {
  return {
    id: input.id || createLocalId("lps"),
    type: input.type || input.geometryType || "note",
    geometryType: input.geometryType || input.type || "note",
    name: input.name || "LPS objekt",
    points: Array.isArray(input.points) ? input.points : [],
    metadata: input.metadata || {},
    status: input.status || "ok"
  };
}
