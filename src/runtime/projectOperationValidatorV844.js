import { isKnownProjectCommandTypeV841 } from "./projectCommandModelV841.js";

export function validateProjectCommandV844(command = {}) {
  const errors = [];
  const warnings = [];
  if (!command || typeof command !== "object") {
    errors.push({ code: "COMMAND_NOT_OBJECT", message: "Command must be an object." });
    return { valid: false, errors, warnings };
  }
  if (!command.type) errors.push({ code: "COMMAND_TYPE_MISSING", message: "Command type is missing." });
  if (command.type && !isKnownProjectCommandTypeV841(command.type)) {
    errors.push({ code: "COMMAND_TYPE_UNKNOWN", message: `Unknown command type: ${command.type}` });
  }
  if (!command.payload || typeof command.payload !== "object") warnings.push({ code: "COMMAND_PAYLOAD_EMPTY", message: "Command payload is empty." });
  return { valid: errors.length === 0, errors, warnings };
}

export function validateProjectForOperationV844(project = {}) {
  const errors = [];
  const warnings = [];
  if (!project || typeof project !== "object") errors.push({ code: "PROJECT_NOT_OBJECT", message: "Project must be an object." });
  if (project && typeof project === "object" && !project.projectId && !project.id) warnings.push({ code: "PROJECT_ID_MISSING", message: "Project id is missing." });
  return { valid: errors.length === 0, errors, warnings };
}
