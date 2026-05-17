export const RUNTIME_BRIDGE_VERSION = "v40-runtime-bridge";

export function createRuntimeResult(input = {}) {
  const ok = input.ok !== false && (!Array.isArray(input.errors) || input.errors.length === 0);

  return {
    ok,
    data: input.data ?? null,
    warnings: Array.isArray(input.warnings) ? input.warnings : [],
    errors: Array.isArray(input.errors) ? input.errors : [],
    meta: {
      version: RUNTIME_BRIDGE_VERSION,
      module: input.module || "runtime",
      action: input.action || "unknown",
      timestamp: input.timestamp || new Date().toISOString(),
      ...(input.meta || {})
    }
  };
}

export function createRuntimeError(error, context = {}) {
  const message = error instanceof Error ? error.message : String(error || "Unknown runtime error");

  return createRuntimeResult({
    ok: false,
    module: context.module || "runtime",
    action: context.action || "error",
    data: context.data ?? null,
    warnings: context.warnings || [],
    errors: [
      {
        message,
        name: error instanceof Error ? error.name : "RuntimeError",
        stack: context.includeStack && error instanceof Error ? error.stack : undefined
      }
    ],
    meta: context.meta || {}
  });
}

export async function safeRuntimeCall(context = {}, fn) {
  try {
    if (typeof fn !== "function") {
      return createRuntimeError("safeRuntimeCall expected a function.", context);
    }

    const value = await fn();

    if (value && typeof value === "object" && "ok" in value && "errors" in value && "warnings" in value) {
      return createRuntimeResult({
        ok: value.ok,
        data: value.data ?? value,
        warnings: value.warnings || [],
        errors: value.errors || [],
        module: context.module,
        action: context.action,
        meta: {
          wrapped: true,
          ...(context.meta || {})
        }
      });
    }

    return createRuntimeResult({
      ok: true,
      data: value,
      warnings: [],
      errors: [],
      module: context.module,
      action: context.action,
      meta: context.meta || {}
    });
  } catch (error) {
    return createRuntimeError(error, context);
  }
}

export function normalizeRuntimeProject(project = {}) {
  const id = project.id || project.projectId || `project-${Date.now().toString(36)}`;

  return {
    id,
    projectId: project.projectId || id,
    name: project.name || "Nový projekt",
    customer: project.customer || {},
    site: project.site || {},
    fve: project.fve || {
      panels: [],
      strings: [],
      inverters: [],
      dcRoutes: []
    },
    cad: project.cad || {
      layers: [],
      objects: []
    },
    lps: project.lps || {
      objects: [],
      riskAssessment: null
    },
    documents: Array.isArray(project.documents) ? project.documents : [],
    database: project.database || {},
    export: project.export || {},
    qa: project.qa || {
      status: "UNKNOWN",
      issues: []
    },
    metadata: {
      runtimeVersion: RUNTIME_BRIDGE_VERSION,
      updatedAt: new Date().toISOString(),
      ...(project.metadata || {})
    }
  };
}

export function createRuntimeState(input = {}) {
  const project = normalizeRuntimeProject(input.project || input);

  return createRuntimeResult({
    ok: true,
    module: "runtime",
    action: "createRuntimeState",
    data: {
      project,
      modules: {
        fve: {
          enabled: true,
          status: "READY"
        },
        cad: {
          enabled: true,
          status: "READY"
        },
        lps: {
          enabled: true,
          status: "READY",
          riskAssessmentNormative: false
        },
        documents: {
          enabled: true,
          status: "READY"
        },
        database: {
          enabled: true,
          status: "PREVIEW"
        },
        export: {
          enabled: true,
          status: "READY"
        }
      }
    },
    warnings: [
      "LPS risk assessment je zatím pouze placeholder, ne finální normový výpočet."
    ]
  });
}

export function updateRuntimeProject(runtimeState = {}, patch = {}) {
  const baseProject = runtimeState.project || runtimeState.data?.project || {};
  const project = normalizeRuntimeProject({
    ...baseProject,
    ...patch,
    fve: {
      ...(baseProject.fve || {}),
      ...(patch.fve || {})
    },
    cad: {
      ...(baseProject.cad || {}),
      ...(patch.cad || {})
    },
    lps: {
      ...(baseProject.lps || {}),
      ...(patch.lps || {})
    },
    metadata: {
      ...(baseProject.metadata || {}),
      ...(patch.metadata || {}),
      updatedAt: new Date().toISOString()
    }
  });

  return createRuntimeResult({
    ok: true,
    module: "runtime",
    action: "updateRuntimeProject",
    data: {
      project
    }
  });
}

export function getRuntimeModuleSummary(runtimeState = {}) {
  const state = runtimeState.data || runtimeState;
  const project = state.project || {};
  const modules = state.modules || {};

  return createRuntimeResult({
    ok: true,
    module: "runtime",
    action: "getRuntimeModuleSummary",
    data: {
      projectId: project.projectId || project.id || null,
      projectName: project.name || "Nový projekt",
      modules,
      counts: {
        fvePanels: Array.isArray(project.fve?.panels) ? project.fve.panels.length : 0,
        cadLayers: Array.isArray(project.cad?.layers) ? project.cad.layers.length : 0,
        cadObjects: Array.isArray(project.cad?.objects) ? project.cad.objects.length : 0,
        lpsObjects: Array.isArray(project.lps?.objects) ? project.lps.objects.length : 0,
        documents: Array.isArray(project.documents) ? project.documents.length : 0
      }
    },
    warnings: modules.lps?.riskAssessmentNormative === false
      ? ["LPS risk assessment není normový výpočet."]
      : []
  });
}

export function createModuleRuntimeAdapter(moduleName, handlers = {}) {
  return {
    moduleName,

    async run(action, payload = {}) {
      const handler = handlers[action];

      if (typeof handler !== "function") {
        return createRuntimeError(`Handler "${action}" not found for module "${moduleName}".`, {
          module: moduleName,
          action,
          data: payload
        });
      }

      return safeRuntimeCall(
        {
          module: moduleName,
          action
        },
        () => handler(payload)
      );
    },

    listActions() {
      return Object.keys(handlers);
    }
  };
}

export function createRuntimeBridge(input = {}) {
  const stateResult = createRuntimeState(input);

  return {
    version: RUNTIME_BRIDGE_VERSION,
    state: stateResult.data,

    getState() {
      return createRuntimeResult({
        ok: true,
        module: "runtime",
        action: "getState",
        data: this.state
      });
    },

    setProject(project = {}) {
      const updated = updateRuntimeProject(this.state, project);

      if (updated.ok) {
        this.state = {
          ...this.state,
          project: updated.data.project
        };
      }

      return updated;
    },

    getSummary() {
      return getRuntimeModuleSummary(this.state);
    },

    async runSafe(moduleName, action, fn) {
      return safeRuntimeCall(
        {
          module: moduleName,
          action
        },
        fn
      );
    }
  };
}

export default {
  RUNTIME_BRIDGE_VERSION,
  createRuntimeResult,
  createRuntimeError,
  safeRuntimeCall,
  normalizeRuntimeProject,
  createRuntimeState,
  updateRuntimeProject,
  getRuntimeModuleSummary,
  createModuleRuntimeAdapter,
  createRuntimeBridge
};
