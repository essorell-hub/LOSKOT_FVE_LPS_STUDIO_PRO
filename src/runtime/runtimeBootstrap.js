import {
  createRuntimeResult
} from "./appRuntimeBridge.js";

import {
  createAppStateController
} from "./appStateController.js";

import {
  CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
  createClassicUiRuntimeAdapter
} from "./classicUiRuntimeAdapter.js";

export const RUNTIME_BOOTSTRAP_VERSION = "v43-safe-runtime-bootstrap";

function createBootstrapError(error, action = "bootstrap") {
  return createRuntimeResult({
    ok: false,
    module: "runtimeBootstrap",
    action,
    data: { version: RUNTIME_BOOTSTRAP_VERSION },
    warnings: [],
    errors: [
      {
        message: error && error.message ? error.message : String(error || "Unknown runtime bootstrap error"),
        name: error && error.name ? error.name : "RuntimeBootstrapError"
      }
    ]
  });
}

function normalizeBootstrapInput(input = {}) {
  if (input && typeof input === "object" && input.project) {
    return input;
  }
  return { project: input || {} };
}

export function createRuntimeBootstrap(input = {}) {
  try {
    const normalizedInput = normalizeBootstrapInput(input);
    const controller = input.controller || createAppStateController(normalizedInput);
    const adapter = input.adapter || createClassicUiRuntimeAdapter({ controller });

    if (!controller || typeof controller.getState !== "function") {
      return createBootstrapError(new Error("Runtime controller is missing getState()."), "createController");
    }

    if (!adapter || typeof adapter.createSnapshot !== "function") {
      return createBootstrapError(new Error("Classic UI adapter is missing createSnapshot()."), "createClassicUiAdapter");
    }

    const stateResult = controller.getState();

    if (!stateResult || stateResult.ok !== true) {
      return createRuntimeResult({
        ok: false,
        module: "runtimeBootstrap",
        action: "readInitialState",
        data: {
          version: RUNTIME_BOOTSTRAP_VERSION,
          state: stateResult && stateResult.data ? stateResult.data : null
        },
        warnings: stateResult && stateResult.warnings ? stateResult.warnings : [],
        errors: stateResult && stateResult.errors && stateResult.errors.length
          ? stateResult.errors
          : [{ message: "Initial runtime state is not available." }]
      });
    }

    const snapshotResult = adapter.createSnapshot();
    const summaryResult = typeof controller.getSummary === "function"
      ? controller.getSummary()
      : createRuntimeResult({
          module: "runtimeBootstrap",
          action: "summaryFallback",
          data: { available: false }
        });

    return createRuntimeResult({
      module: "runtimeBootstrap",
      action: "bootstrap",
      data: {
        version: RUNTIME_BOOTSTRAP_VERSION,
        runtimeReady: true,
        state: stateResult.data,
        controller,
        adapters: {
          classicUi: {
            version: CLASSIC_UI_RUNTIME_ADAPTER_VERSION,
            instance: adapter,
            snapshot: snapshotResult && snapshotResult.data ? snapshotResult.data : null
          }
        },
        summary: summaryResult && summaryResult.data ? summaryResult.data : null
      },
      warnings: [
        ...(stateResult.warnings || []),
        ...((snapshotResult && snapshotResult.warnings) || []),
        ...((summaryResult && summaryResult.warnings) || [])
      ],
      errors: []
    });
  } catch (error) {
    return createBootstrapError(error, "bootstrap");
  }
}

export function safeRuntimeBootstrap(input = {}) {
  return createRuntimeBootstrap(input);
}

export default {
  RUNTIME_BOOTSTRAP_VERSION,
  createRuntimeBootstrap,
  safeRuntimeBootstrap
};
