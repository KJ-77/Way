import { useMemo, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import FormGroup from "Components/form/FormGroup";
import InputField from "Components/form/InputField";

import AuthContext from "Context/AuthContext";

// Step 3 (final) of the forgot-password flow.
// We have the email and the reset code from previous steps. The user picks a
// new password; Cognito.confirmPassword(code, newPassword) validates the code
// AND sets the new password in one call.
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const emailFromQuery = query.get("email")
    ? decodeURIComponent(query.get("email"))
    : "";
  const codeFromQuery = query.get("code")
    ? decodeURIComponent(query.get("code"))
    : "";

  const { confirmForgotPassword } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!emailFromQuery || !codeFromQuery) {
      setMessageType("error");
      setMessage("Missing reset info. Please restart the reset process.");
      return;
    }

    if (!password || password.length < 8) {
      setMessageType("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmForgotPassword(emailFromQuery, codeFromQuery, password);
      setMessageType("success");
      setMessage("Password reset successfully. Redirecting to sign in...");
      setTimeout(() => navigate("/auth/login", { replace: true }), 1500);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Set new password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter and confirm your new password
          </p>
        </div>

        <div className="mt-8">
          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-center ${
                messageType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormGroup>
                <InputField
                  label="New password"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <InputField
                  label="Confirm password"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormGroup>

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Submitting..." : "Reset password"}
              </Button>

              <div className="text-center">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-black hover:text-gray-800"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
