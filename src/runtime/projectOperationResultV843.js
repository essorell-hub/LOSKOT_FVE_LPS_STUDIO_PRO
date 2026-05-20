function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function createProjectOperationResultV843({
  ok = true,
  data = null,
  warnings = [],
  errors = [],
  qaFindings = [],
  operationLog = []
} = {}) {
  const normalizedErrors = asArray(errors);
  const normalizedQa = asArray(qaFindings);
  const hasBlockingQa = normalizedQa.some((finding) => ["BLOCKER", "ERROR"].includes(finding.severity));
  return {
    ok: Boolean(ok) && normalizedErrors.length === 0 && !hasBlockingQa,
    data,
    warnings: asArray(warnings),
    errors: normalizedErrors,
    qaFindings: normalizedQa,
    operationLog: asArray(operationLog)
  };
}

export function mergeProjectOperationResultsV843(results = [], data = null) {
  return createProjectOperationResultV843({
    ok: results.every((result) => result?.ok),
    data,
    warnings: results.flatMap((result) => asArray(result?.warnings)),
    errors: results.flatMap((result) => asArray(result?.errors)),
    qaFindings: results.flatMap((result) => asArray(result?.qaFindings)),
    operationLog: results.flatMap((result) => asArray(result?.operationLog))
  });
}

export function resultFromExceptionV843(error, context = {}) {
  return createProjectOperationResultV843({
    ok: false,
    data: context.data || null,
    errors: [{
      code: "UNHANDLED_OPERATION_EXCEPTION",
      message: error?.message || String(error),
      commandType: context.commandType || null
    }],
    operationLog: [{
      event: "exception-captured",
      commandType: context.commandType || null
    }]
  });
}
