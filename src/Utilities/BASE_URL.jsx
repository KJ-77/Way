/**
 * API Configuration
 *
 * MOCK_MODE: When true, all API calls return mock data (no backend needed).
 * Set to false and update BASE_URL/IMAGE_URL when real backend is ready.
 */
export const MOCK_MODE = true;

const BASE_URL = "http://api.waybeirut.com/api";
export const IMAGE_URL = "http://localhost:5001/";

// Production:
// const BASE_URL = 'https://api.zenith-eng.site/api'
// export const IMAGE_URL = 'https://api.zenith-eng.site/'

export default BASE_URL;
