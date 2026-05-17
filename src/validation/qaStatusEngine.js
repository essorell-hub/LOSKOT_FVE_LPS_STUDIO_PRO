import {
    VALIDATION_STATUS,
    validateBasicProject,
} from './basicProjectValidation.js';
import {
    validateProjectReferences,
} from './referenceValidation.js';

// Define QA statuses, including custom ones for this engine
const QA_STATUS = {
    ...VALIDATION_STATUS, // Inherit OK, ERROR, WARNING, INFO
    CRITICAL: "CRITICAL",
    PENDING: "PENDING",
    UNKNOWN: "UNKNOWN",
};

/**
 * Determines the worst status among a list of statuses.
 * Order: CRITICAL > ERROR > WARNING > INFO > OK > PENDING > UNKNOWN
 * @param {string[]} statuses - An array of QA_STATUS strings.
 * @returns {string} The worst status found.
 */
function getWorstStatus(statuses) {
    const statusOrder = [
        QA_STATUS.CRITICAL,
        QA_STATUS.ERROR,
        QA_STATUS.WARNING,
        QA_STATUS.INFO,
        QA_STATUS.OK,
        QA_STATUS.PENDING,
        QA_STATUS.UNKNOWN,
    ];

    let worstStatus = QA_STATUS.UNKNOWN; // Default if no statuses or all are unknown

    for (const status of statuses) {
        if (statusOrder.includes(status)) {
            if (worstStatus === QA_STATUS.UNKNOWN || statusOrder.indexOf(status) < statusOrder.indexOf(worstStatus)) {
                worstStatus = status;
            }
        }
    }
    return worstStatus;
}

/**
 * Builds a human-readable summary string from validation results.
 * @param {object} results - An object containing validation results (e.g., errors, warnings).
 * @returns {string} A summary string.
 */
function buildQaSummary(results) {
    const parts = [];
    if (results.errors && results.errors.length > 0) {
        parts.push(`${results.errors.length} Error(s)`);
    }
    if (results.warnings && results.warnings.length > 0) {
        parts.push(`${results.warnings.length} Warning(s)`);
    }
    if (results.info && results.info.length > 0) {
        parts.push(`${results.info.length} Info(s)`);
    }
    if (parts.length === 0) {
        return "All checks passed.";
    }
    return parts.join(', ');
}

/**
 * Runs comprehensive QA checks on a project object.
 * @param {object} project - The project object to validate.
 * @returns {object} An object containing the overall QA status and detailed results.
 */
function runProjectQa(project) {
    const createdAt = new Date().toISOString();
    let ok = true;
    let status = QA_STATUS.PENDING;
    const errors = [];
    const warnings = [];
    const info = [];
    const checks = {}; // To store results of individual validation steps

    // 1. Basic Project Validation
    let basicValidationResult;
    try {
        basicValidationResult = validateBasicProject(project);
        checks.basicValidation = {
            status: basicValidationResult.status,
            summary: basicValidationResult.summary,
            issues: [...basicValidationResult.errors, ...basicValidationResult.warnings, ...basicValidationResult.info],
        };
        if (basicValidationResult.status === QA_STATUS.ERROR) {
            errors.push(...basicValidationResult.errors);
            warnings.push(...basicValidationResult.warnings);
            info.push(...basicValidationResult.info);
            ok = false;
        } else if (basicValidationResult.status === QA_STATUS.WARNING) {
            warnings.push(...basicValidationResult.warnings);
            info.push(...basicValidationResult.info);
            // 'ok' remains true if only warnings
        } else {
            info.push(...basicValidationResult.info);
        }
    } catch (e) {
        console.error("Error during basic project validation:", e);
        errors.push({ type: QA_STATUS.CRITICAL, message: "Failed to run basic project validation.", detail: e.message });
        ok = false;
        checks.basicValidation = { status: QA_STATUS.CRITICAL, error: e.message };
    }

    // 2. Project Reference Validation (only run if basic validation didn't critically fail)
    let referenceValidationResult = { ok: true, status: QA_STATUS.OK, errors: [], warnings: [], info: [], summary: "Skipped" };
    if (project && ok) { // Check if project object is valid and no critical errors yet
        try {
            referenceValidationResult = validateProjectReferences(project);
            checks.referenceValidation = {
                status: referenceValidationResult.status,
                summary: referenceValidationResult.summary,
                issues: [...referenceValidationResult.errors, ...referenceValidationResult.warnings],
            };
            if (referenceValidationResult.status === QA_STATUS.ERROR) {
                errors.push(...referenceValidationResult.errors);
                warnings.push(...referenceValidationResult.warnings);
                ok = false;
            } else if (referenceValidationResult.status === QA_STATUS.WARNING) {
                warnings.push(...referenceValidationResult.warnings);
                // 'ok' remains true if only warnings
            }
        } catch (e) {
            console.error("Error during project reference validation:", e);
            errors.push({ type: QA_STATUS.CRITICAL, message: "Failed to run project reference validation.", detail: e.message });
            ok = false;
            checks.referenceValidation = { status: QA_STATUS.CRITICAL, error: e.message };
        }
    } else {
        checks.referenceValidation = { status: QA_STATUS.PENDING, summary: "Skipped due to earlier critical errors." };
    }

    // Determine overall status based on collected issues
    const allStatuses = [
        basicValidationResult ? basicValidationResult.status : QA_STATUS.UNKNOWN,
        referenceValidationResult ? referenceValidationResult.status : QA_STATUS.UNKNOWN,
        // Add statuses from other checks here
    ];
    status = getWorstStatus(allStatuses);
    ok = status === QA_STATUS.OK || status === QA_STATUS.INFO || status === QA_STATUS.WARNING; // OK, INFO, WARNING are considered 'ok' for the overall flag

    // Calculate a simple score (e.g., percentage of checks passed or a weighted score)
    // For now, a basic score based on the number of errors/warnings
    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(c => c.status === QA_STATUS.OK).length;
    const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

    // Combine all issues for the final result
    const allErrors = errors;
    const allWarnings = warnings;
    const allInfo = info;

    const summary = buildQaSummary({ errors: allErrors, warnings: allWarnings, info: allInfo });

    return {
        ok: ok,
        status: status,
        score: score,
        errors: allErrors,
        warnings: allWarnings,
        info: allInfo,
        checks: checks, // Detailed results per check
        summary: summary,
        createdAt: createdAt,
    };
}

export {
    QA_STATUS,
    getWorstStatus,
    buildQaSummary,
    runProjectQa,
};
