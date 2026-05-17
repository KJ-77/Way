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
];

// Returns true if the given URL path should bypass mock data and hit the backend.
export const isLiveEndpoint = (url) =>
  LIVE_ENDPOINT_PREFIXES.some((prefix) => url === prefix || url.startsWith(`${prefix}/`));

// Convenience: should this URL use mock data?
export const shouldUseMock = (url) => MOCK_MODE && !isLiveEndpoint(url);

const BASE_URL = "https://tf1qfc4d6l.execute-api.eu-west-3.amazonaws.com";
export const IMAGE_URL = "";

export default BASE_URL;
