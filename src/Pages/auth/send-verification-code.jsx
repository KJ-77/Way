import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputField from "Components/form/InputField";
import Button from "Components/form/Button";
import FormGroup from "Components/form/FormGroup";
import usePost from "Hooks/usePost";

const SendVerificationCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialEmail = query.get("email")
    ? decodeURIComponent(query.get("email"))
    : "";

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const { loading, postData } = usePost();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const normalizedEmail = (email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      setMessageType("error");
      setMessage("Please enter your email address.");
      return;
    }

    try {
      const res = await postData("/user/request-password-reset", {
        email: normalizedEmail,
      });
      if (res?.success) {
        setMessageType("success");
        setMessage(res.message || "Verification code sent to your email.");
        // Go to verify code screen, preserve email
        navigate(
          `/auth/password/verify?email=${encodeURIComponent(normalizedEmail)}`
        );
      } else {
        setMessageType("error");
        setMessage(res?.message || "Failed to send verification code.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err?.message || "Failed to send verification code.");
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 lg:mt-secondary">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address to receive a verification code
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
                  // controlled value
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <p className="text-xs text-gray-600 mt-2">
                  We'll send a verification code to this email address
                </p>
              </FormGroup>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Sending..." : "Send verification code"}
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

export default SendVerificationCode;
