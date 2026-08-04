import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";

import Input from "form/Inputs/Input";
import PasswordInput from "form/Inputs/PasswordInput";
import useInput from "form/Hooks/user-input";

import AuthContext from "Context/AuthContext";
import { apiFetch } from "../../lib/api";
import { friendlyError } from "../../lib/errors";

// Values match the `referral_source` enum on the backend users table.
// Labels are what the user sees in the dropdown.
const REFERRAL_OPTIONS = [
  { value: "Referral", label: "Referral (friend, family, etc.)" },
  { value: "SCM", label: "Social media" },
  { value: "Walk-In", label: "Walked by the studio" },
];

// Cognito client pool policy: min 8 chars, requires upper + lower + digit.
// We mirror that here so users get inline feedback before the server rejects.
const isPasswordStrong = (val) =>
  val.length >= 8 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val);

const Register = () => {
  const fullName = useInput((val) => val.trim().length > 0);
  const phoneNumber = useInput((val) => val.trim().length >= 7);
  const email = useInput((val) => val.includes("@"));
  const password = useInput(isPasswordStrong);
  const confirmPassword = useInput((val) => val === password.value && isPasswordStrong(val));

  const [referralSource, setReferralSource] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/auth/account");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage("");
    setFieldErrors({});

    if (
      !fullName.isValid ||
      !phoneNumber.isValid ||
      !email.isValid ||
      !password.isValid ||
      !confirmPassword.isValid
    ) {
      return;
    }

    if (!referralSource) {
      setFieldErrors({ referralSource: "Please select how you heard about us." });
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.value.trim().toLowerCase();
      const normalizedPhone = phoneNumber.value.replace(/\s+/g, "");

      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName.value.trim(),
          phone: normalizedPhone,
          email: normalizedEmail,
          password: password.value,
          referral_source: referralSource,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Backend-emitted code → field-specific inline error (preferred path)
        if (data?.code === "PHONE_TAKEN") {
          setFieldErrors({ phoneNumber: "An account with this phone number already exists." });
        } else if (data?.code === "EMAIL_TAKEN" || data?.code === "USERNAME_EXISTS") {
          setFieldErrors({ email: "An account with this email already exists." });
        } else if (data?.issues) {
          // Zod errors — assign by path
          const issues = {};
          for (const issue of data.issues) {
            const field = issue.path?.[0];
            if (field) issues[field] = issue.message;
          }
          setFieldErrors({
            fullName: issues.full_name,
            phoneNumber: issues.phone,
            email: issues.email,
            password: issues.password,
            referralSource: issues.referral_source,
          });
        } else {
          // Anything else falls through to the wildcard / generic banner
          setErrorMessage(friendlyError({ ...data, status: response.status }, "Sign up failed. Please try again."));
        }
        return;
      }

      // Success — send the user to the verification screen with their email so
      // confirmRegistration() knows which Cognito user to confirm.
      navigate(`/auth/verify?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (err) {
      console.error("Sign up error", err);
      setErrorMessage(friendlyError(err, "Network error. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-black hover:text-gray-800 underline">
              Sign in
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
                  <h3 className="text-sm font-medium text-red-800">Registration failed</h3>
                  <div className="mt-1 text-sm text-red-700">{errorMessage}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  hasError={(submitted && fullName.HasError) || !!fieldErrors.fullName}
                  errorMessage={fieldErrors.fullName || "Full name is required."}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  id="register-phoneNumber"
                  placeholder="+961 12 345 678"
                  value={phoneNumber.value}
                  onChange={phoneNumber.inputChangeHandler}
                  onBlur={phoneNumber.inputBlurHandler}
                  hasError={(submitted && phoneNumber.HasError) || !!fieldErrors.phoneNumber}
                  errorMessage={fieldErrors.phoneNumber || "Include your country code, e.g. +961…"}
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
                errorMessage={fieldErrors.email || "Please enter a valid email."}
              />

              {/* The password rules live under the field as a red hint rather
                  than as in-field placeholder text — the requirements stay
                  readable while the user is actually typing a password. */}
              <PasswordInput
                label="Password"
                name="password"
                id="register-password"
                value={password.value}
                onChange={password.inputChangeHandler}
                onBlur={password.inputBlurHandler}
                hasError={(submitted && password.HasError) || !!fieldErrors.password}
                errorMessage={
                  fieldErrors.password ||
                  "Min 8 chars with at least one uppercase, lowercase, and number."
                }
                hint="Min 8 chars with at least one uppercase, lowercase, and number."
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                id="register-confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword.value}
                onChange={confirmPassword.inputChangeHandler}
                onBlur={confirmPassword.inputBlurHandler}
                hasError={(submitted && confirmPassword.HasError) || !!fieldErrors.confirmPassword}
                errorMessage={fieldErrors.confirmPassword || "Passwords must match."}
              />

              {/* Referral source is required by the backend / DB schema */}
              <div className="flex gap-y-1 flex-col w-full">
                <label
                  htmlFor="register-referralSource"
                  className="capitalize font-text"
                >
                  How did you hear about us?
                </label>
                <select
                  id="register-referralSource"
                  name="referralSource"
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className={`border ${
                    (submitted && !referralSource) || fieldErrors.referralSource
                      ? "border-red-500"
                      : "border-primary"
                  } font-text px-2 py-3 rounded-md bg-white`}
                >
                  <option value="">Select an option</option>
                  {REFERRAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p
                  className={`text-xs text-red-500 ${
                    (submitted && !referralSource) || fieldErrors.referralSource
                      ? "block"
                      : "hidden"
                  }`}
                >
                  {fieldErrors.referralSource || "Please choose one."}
                </p>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
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
