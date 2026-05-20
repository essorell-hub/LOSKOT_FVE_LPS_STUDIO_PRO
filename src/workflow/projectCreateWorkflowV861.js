import { createProjectCommandBusV842 } from "../runtime/projectCommandBusV842.js";
import { PROJECT_COMMAND_TYPES_V841, createProjectCommandV841 } from "../runtime/projectCommandModelV841.js";

export function runProjectCreateWorkflowV861(seed = {}) {
  const bus = createProjectCommandBusV842();
  const result = bus.execute(createProjectCommandV841(PROJECT_COMMAND_TYPES_V841.PROJECT_CREATE, { seed }));
  return { ...result, data: { ...result.data, history: bus.getHistory() } };
}
