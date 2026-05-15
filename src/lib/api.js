import { userPool } from "./cognito";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Resolves the current Cognito ID token, refreshing if needed.
// Returns null when no session exists (user not logged in).
const getToken = () =>
  new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) return resolve(null);

    cognitoUser.getSession((err, session) => {
      if (err || !session?.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });

/**
 * Authenticated fetch wrapper.
 *
 * Attaches `Authorization: Bearer <idToken>` when the user has a valid session,
 * sets Content-Type to JSON, and resolves URLs against VITE_API_BASE_URL.
 *
 * Pass an absolute URL or relative path: `apiFetch("/users/me")` →
 * `https://...amazonaws.com/users/me`.
 */
export const apiFetch = async (path, options = {}) => {
  const token = await getToken();

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
};

export { API_BASE_URL };
