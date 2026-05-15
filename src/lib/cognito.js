import { CognitoUserPool } from "amazon-cognito-identity-js";

// Singleton CognitoUserPool — used by AuthContext for session restoration,
// login (SRP), and forgot-password flows. Configured against the client pool
// (WayBeirut-Clients), separate from the admin pool that Way-Admin uses.
export const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});
