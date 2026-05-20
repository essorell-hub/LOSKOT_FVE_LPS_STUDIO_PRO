export function createProjectMilestoneV723(input = {}) {
  return {
    modelVersion: "V723",
    id: input.id || "milestone",
    title: input.title || "Project milestone",
    status: input.status || "planned",
    completedAt: input.completedAt || null,
    notes: Array.isArray(input.notes) ? input.notes.map(String) : [],
  };
}
