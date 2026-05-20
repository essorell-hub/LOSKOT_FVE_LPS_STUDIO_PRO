import { createProjectCommandBusV842 } from "../runtime/projectCommandBusV842.js";
import { PROJECT_COMMAND_TYPES_V841, createProjectCommandV841 } from "../runtime/projectCommandModelV841.js";

export function runProjectUpdateWorkflowV862(project = {}, section, value) {
  const bus = createProjectCommandBusV842({ project });
  return bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.PROJECT_UPDATE_SECTION, { project, section, value }));
}
