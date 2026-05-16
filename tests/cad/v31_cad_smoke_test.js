import { layerModel, objectModel } from '../../src/cad/index.js';

console.log("Starting CAD module smoke tests...");

// Test layerModel
try {
    console.log("Testing layerModel...");
    // Assuming layerModel has functions like createLayer, getLayerById, etc.
    // We'll test basic import and a hypothetical function.
    const initialLayerState = { layers: [] };
    const newLayer = layerModel.createLayer({ name: "Test Layer" });
    console.log("layerModel.createLayer test passed.");
    const layersAfterCreate = layerModel.addLayer(initialLayerState, newLayer);
    console.log("layerModel.addLayer test passed.");
    const foundLayer = layerModel.getLayerById(layersAfterCreate, newLayer.id);
    console.log("layerModel.getLayerById test passed.");

} catch (error) {
    console.error("CAD layerModel test failed:", error);
}

// Test objectModel
try {
    console.log("Testing objectModel...");
    // Assuming objectModel has functions like createCadObject, selectCadObject, etc.
    const mockGeometry = { type: "Point", coordinates: [0, 0] };
    const newCadObject = objectModel.createCadObject({
        name: "Test Object",
        geometryType: "Point",
        geometry: mockGeometry,
        layerId: "layer1"
    });
    console.log("objectModel.createCadObject test passed.");

    const initialObjects = [newCadObject];
    const updatedObjects = objectModel.selectCadObject(initialObjects, newCadObject.id);
    console.log("objectModel.selectCadObject test passed.");
    const deselectedObjects = objectModel.clearCadSelection(updatedObjects);
    console.log("objectModel.clearCadSelection test passed.");
    const summary = objectModel.getCadObjectSummary(deselectedObjects);
    console.log("objectModel.getCadObjectSummary test passed.");

} catch (error) {
    console.error("CAD objectModel test failed:", error);
}

console.log("CAD module smoke tests finished.");
