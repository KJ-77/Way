import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import FormGroup from "Components/form/FormGroup";
import InputField from "Components/form/InputField";

// Step 2 of the forgot-password flow.
// User enters their email + the 6-digit code Cognito emailed. We don't actually
// verify the code with Cognito here — Cognito only validates the code as part
// of confirmPassword(). So this screen just collects the inputs and hands them
// to the next screen which performs the password reset.
const VerifyResetCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const emailFromQuery = query.get("email")
    ? decodeURIComponent(query.get("email"))
    : "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedCode = (code || "").trim();

    if (!normalizedEmail || normalizedCode.length !== 6) {
      setMessageType("error");
      setMessage("Enter your email and the 6-digit code.");
      return;
    }

    navigate(
      `/auth/password/reset?email=${encodeURIComponent(normalizedEmail)}&code=${encodeURIComponent(normalizedCode)}`
    );
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Enter your code</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to your email
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
                  label="Email address"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <InputField
                  label="Verification code"
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Enter 6-digit code"
                  required
                  value={code}
                  onChange={(e) => {
                    const digitsOnly = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setCode(digitsOnly);
                  }}
                  inputMode="numeric"
                />
              </FormGroup>

              <Button type="submit" variant="primary" fullWidth>
                Continue
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

export default VerifyResetCode;
