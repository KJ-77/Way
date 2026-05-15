import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import Input from "form/Inputs/Input";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";

import AuthContext from "Context/AuthContext";

const Login = () => {
  // Cognito's username on this pool is phone OR email — we collect email here
  // since that's the auto-verified attribute and the most natural login UX.
  const email = useInput((val) => val.includes("@"));
  const password = useInput((val) => val.length >= 8);

  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // FORCE_CHANGE_PASSWORD state — only happens for admin-created clients who
  // haven't logged in yet. They land in this challenge and must pick a new password.
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();
  const { login, completeNewPassword, needsNewPassword, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/auth/account");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage("");

    if (!email.isValid || !password.isValid) return;

    setLoading(true);
    setFieldErrors({});

    const result = await login(email.value.trim().toLowerCase(), password.value);
    setLoading(false);

    if (result.status === "success") {
      navigate("/auth/account");
      return;
    }

    if (result.status === "new_password_required") {
      // The needsNewPassword flag in context will flip the UI to the
      // change-password form below.
      return;
    }

    // Error: surface either as field-level or top-level message based on heuristics
    const msg = result.message || "Authentication failed";
    setErrorMessage(msg);
    if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("incorrect")) {
      setFieldErrors({ password: "Incorrect email or password" });
    } else if (msg.toLowerCase().includes("user") || msg.toLowerCase().includes("not exist")) {
      setFieldErrors({ email: "No account found with this email" });
    } else if (msg.toLowerCase().includes("not confirmed")) {
      // User signed up but never entered the verification code — bounce them to verify.
      navigate(`/auth/verify?email=${encodeURIComponent(email.value.trim().toLowerCase())}`);
    }
  };

  const handleCompleteNewPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await completeNewPassword(newPassword);
      navigate("/auth/account");
    } catch (err) {
      setErrorMessage(err.message || "Failed to set new password.");
    }
    setLoading(false);
  };

  // FORCE_CHANGE_PASSWORD view — replaces the login form for admin-created accounts
  if (needsNewPassword) {
    return (
      <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Set a new password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your account was created by an admin. Please choose a new password to continue.
            </p>
          </div>

          <div className="mt-8">
            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
              <form className="space-y-6" onSubmit={handleCompleteNewPassword}>
                <PasswordInput
                  label="New password"
                  name="newPassword"
                  id="new-password"
                  placeholder="Choose a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  hasError={false}
                />
                <PasswordInput
                  label="Confirm new password"
                  name="confirmNewPassword"
                  id="confirm-new-password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  hasError={false}
                />

                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  {loading ? "Saving..." : "Set new password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/auth/register" className="font-medium text-black hover:text-gray-800 underline">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8">
          {errorMessage && (
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
                  <h3 className="text-sm font-medium text-red-800">Login failed</h3>
                  <div className="mt-1 text-sm text-red-700">{errorMessage}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                errorMessage={fieldErrors.email || "Please enter a valid email."}
              />
              <PasswordInput
                label="Password"
                name="password"
                id="login-password"
                placeholder="Enter your password"
                value={password.value}
                onChange={password.inputChangeHandler}
                onBlur={password.inputBlurHandler}
                hasError={(submitted && password.HasError) || !!fieldErrors.password}
                errorMessage={fieldErrors.password || "Password must be at least 8 characters."}
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

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
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
