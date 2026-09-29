import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";
import AuthContext from "Context/AuthContext";

// Changes the password for real, through Cognito (AuthContext.changePassword).
// Until 2026-09-28 this page posted to a mock endpoint and showed "Password changed
// successfully" while the old password kept working.
//
// Signed-out visitors never reach it: the route is wrapped in <ProtectedRoute>
// (App.jsx). There's no "verify your email first" gate any more — Cognito doesn't
// need one, and it locked out every client created without an email address.
const ChangePassword = () => {
  const { changePassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const oldPassword = useInput((val) => val.length >= 8);
  const newPassword = useInput((val) => val.length >= 8);
  const confirmPassword = useInput(
    (val) => val === newPassword.value && val.length >= 8
  );

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !oldPassword.isValid ||
      !newPassword.isValid ||
      !confirmPassword.isValid
    )
      return;

    if (newPassword.value === oldPassword.value) {
      setFieldErrors({
        ...fieldErrors,
        newPassword: "New password cannot be the same as old password.",
      });
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});
      await changePassword(oldPassword.value, newPassword.value);

      setSuccessMessage("Password changed successfully");

      // Clear form
      oldPassword.reset();
      newPassword.reset();
      confirmPassword.reset();

      // Navigate back to profile after a short delay
      setTimeout(() => {
        navigate("/auth/account");
      }, 2000);
    } catch (err) {
      console.error("Change password error:", err);

      // Cognito names the failure precisely, so point at the field it's about.
      if (err.code === "NotAuthorizedException" && /incorrect/i.test(err.message)) {
        // Wrong current password ("Incorrect username or password.").
        setFieldErrors({ oldPassword: "Incorrect current password." });
      } else if (err.code === "InvalidPasswordException" || err.code === "InvalidParameterException") {
        // The new password breaks the pool's rules — Cognito's text says which.
        setFieldErrors({ newPassword: err.message });
      } else if (err.code === "LimitExceededException") {
        setErrorMessage("Too many attempts. Please wait a few minutes and try again.");
      } else {
        // Expired session, network failure, anything else.
        setErrorMessage(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your password regularly for better security
          </p>
        </div>

        <div className="mt-8">
          {errorMessage ? (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Password change failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">{errorMessage}</div>
                </div>
              </div>
            </div>
          ) : null}

          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Success
                  </h3>
                  <div className="mt-1 text-sm text-green-700">
                    {successMessage}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6">
              <PasswordInput
                label="Current Password"
                name="oldPassword"
                id="current-password"
                placeholder="Enter your current password"
                value={oldPassword.value}
                onChange={oldPassword.inputChangeHandler}
                onBlur={oldPassword.inputBlurHandler}
                hasError={
                  (submitted && oldPassword.HasError) ||
                  !!fieldErrors.oldPassword
                }
                errorMessage={
                  fieldErrors.oldPassword ||
                  "Password must be at least 8 characters."
                }
              />

              <PasswordInput
                label="New Password"
                name="newPassword"
                id="new-password"
                placeholder="Enter your new password"
                value={newPassword.value}
                onChange={newPassword.inputChangeHandler}
                onBlur={newPassword.inputBlurHandler}
                hasError={
                  (submitted && newPassword.HasError) ||
                  !!fieldErrors.newPassword
                }
                errorMessage={
                  fieldErrors.newPassword ||
                  "Password must be at least 8 characters."
                }
              />

              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                id="confirm-new-password"
                placeholder="Confirm your new password"
                value={confirmPassword.value}
                onChange={confirmPassword.inputChangeHandler}
                onBlur={confirmPassword.inputBlurHandler}
                hasError={
                  (submitted && confirmPassword.HasError) ||
                  !!fieldErrors.confirmPassword
                }
                errorMessage={
                  fieldErrors.confirmPassword || "Passwords must match."
                }
              />

              <div className="flex justify-between space-x-4">
                <Button
                  onClick={() => navigate("/auth/profile")}
                  variant="secondary"
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
