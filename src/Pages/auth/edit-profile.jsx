import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import Input from "form/Inputs/Input";
import useInput from "form/Hooks/user-input";
import usePost from "Hooks/usePost";
import AuthContext from "Context/AuthContext";

const EditProfile = () => {
  const { user, token, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize inputs with current user data
  const fullName = useInput(
    (val) => val.trim().length > 0,
    user?.fullName || ""
  );
  const phoneNumber = useInput(
    (val) => val.trim().length > 0,
    user?.phoneNumber || ""
  );
  const email = useInput((val) => val.includes("@"), user?.email || "");

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

    if (!fullName.isValid || !phoneNumber.isValid || !email.isValid) return;

    try {
      setFieldErrors({});
      const response = await postData(
        "/user/profile",
        {
          fullName: fullName.value,
          phoneNumber: phoneNumber.value,
          email: email.value,
        },
        token
      );

      if (response.success) {
        setSuccessMessage("Profile updated successfully");
        updateUserProfile(response.data);

        // Navigate back to profile after a short delay
        setTimeout(() => {
          navigate("/auth/profile");
        }, 2000);
      }
    } catch (err) {
      console.error("Edit profile error:", err);

      if (err?.message) {
        setErrorMessage(err.message);
      }

      // Handle field-specific errors
      if (err?.message?.toLowerCase().includes("email")) {
        setFieldErrors({
          ...fieldErrors,
          email: err.message,
        });
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
            <p>You need to verify your email before editing your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Your Profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your personal information
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
                    Update failed
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  id="edit-fullName"
                  placeholder="Enter your full name"
                  value={fullName.value}
                  onChange={fullName.inputChangeHandler}
                  onBlur={fullName.inputBlurHandler}
                  hasError={
                    (submitted && fullName.HasError) || !!fieldErrors.fullName
                  }
                  errorMessage={
                    fieldErrors.fullName || "Full name is required."
                  }
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  id="edit-phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber.value}
                  onChange={phoneNumber.inputChangeHandler}
                  onBlur={phoneNumber.inputBlurHandler}
                  hasError={
                    (submitted && phoneNumber.HasError) ||
                    !!fieldErrors.phoneNumber
                  }
                  errorMessage={
                    fieldErrors.phoneNumber || "Phone number is required."
                  }
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                id="edit-email"
                placeholder="Enter your email"
                value={email.value}
                onChange={email.inputChangeHandler}
                onBlur={email.inputBlurHandler}
                hasError={(submitted && email.HasError) || !!fieldErrors.email}
                errorMessage={
                  fieldErrors.email || "Please enter a valid email."
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
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
