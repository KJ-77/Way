/**
 * API Configuration
 *
 * MOCK_MODE: When true, API calls return mock data (no backend needed) UNLESS
 * the endpoint is in LIVE_ENDPOINTS. We flip endpoints to live one at a time
 * as each is wired up to the real serverless backend.
 *
 * BASE_URL points at the Way-Backend API Gateway (AWS Lambda + HTTP API v2).
 * IMAGE_URL is unused for now — real image hosting (likely S3 + CloudFront) is
 * still TBD; while in mock mode, images come from inline SVG placeholders.
 */
export const MOCK_MODE = true;

// Endpoints that ALWAYS hit the real backend, even when MOCK_MODE is true.
// Match against the leading path segment so e.g. `/schedule/123` also goes live.
const LIVE_ENDPOINT_PREFIXES = [
  "/schedule",
  "/packages",
  "/sessions",
  "/items",
];

// Returns true if the given URL path should bypass mock data and hit the backend.
// Strips any query string first so e.g. `/schedule?week=2026-05-25` still matches
// the `/schedule` prefix — without this, query-string URLs would fall through to
// mock mode and silently return empty data.
export const isLiveEndpoint = (url) => {
  const path = url.split("?")[0];
  return LIVE_ENDPOINT_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
};

// Convenience: should this URL use mock data?
export const shouldUseMock = (url) => MOCK_MODE && !isLiveEndpoint(url);

const BASE_URL = "https://tf1qfc4d6l.execute-api.eu-west-3.amazonaws.com";
export const IMAGE_URL = "";

export default BASE_URL;
