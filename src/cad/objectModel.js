import { v4 as uuidv4 } from 'uuid';
import { createLocalId } from "../shared/localId.js";

// Define supported geometry types
const SUPPORTED_GEOMETRY_TYPES = ['point', 'polyline', 'polygon', 'rect', 'circle'];

/**
 * Creates a new CAD object with a unique ID and default properties.
 * @param {object} options - Configuration for the CAD object.
 * @param {string} options.name - The name of the CAD object.
 * @param {string} options.geometryType - The type of geometry (e.g., 'point', 'polygon').
 * @param {object} options.geometry - The geometry data (e.g., { x, y } for point, array of points for polygon).
 * @param {string} [options.layerId] - The ID of the layer this object belongs to.
 * @param {object} [options.properties] - Additional custom properties.
 * @returns {object} The created CAD object.
 */
export function createCadObject(input = {}) {
  const geometryAliases = {
    Point: "point",
    point: "point",
    POINT: "point",
    LineString: "polyline",
    linestring: "polyline",
    LINESTRING: "polyline",
    Polyline: "polyline",
    polyline: "polyline",
    Polygon: "polygon",
    polygon: "polygon",
    Rect: "rect",
    Rectangle: "rect",
    rectangle: "rect",
    Circle: "circle",
    circle: "circle"
  };

  const rawGeometryType = input.geometryType || input.type || "point";
  const normalizedGeometryType = geometryAliases[rawGeometryType] || String(rawGeometryType).toLowerCase();
  const supported = ["point", "polyline", "polygon", "rect", "circle"];

  if (!supported.includes(normalizedGeometryType)) {
    throw new Error(`Unsupported geometryType: ${rawGeometryType}. Supported types are: ${supported.join(", ")}.`);
  }

  return {
    id: input.id || createLocalId("cad"),
    type: input.type || normalizedGeometryType,
    geometryType: normalizedGeometryType,
    name: input.name || "CAD objekt",
    layerId: input.layerId || null,
    points: Array.isArray(input.points) ? input.points : [],
    x: Number(input.x || 0),
    y: Number(input.y || 0),
    width: Number(input.width || 0),
    height: Number(input.height || 0),
    radius: Number(input.radius || 0),
    metadata: input.metadata || {}
  };
}

/**
 * Normalizes a CAD object, ensuring it has essential properties and a valid structure.
 * It also ensures that createdAt and updatedAt timestamps are present and updated.
 * @param {object} cadObject - The CAD object to normalize.
 * @param {boolean} [updateTimestamp=true] - Whether to update the updatedAt timestamp.
 * @returns {object} The normalized CAD object.
 */
export function normalizeCadObject(cadObject, updateTimestamp = true) {
    if (!cadObject) return null;

    const now = new Date();
    const timestamp = now.toISOString();

    const normalized = {
        id: cadObject.id || uuidv4(),
        name: cadObject.name || "Unnamed CAD Object",
        geometryType: cadObject.geometryType,
        geometry: cadObject.geometry,
        layerId: cadObject.layerId || null,
        properties: {
            ...(cadObject.properties || {}),
            createdAt: cadObject.properties?.createdAt || timestamp,
            updatedAt: updateTimestamp ? timestamp : cadObject.properties?.updatedAt || timestamp,
        },
        selected: cadObject.selected || false,
        visible: cadObject.visible !== undefined ? cadObject.visible : true,
        locked: cadObject.locked || false,
    };

    // Basic validation for geometry type if it exists
    if (normalized.geometryType && !SUPPORTED_GEOMETRY_TYPES.includes(normalized.geometryType)) {
        console.warn(`CAD object ${normalized.id} has an unsupported geometryType: ${normalized.geometryType}. Setting to null.`);
        normalized.geometryType = null;
    }

    return normalized;
}

/**
 * Selects a specific CAD object by its ID.
 * @param {Array<object>} currentObjects - The current array of CAD objects.
 * @param {string} objectId - The ID of the object to select.
 * @returns {Array<object>} A new array with the specified object selected.
 */
export function selectCadObject(currentObjects, objectId) {
    return currentObjects.map(obj => ({
        ...obj,
        selected: obj.id === objectId,
    }));
}

/**
 * Clears the selection of all CAD objects.
 * @param {Array<object>} currentObjects - The current array of CAD objects.
 * @returns {Array<object>} A new array with all objects deselected.
 */
export function clearCadSelection(currentObjects) {
    return currentObjects.map(obj => ({
        ...obj,
        selected: false,
    }));
}

/**
 * Moves one or more selected CAD objects by a given offset.
 * @param {Array<object>} currentObjects - The current array of CAD objects.
 * @param {object} offset - The offset to apply { dx, dy }.
 * @param {number} offset.dx - Change in x-coordinate.
 * @param {number} offset.dy - Change in y-coordinate.
 * @returns {Array<object>} A new array with the moved objects.
 */
export function moveCadObjects(currentObjects, { dx, dy }) {
    const now = new Date();
    const timestamp = now.toISOString();

    return currentObjects.map(obj => {
        if (!obj.selected) return obj;

        const movedGeometry = { ...obj.geometry };
        const updatedProperties = { ...obj.properties, updatedAt: timestamp };

        switch (obj.geometryType) {
            case 'point':
                movedGeometry.x += dx;
                movedGeometry.y += dy;
                break;
            case 'polyline':
            case 'polygon':
                movedGeometry.points = obj.geometry.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
                break;
            case 'rect':
                movedGeometry.x += dx;
                movedGeometry.y += dy;
                // Optionally move width/height or keep them same. Assuming we move the top-left corner.
                break;
            case 'circle':
                movedGeometry.cx += dx;
                movedGeometry.cy += dy;
                break;
            default:
                console.warn(`Moving not implemented for geometryType: ${obj.geometryType}`);
                return obj; // Return original object if type is unknown or not movable
        }

        return {
            ...obj,
            geometry: movedGeometry,
            properties: updatedProperties,
        };
    });
}

/**
 * Generates a summary of CAD objects, including counts by geometry type and layer.
 * @param {Array<object>} currentObjects - The current array of CAD objects.
 * @returns {object} An object containing summaries.
 */
export function getCadObjectSummary(currentObjects) {
    const summary = {
        totalObjects: currentObjects.length,
        byGeometryType: {},
        byLayer: {},
        selectedCount: 0,
    };

    currentObjects.forEach(obj => {
        // Count by geometry type
        summary.byGeometryType[obj.geometryType] = (summary.byGeometryType[obj.geometryType] || 0) + 1;

        // Count by layer
        const layerId = obj.layerId || 'unassigned';
        summary.byLayer[layerId] = (summary.byLayer[layerId] || 0) + 1;

        // Count selected objects
        if (obj.selected) {
            summary.selectedCount++;
        }
    });

    return summary;
}
