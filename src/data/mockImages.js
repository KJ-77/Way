/**
 * Placeholder Image Utility
 *
 * Generates inline SVG data URLs for use as placeholder images
 * when running without a backend (MOCK_MODE = true).
 *
 * Image strings in mock data use the format: "placeholder:Label:width:height"
 * This utility parses that format and generates a colored SVG.
 */

// Theme colors
const PRIMARY = "#421f19";
const SECONDARY = "#b77f6e";
const BG_COLOR = "#f3eeec";
const TEXT_COLOR = PRIMARY;

/**
 * Parse a mock image string and return a data URL
 * Format: "placeholder:Label Text:width:height"
 */
export const getPlaceholderUrl = (imageString) => {
  if (!imageString || !imageString.startsWith("placeholder:")) {
    return imageString; // Not a placeholder, return as-is
  }

  const parts = imageString.split(":");
  const label = parts[1] || "Image";
  const width = parseInt(parts[2]) || 800;
  const height = parseInt(parts[3]) || 400;

  // Escape special characters for SVG
  const escapedLabel = label
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${BG_COLOR}"/>
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="${SECONDARY}" stroke-width="1" stroke-dasharray="8,4" rx="8"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="18" fill="${TEXT_COLOR}" opacity="0.7">${escapedLabel}</text>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="12" fill="${SECONDARY}" opacity="0.5">${width} x ${height}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Check if a string is a placeholder image reference
 */
export const isPlaceholder = (imageString) => {
  return imageString && imageString.startsWith("placeholder:");
};

/**
 * Resolve an image URL — if MOCK_MODE and placeholder, generate SVG; otherwise use IMAGE_URL
 */
export const resolveImageUrl = (imageString, imageUrlBase) => {
  if (isPlaceholder(imageString)) {
    return getPlaceholderUrl(imageString);
  }
  return `${imageUrlBase}${imageString}`;
};
