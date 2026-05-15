/**
 * API Configuration
 *
 * MOCK_MODE: When true, all API calls return mock data (no backend needed).
 * Flip to false (or remove the MOCK_MODE branches feature-by-feature) as each
 * endpoint gets wired to the real serverless backend.
 *
 * BASE_URL points at the Way-Backend API Gateway (AWS Lambda + HTTP API v2).
 * IMAGE_URL is unused for now — real image hosting (likely S3 + CloudFront) is
 * still TBD; while in mock mode, images come from inline SVG placeholders.
 */
export const MOCK_MODE = true;

const BASE_URL = "https://tf1qfc4d6l.execute-api.eu-west-3.amazonaws.com";
export const IMAGE_URL = "";

export default BASE_URL;
