import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import Input from "form/Inputs/Input";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";
import usePost from "Hooks/usePost";

import AuthContext from "Context/AuthContext";

const Login = () => {
  const email = useInput((val) => val.includes("@"));
  const password = useInput((val) => val.length >= 8);
  const {loading, error, postData } = usePost();
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state
  const navigate = useNavigate();

  const { loginHandler, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("auth/profile");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage(""); // Reset error message

    if (!email.isValid || !password.isValid) return;
    try {
      setFieldErrors({});
      const response = await postData("/auth/login", {
        email: email.value,
        password: password.value,
      });

      console.log(response);

      if (response.success) {
        const { user, token } = response.data;
        loginHandler(user, token);
        navigate("/auth/profile");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Extract the error message
      if (err?.message) {
        setErrorMessage(err.message);
      }

      // For credential errors, show under both fields
      if (
        err?.message?.toLowerCase().includes("credential") ||
        err?.message?.toLowerCase().includes("invalid") ||
        err?.message?.toLowerCase().includes("incorrect")
      ) {
        setFieldErrors({
          email: "Invalid credentials",
          password: "Invalid credentials",
        });
      }

      // For email-specific errors
      else if (err?.message?.toLowerCase().includes("email")) {
        setFieldErrors({
          ...fieldErrors,
          email: err.message,
        });
      }

      // For password-specific errors
      else if (err?.message?.toLowerCase().includes("password")) {
        setFieldErrors({
          ...fieldErrors,
          password: err.message,
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
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/auth/register"
              className="font-medium text-black hover:text-gray-800 underline"
            >
              create a new account
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
                    Login failed
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    {errorMessage ||
                      (typeof error === "string"
                        ? error
                        : "Invalid email or pasjghghgjhgjhfsword. Please try again.")}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                id="login-email"
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
                id="login-password"
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

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    to="/auth/send-verification-code"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
