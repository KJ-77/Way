import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";

import Input from "form/Inputs/Input";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";
import usePost from "Hooks/usePost";

import AuthContext from "Context/AuthContext";

const Register = () => {
  const fullName = useInput((val) => val.trim().length > 0);
  const phoneNumber = useInput((val) => val.trim().length > 0);
  const email = useInput((val) => val.includes("@"));
  const password = useInput((val) => val.length >= 8);
  const confirmPassword = useInput(
    (val) => val === password.value && val.length >= 8
  );
  const {loading, error, postData } = usePost();
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // Add this line
  const navigate = useNavigate();

  const { loginHandler, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/auth/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage(""); // Reset error message

    if (
      !fullName.isValid ||
      !phoneNumber.isValid ||
      !email.isValid ||
      !password.isValid ||
      !confirmPassword.isValid
    )
      return;
    try {
      setFieldErrors({});
      const response = await postData("/auth/register", {
        fullName: fullName.value,
        phoneNumber: phoneNumber.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });

      loginHandler(response.data.user, response.data.token);

      // Save user data and token using context

      // Show verification modal instead of redirecting immediately
    } catch (err) {
      console.error("Registration error:", err);

      // Extract the error message
      if (err?.message) {
        setErrorMessage(err.message);
      }

      // For email-related errors, show them under the email field
      if (err?.message?.toLowerCase().includes("email")) {
        setFieldErrors({
          ...fieldErrors,
          email: err.message,
        });
      }

      // If the error response contains field-specific errors
      if (err?.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-black hover:text-gray-800 underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8">
          {(error || errorMessage) && (
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
                    Registration failed
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
          )}
          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  id="register-fullName"
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
                  id="register-phoneNumber"
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
                id="register-email"
                placeholder="Enter your email"
                value={email.value}
                onChange={email.inputChangeHandler}
                onBlur={email.inputBlurHandler}
                hasError={(submitted && email.HasError) || !!fieldErrors.email}
                errorMessage={
                  fieldErrors.email || "Please enter a valid email."
                }
              />

              <PasswordInput
                label="Password"
                name="password"
                id="register-password"
                placeholder="Enter your password"
                value={password.value}
                onChange={password.inputChangeHandler}
                onBlur={password.inputBlurHandler}
                hasError={
                  (submitted && password.HasError) || !!fieldErrors.password
                }
                errorMessage={
                  fieldErrors.password ||
                  "Password must be at least 8 characters."
                }
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                id="register-confirmPassword"
                placeholder="Confirm your password"
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

              <Button
                onClick={handleSubmit}
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
