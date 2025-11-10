import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "Components/form/Button";
import FormGroup from "Components/form/FormGroup";
import InputField from "Components/form/InputField";
import usePost from "Hooks/usePost";

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

  const { loading, postData } = usePost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedCode = (code || "").trim();

    if (!normalizedEmail || normalizedCode.length !== 6) {
      setMessageType("error");
      setMessage("Enter your email and the 6-digit code.");
      return;
    }

    try {
      const res = await postData("/user/verify-reset-code", {
        email: normalizedEmail,
        code: normalizedCode,
      });

      if (res?.success && res?.data?.resetToken) {
        navigate(
          `/auth/password/reset?token=${encodeURIComponent(
            res.data.resetToken
          )}`
        );
      } else {
        setMessageType("error");
        setMessage(res?.message || "Invalid or expired code.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify reset code
          </h1>
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
                />
              </FormGroup>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify code"}
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
