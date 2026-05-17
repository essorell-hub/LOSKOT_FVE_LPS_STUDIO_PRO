function createId(prefix = "project") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyProject(input = {}) {
  const id = input.id || input.projectId || createId("project");

  return {
    id,
    projectId: input.projectId || id,
    name: input.name || "Nový projekt",
    customer: input.customer || {},
    site: input.site || {},
    fve: input.fve || {
      panels: [],
      strings: [],
      inverters: [],
      dcRoutes: []
    },
    cad: input.cad || {
      layers: [],
      objects: []
    },
    lps: input.lps || {
      objects: [],
      riskAssessment: null
    },
    documents: Array.isArray(input.documents) ? input.documents : [],
    database: input.database || {},
    export: input.export || {},
    qa: input.qa || {
      status: "UNKNOWN",
      issues: []
    },
    metadata: {
      createdAt: input.metadata?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: input.metadata?.version || "v39-preview",
      ...(input.metadata || {})
    }
  };
}

export function normalizeProject(project = {}) {
  return createEmptyProject(project);
}

export function createProjectRecord(project = {}) {
  const normalized = normalizeProject(project);

  return {
    id: normalized.id,
    projectId: normalized.projectId,
    name: normalized.name,
    data: normalized,
    updatedAt: new Date().toISOString()
  };
}

export function normalizeProjectRecord(record = {}) {
  const data = record.data || record.project || record;

  return {
    id: record.id || data.id || data.projectId || createId("record"),
    projectId: record.projectId || data.projectId || data.id || createId("project"),
    name: record.name || data.name || "Nový projekt",
    data: normalizeProject(data),
    updatedAt: record.updatedAt || new Date().toISOString()
  };
}

export function createProjectStore(initialProjects = []) {
  const records = new Map();

  for (const project of Array.isArray(initialProjects) ? initialProjects : []) {
    const record = normalizeProjectRecord(project);
    records.set(record.projectId, record);
  }

  return {
    saveProject(project = {}) {
      const record = normalizeProjectRecord(project);
      records.set(record.projectId, record);
      return {
        ok: true,
        status: "SUCCESS",
        projectId: record.projectId,
        record
      };
    },

    loadProject(projectId) {
      const record = records.get(projectId) || null;
      return {
        ok: Boolean(record),
        status: record ? "SUCCESS" : "NOT_FOUND",
        project: record ? record.data : null,
        record
      };
    },

    listProjects() {
      return Array.from(records.values()).map((record) => record.data);
    },

    deleteProject(projectId) {
      const deleted = records.delete(projectId);
      return {
        ok: deleted,
        status: deleted ? "SUCCESS" : "NOT_FOUND",
        projectId
      };
    },

    clearProjects() {
      records.clear();
      return {
        ok: true,
        status: "SUCCESS"
      };
    }
  };
}

const memoryStore = createProjectStore();

export function saveProject(project = {}) {
  return memoryStore.saveProject(project);
}

export function loadProject(projectId) {
  return memoryStore.loadProject(projectId);
}

export function listProjects() {
  return memoryStore.listProjects();
}

export function deleteProject(projectId) {
  return memoryStore.deleteProject(projectId);
}

export function clearProjects() {
  return memoryStore.clearProjects();
}

export function saveProjectToLocalStorage(project = {}, storageKey = "loskot-project-preview") {
  const normalized = normalizeProject(project);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, JSON.stringify(normalized));
  }

  return {
    ok: true,
    status: "SUCCESS",
    project: normalized,
    storageKey
  };
}

export function loadProjectFromLocalStorage(storageKey = "loskot-project-preview") {
  if (typeof localStorage === "undefined") {
    return {
      ok: false,
      status: "UNAVAILABLE",
      project: null,
      storageKey
    };
  }

  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    return {
      ok: false,
      status: "NOT_FOUND",
      project: null,
      storageKey
    };
  }

  const parsed = JSON.parse(raw);
  const project = normalizeProject(parsed);

  return {
    ok: true,
    status: "SUCCESS",
    project,
    storageKey
  };
}

export function clearProjectFromLocalStorage(storageKey = "loskot-project-preview") {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(storageKey);
  }

  return {
    ok: true,
    status: "SUCCESS",
    storageKey
  };
}

export function createProjectStoreSummary(projects = []) {
  const list = Array.isArray(projects) ? projects : [];

  return {
    ok: true,
    status: "SUCCESS",
    count: list.length,
    projectIds: list.map((project) => project.projectId || project.id).filter(Boolean)
  };
}

export default {
  createEmptyProject,
  normalizeProject,
  createProjectRecord,
  normalizeProjectRecord,
  createProjectStore,
  saveProject,
  loadProject,
  listProjects,
  deleteProject,
  clearProjects,
  saveProjectToLocalStorage,
  loadProjectFromLocalStorage,
  clearProjectFromLocalStorage,
  createProjectStoreSummary
};
