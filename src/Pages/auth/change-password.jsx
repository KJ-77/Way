import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";
import usePost from "Hooks/usePost";
import AuthContext from "Context/AuthContext";

const ChangePassword = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const oldPassword = useInput((val) => val.length >= 8);
  const newPassword = useInput((val) => val.length >= 8);
  const confirmPassword = useInput(
    (val) => val === newPassword.value && val.length >= 8
  );

  const { loading, error, postData } = usePost();
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if user is not logged in or not verified
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else if (!user.verified) {
      navigate("/auth/profile");
    }
  }, [user, navigate]);

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
      setFieldErrors({});
      const response = await postData(
        "/user/change-password",
        {
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        },
        token
      );

      if (response.success) {
        setSuccessMessage("Password changed successfully");

        // Clear form
        oldPassword.reset();
        newPassword.reset();
        confirmPassword.reset();

        // Navigate back to profile after a short delay
        setTimeout(() => {
          navigate("/auth/profile");
        }, 2000);
      }
    } catch (err) {
      console.error("Change password error:", err);

      if (err?.message) {
        setErrorMessage(err.message);
      }

      // For password-specific errors
      if (err?.message?.toLowerCase().includes("password")) {
        if (err?.message?.toLowerCase().includes("old")) {
          setFieldErrors({
            ...fieldErrors,
            oldPassword: "Incorrect current password.",
          });
        } else if (err?.message?.toLowerCase().includes("new")) {
          setFieldErrors({
            ...fieldErrors,
            newPassword: err.message,
          });
        } else if (err?.message?.toLowerCase().includes("confirm")) {
          setFieldErrors({
            ...fieldErrors,
            confirmPassword: err.message,
          });
        } else {
          setFieldErrors({
            ...fieldErrors,
            newPassword: err.message,
          });
        }
      }

      if (err?.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
    }
  };

  if (!user || !user.verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
            <p>You need to verify your email before changing your password.</p>
          </div>
        </div>
      </div>
    );
  }

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
          {error || errorMessage ? (
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
                  <div className="mt-1 text-sm text-red-700">
                    {errorMessage ||
                      (typeof error === "string"
                        ? error
                        : "Please check your information and try again.")}
                  </div>
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
