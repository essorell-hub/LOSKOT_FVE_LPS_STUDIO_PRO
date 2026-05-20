import { createProjectApplicationServiceV821 } from "../app/projectApplicationServiceV821.js";
import { createFveApplicationServiceV822 } from "../app/fveApplicationServiceV822.js";
import { createLpsSpdApplicationServiceV823 } from "../app/lpsSpdApplicationServiceV823.js";
import { createDocumentsApplicationServiceV824 } from "../app/documentsApplicationServiceV824.js";
import { createExportApplicationServiceV825 } from "../app/exportApplicationServiceV825.js";
import { createQaApplicationServiceV826 } from "../app/qaApplicationServiceV826.js";
import { PROJECT_COMMAND_TYPES_V841, normalizeProjectCommandV841 } from "./projectCommandModelV841.js";
import { createProjectOperationResultV843, resultFromExceptionV843 } from "./projectOperationResultV843.js";
import { validateProjectCommandV844 } from "./projectOperationValidatorV844.js";
import { createProjectOperationHistoryV845 } from "./projectOperationHistoryV845.js";

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function updateSection(project, section, value) {
  return { ...(project || {}), [section]: clone(value) };
}

export function createProjectCommandBusV842(options = {}) {
  const services = {
    project: options.projectService || createProjectApplicationServiceV821(),
    fve: options.fveService || createFveApplicationServiceV822(),
    lps: options.lpsService || createLpsSpdApplicationServiceV823(),
    documents: options.documentsService || createDocumentsApplicationServiceV824(),
    export: options.exportService || createExportApplicationServiceV825(),
    qa: options.qaService || createQaApplicationServiceV826()
  };
  const history = options.history || createProjectOperationHistoryV845();
  let state = { project: options.project || null, snapshots: [] };

  function execute(rawCommand = {}) {
    const command = normalizeProjectCommandV841(rawCommand);
    const validation = validateProjectCommandV844(command);
    if (!validation.valid) {
      const result = createProjectOperationResultV843({
        ok: false,
        warnings: validation.warnings,
        errors: validation.errors,
        operationLog: [{ event: "command-rejected", commandType: command.type }]
      });
      history.append({ commandType: command.type, ok: result.ok, errors: result.errors });
      return result;
    }
    try {
      const result = dispatch(command);
      history.append({ commandType: command.type, ok: result.ok, warnings: result.warnings, errors: result.errors });
      return createProjectOperationResultV843({
        ...result,
        operationLog: [...result.operationLog, { event: "command-executed", commandType: command.type }]
      });
    } catch (error) {
      const result = resultFromExceptionV843(error, { commandType: command.type });
      history.append({ commandType: command.type, ok: false, errors: result.errors });
      return result;
    }
  }

  function dispatch(command) {
    const payload = command.payload || {};
    const project = payload.project || state.project || {};
    switch (command.type) {
      case PROJECT_COMMAND_TYPES_V841.PROJECT_CREATE: {
        state.project = services.project.createEmptyProject(payload.seed || payload);
        return createProjectOperationResultV843({ data: { project: state.project } });
      }
      case PROJECT_COMMAND_TYPES_V841.PROJECT_LOAD: {
        const loaded = services.project.loadProjectPayload(payload);
        state.project = loaded.project;
        return createProjectOperationResultV843({ data: loaded });
      }
      case PROJECT_COMMAND_TYPES_V841.PROJECT_VALIDATE: {
        const validation = services.project.validateProject(project);
        return createProjectOperationResultV843({ ok: validation.valid, data: validation, warnings: validation.warnings, errors: validation.errors, qaFindings: validation.qaFindings });
      }
      case PROJECT_COMMAND_TYPES_V841.PROJECT_UPDATE_SECTION: {
        state.project = updateSection(project, payload.section, payload.value);
        return createProjectOperationResultV843({ data: { project: state.project, section: payload.section } });
      }
      case PROJECT_COMMAND_TYPES_V841.FVE_EVALUATE:
        return createProjectOperationResultV843(services.fve.evaluateFvePractical(project));
      case PROJECT_COMMAND_TYPES_V841.LPS_EVALUATE:
        return createProjectOperationResultV843(services.lps.evaluateLpsSpdGrounding(project));
      case PROJECT_COMMAND_TYPES_V841.DOCS_BUILD:
        return createProjectOperationResultV843(services.documents.buildTechnicalReportSet(project, payload));
      case PROJECT_COMMAND_TYPES_V841.BOM_BUILD:
        return createProjectOperationResultV843(services.export.buildBom(project, payload));
      case PROJECT_COMMAND_TYPES_V841.EXPORT_BUILD:
        return createProjectOperationResultV843(services.export.buildExportPackage(project, payload));
      case PROJECT_COMMAND_TYPES_V841.QA_RUN_ALL: {
        const qaFindings = services.qa.collectAllQaFindings(project, payload);
        return createProjectOperationResultV843({ data: services.qa.summarizeQa(qaFindings), qaFindings });
      }
      case PROJECT_COMMAND_TYPES_V841.SNAPSHOT_CREATE: {
        const snapshot = services.project.createProjectSnapshot(project, payload);
        state.snapshots = [...state.snapshots, snapshot];
        return createProjectOperationResultV843({ data: { snapshot } });
      }
      case PROJECT_COMMAND_TYPES_V841.SNAPSHOT_RESTORE: {
        const snapshot = payload.snapshot || state.snapshots.find((item) => item.snapshotId === payload.snapshotId);
        state.project = clone(snapshot?.project || project);
        return createProjectOperationResultV843({ data: { project: state.project, snapshotId: snapshot?.snapshotId || null } });
      }
      default:
        return createProjectOperationResultV843({ ok: false, errors: [{ code: "COMMAND_NOT_IMPLEMENTED", message: command.type }] });
    }
  }

  return {
    execute,
    getState: () => clone(state),
    getHistory: () => history.list(),
    services
  };
}
