import { createContext, useState, useEffect, useCallback, useRef } from "react";
import {
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { userPool } from "../lib/cognito";

const AuthContext = createContext();

// Builds the shape of `user` exposed to consumers from a valid Cognito session.
// Includes both Cognito-native fields (sub, email, name, groups) AND alias fields
// (fullName) for backwards-compat with pages written against the old mock auth.
const parseUserFromSession = (session) => {
  const payload = session.getIdToken().decodePayload();
  let groups = [];
  const rawGroups = payload["cognito:groups"];
  if (Array.isArray(rawGroups)) groups = rawGroups;
  else if (typeof rawGroups === "string") groups = [rawGroups];

  return {
    sub: payload.sub,
    email: payload.email || "",
    name: payload.name || "",
    fullName: payload.name || "", // alias for legacy callers
    phone: payload.phone_number || "",
    phoneNumber: payload.phone_number || "", // alias for legacy callers
    groups,
    verified: payload.email_verified === true || payload.email_verified === "true",
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsNewPassword, setNeedsNewPassword] = useState(false);

  // CognitoUser instance held across the new-password-required challenge so
  // completeNewPassword() can finish the same auth flow that started the challenge.
  const cognitoUserRef = useRef(null);
  const userAttrsRef = useRef(null);

  // Restore session on mount — checks Cognito's localStorage for a stored
  // refresh token and pulls a fresh ID token if one exists.
  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    currentUser.getSession((err, session) => {
      if (err || !session?.isValid()) {
        setIsLoading(false);
        return;
      }
      setUser(parseUserFromSession(session));
      setIsLoading(false);
    });
  }, []);

  // Returns one of: { status: "success" } | { status: "new_password_required" } | { status: "error", message }
  // FORCE_CHANGE_PASSWORD is the default state for any client that was admin-created
  // (instead of self-signed-up). We catch the newPasswordRequired challenge and let
  // the UI render a "set a new password" form, then completeNewPassword() finishes it.
  const login = useCallback((username, password) => {
    return new Promise((resolve) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
      cognitoUserRef.current = cognitoUser;

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setUser(parseUserFromSession(session));
          setNeedsNewPassword(false);
          resolve({ status: "success" });
        },
        onFailure: (err) => {
          resolve({ status: "error", message: err.message || "Authentication failed" });
        },
        newPasswordRequired: (userAttributes) => {
          userAttrsRef.current = userAttributes;
          setNeedsNewPassword(true);
          resolve({ status: "new_password_required" });
        },
      });
    });
  }, []);

  // Finishes the FORCE_CHANGE_PASSWORD challenge for admin-created accounts on first login.
  const completeNewPassword = useCallback((newPassword) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = cognitoUserRef.current;
      if (!cognitoUser) return reject(new Error("No active auth session"));

      // Strip attributes Cognito rejects in this challenge (read-only or already set)
      const attrs = { ...userAttrsRef.current };
      delete attrs.email_verified;
      delete attrs.phone_number_verified;
      delete attrs.sub;
      delete attrs.email;
      delete attrs.phone_number;

      cognitoUser.completeNewPasswordChallenge(newPassword, attrs, {
        onSuccess: (session) => {
          setUser(parseUserFromSession(session));
          setNeedsNewPassword(false);
          resolve();
        },
        onFailure: (err) => {
          reject(new Error(err.message || "Failed to set new password"));
        },
      });
    });
  }, []);

  // Confirms a fresh signup with the 6-digit code Cognito emails to the user.
  // After this resolves, the user can log in.
  const confirmSignUp = useCallback((username, code) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
      cognitoUser.confirmRegistration(code, true, (err) => {
        if (err) return reject(new Error(err.message || "Failed to verify code"));
        resolve();
      });
    });
  }, []);

  // Resends the signup verification code (e.g. user didn't receive the first email).
  const resendConfirmationCode = useCallback((username) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
      cognitoUser.resendConfirmationCode((err) => {
        if (err) return reject(new Error(err.message || "Failed to resend code"));
        resolve();
      });
    });
  }, []);

  // Step 1 of the forgot-password flow — emails a 6-digit code to the user.
  const forgotPassword = useCallback((username) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
      cognitoUser.forgotPassword({
        onSuccess: () => resolve(),
        onFailure: (err) => reject(new Error(err.message || "Failed to send reset code")),
      });
    });
  }, []);

  // Step 2 of the forgot-password flow — verifies the code and sets the new password.
  const confirmForgotPassword = useCallback((username, code, newPassword) => {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => resolve(),
        onFailure: (err) => reject(new Error(err.message || "Failed to reset password")),
      });
    });
  }, []);

  const logoutHandler = useCallback(() => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) currentUser.signOut();
    setUser(null);
    setNeedsNewPassword(false);
    cognitoUserRef.current = null;
    userAttrsRef.current = null;
  }, []);

  // Legacy shim — old pages call loginHandler(user, token) after their own API roundtrip.
  // New flow runs login() which manages state internally, so this is a no-op kept for
  // back-compat with any caller we haven't migrated yet.
  const loginHandler = useCallback(() => {
    console.warn("loginHandler is deprecated; pages should call login(email, password) instead");
  }, []);

  // Legacy shim — merges fields into the local user object. Real persistence happens
  // via a backend PUT /users/:id call (TBD when edit-profile is rewired).
  const updateUserProfile = useCallback((data) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        // State
        user,
        isLoggedIn: !!user,
        isLoading,
        needsNewPassword,
        // New Cognito-backed actions
        login,
        completeNewPassword,
        confirmSignUp,
        resendConfirmationCode,
        forgotPassword,
        confirmForgotPassword,
        // Legacy API kept for unmigrated consumers
        loginHandler,
        logoutHandler,
        updateUserProfile,
        token: null, // legacy field — use apiFetch() from lib/api.js instead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
