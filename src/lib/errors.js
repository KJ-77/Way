// Centralized error translator for Way-Client. Mirrors the structure of
// Way-Admin/src/lib/errors.ts but without i18n — plain English strings only.
//
// Backend always returns errors in the shape:
//   { error: string, code: string, message: string, issues?: [...] }
// See Way-Backend/src/lib/response.ts for the source of truth.

// Typed error thrown by hooks via throwIfNotOk. Surfaces backend `code` so call
// sites can branch (e.g. show field-specific inline error for PHONE_TAKEN).
export class ApiError extends Error {
  constructor({ status, code, message, issues, raw }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code ?? null;
    this.issues = issues ?? null;
    this.raw = raw ?? null;
  }
}

// Throws ApiError if response is not OK. Otherwise returns silently.
// Use after a fetch() call where you want a unified error shape:
//   const res = await fetch(...);
//   await throwIfNotOk(res, "Sign-up failed");
export async function throwIfNotOk(response, fallbackMessage) {
  if (response.ok) return;

  const body = await response.json().catch(() => null);

  const message =
    body?.message ||
    body?.issues?.map((i) => `${(i.path || []).join(".")}: ${i.message}`).join(", ") ||
    body?.error ||
    fallbackMessage ||
    "Something went wrong.";

  throw new ApiError({
    status: response.status,
    code: body?.code,
    message,
    issues: body?.issues,
    raw: body,
  });
}

// User-friendly strings keyed by backend code (see Way-Backend/src/lib/response.ts).
const CODE_MESSAGES = {
  PHONE_TAKEN: "This phone number is already registered to another account.",
  EMAIL_TAKEN: "This email is already in use by another account.",
  DUPLICATE: "This entry already exists.",
  FK_VIOLATION: "Can't complete this — another record depends on this data.",
  SCHEDULE_CONFLICT: "Another class is already scheduled during this time slot.",
  USERNAME_EXISTS: "An account already exists with these details.",
  USER_NOT_FOUND: "We couldn't find that account.",
  INVALID_CREDENTIALS: "Wrong email or password. Please try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again in a moment.",
  DUPLICATE_BOOKING: "You're already booked for this class.",
  DB_INSERT_FAILED: "We couldn't finish creating your account. Please try again.",
  ROLLBACK_FAILED:
    "Your account was partly created but didn't finish saving. Please contact support before trying again.",
};

// Fallback strings for generic HTTP statuses when no code is set.
const STATUS_MESSAGES = {
  400: "Something in the request was invalid. Please check the form and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do this.",
  404: "We couldn't find what you were looking for.",
  409: "This conflicts with existing data.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again in a moment.",
  502: "The server is temporarily unavailable. Please try again shortly.",
  503: "The server is temporarily unavailable. Please try again shortly.",
  504: "The server took too long to respond. Please try again.",
};

const UNKNOWN_FALLBACK =
  "Something went wrong. Please try again, or contact support if this keeps happening.";

// Translates any error into a user-facing string. Always logs raw to console first
// so devtools sees the unmodified error.
//
// Resolution order:
//   1. CODE_MESSAGES[error.code]
//   2. STATUS_MESSAGES[error.status]
//   3. error.message (better than nothing)
//   4. fallbackMessage param
//   5. UNKNOWN_FALLBACK
//
// Accepts either a thrown ApiError/Error or a plain parsed response body of the
// shape `{ ...data, status }` — register.jsx reads the body itself instead of
// going through throwIfNotOk, so it hands us an object literal.
export function friendlyError(err, fallbackMessage) {
  console.error("[friendlyError]", err);

  // Network failure (fetch throws TypeError when the request can't leave the browser)
  if (err instanceof TypeError && /fetch|network|failed to fetch/i.test(err.message)) {
    return "Couldn't reach the server. Check your internet connection and try again.";
  }

  // Read `code`/`status` structurally rather than gating on `instanceof ApiError`.
  // A plain body object carries exactly the same two fields, and requiring the
  // class meant those callers skipped both lookups and fell straight through to
  // the generic fallback — throwing away the backend's error taxonomy.
  if (err?.code && CODE_MESSAGES[err.code]) return CODE_MESSAGES[err.code];
  if (err?.status && STATUS_MESSAGES[err.status]) return STATUS_MESSAGES[err.status];

  // An ApiError's message is already the backend's human-readable string, so it
  // beats the caller's generic fallback. A bare Error's message usually isn't.
  if (err instanceof ApiError && err.message) return err.message;

  if (err instanceof Error && err.message) {
    return fallbackMessage || err.message;
  }

  return fallbackMessage || UNKNOWN_FALLBACK;
}
