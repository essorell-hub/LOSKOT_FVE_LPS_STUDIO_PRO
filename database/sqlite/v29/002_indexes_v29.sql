-- Index for foreign key 'project_id' in the projects table
CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);

-- Index for foreign key 'project_id' in the buildings table
CREATE INDEX IF NOT EXISTS idx_buildings_project_id ON buildings(project_id);
-- Index for foreign key 'building_id' in the buildings table
CREATE INDEX IF NOT EXISTS idx_buildings_building_id ON buildings(building_id);

-- Index for foreign key 'project_id' in the roofs table
CREATE INDEX IF NOT EXISTS idx_roofs_project_id ON roofs(project_id);
-- Index for foreign key 'roof_id' in the roofs table
CREATE INDEX IF NOT EXISTS idx_roofs_roof_id ON roofs(roof_id);

-- Index for foreign key 'roof_plane_id' in the roof_planes table
CREATE INDEX IF NOT EXISTS idx_roof_planes_roof_plane_id ON roof_planes(roof_plane_id);
-- Index for foreign key 'roof_id' in the roof_planes table
CREATE INDEX IF NOT EXISTS idx_roof_planes_roof_id ON roof_planes(roof_id);

-- Index for foreign key 'project_id' in the fve_arrays table
CREATE INDEX IF NOT EXISTS idx_fve_arrays_project_id ON fve_arrays(project_id);
-- Index for foreign key 'string_id' in the fve_strings table
CREATE INDEX IF NOT EXISTS idx_fve_strings_string_id ON fve_strings(string_id);
-- Index for foreign key 'inverter_id' in the fve_inverters table
CREATE INDEX IF NOT EXISTS idx_fve_inverters_inverter_id ON fve_inverters(inverter_id);

-- Index for foreign key 'project_id' in the lps_components table
CREATE INDEX IF NOT EXISTS idx_lps_components_project_id ON lps_components(project_id);
-- Index for 'lps_class' in the lps_components table
CREATE INDEX IF NOT EXISTS idx_lps_components_lps_class ON lps_components(lps_class);

-- Index for foreign key 'project_id' in the spd_devices table
CREATE INDEX IF NOT EXISTS idx_spd_devices_project_id ON spd_devices(project_id);
-- Index for foreign key 'lpz_id' in the spd_devices table
CREATE INDEX IF NOT EXISTS idx_spd_devices_lpz_id ON spd_devices(lpz_id);

-- Index for foreign key 'project_id' in the lpz_zones table
CREATE INDEX IF NOT EXISTS idx_lpz_zones_project_id ON lpz_zones(project_id);

-- Index for foreign key 'layer_id' in the cad_objects table
CREATE INDEX IF NOT EXISTS idx_cad_objects_layer_id ON cad_objects(layer_id);

-- Index for foreign key 'entity_ref' in the documents table
CREATE INDEX IF NOT EXISTS idx_documents_entity_ref ON documents(entity_ref);

-- Index for 'qa_status' in relevant tables (example for projects)
CREATE INDEX IF NOT EXISTS idx_projects_qa_status ON projects(qa_status);

-- Index for 'export_status' in relevant tables (example for projects)
CREATE INDEX IF NOT EXISTS idx_projects_export_status ON projects(export_status);

-- Index for 'created_at' timestamp in relevant tables (example for projects)
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Index for 'updated_at' timestamp in relevant tables (example for projects)
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);
