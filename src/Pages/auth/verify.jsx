import { useRef, useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "Components/form/Button";

import AuthContext from "Context/AuthContext";

// Verifies a fresh signup with the 6-digit confirmation code Cognito emailed.
// Pre-login screen — reached via /auth/verify?email=<email> right after /auth/register.
const Verify = () => {
  const inputRefs = useRef(Array(6).fill(null));
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // "success" or "error"
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, resendConfirmationCode } = useContext(AuthContext);

  // Email comes from the query param set by register.jsx after /auth/signup succeeds.
  const email = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email")?.toLowerCase() || "";
  }, [location.search]);

  // Bounce back to register if we landed here without an email
  useEffect(() => {
    if (!email) {
      navigate("/auth/register", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[idx] = value[0];
    setOtp(newOtp);

    if (value.length === 1 && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
      if (inputRefs.current[i]) inputRefs.current[i].value = pasted[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setResponseType("error");
      setResponseMessage("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setResponseMessage("");
    try {
      await confirmSignUp(email, code);
      setResponseType("success");
      setResponseMessage("Email verified! Redirecting to sign in...");
      setTimeout(() => navigate("/auth/login", { replace: true }), 1500);
    } catch (err) {
      setResponseType("error");
      setResponseMessage(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResponseMessage("");
    setLoading(true);
    try {
      await resendConfirmationCode(email);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setResponseType("success");
      setResponseMessage("New verification code sent. Check your email.");
    } catch (err) {
      setResponseType("error");
      setResponseMessage(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code we sent to
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <div className="mt-8">
          {responseMessage && (
            <div
              className={`mb-4 p-3 rounded-md text-center ${
                responseType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {responseMessage}
            </div>
          )}
          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="flex flex-col items-center">
                <div className="flex justify-between w-full max-w-xs gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength="1"
                      className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-xl font-semibold"
                      required
                      ref={(el) => (inputRefs.current[idx] = el)}
                      value={otp[idx]}
                      onChange={(e) => handleChange(e, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={handlePaste}
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-black font-medium hover:text-gray-800 disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
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

export default Verify;
