import React, { useRef, useState, useContext } from "react";
import { useNavigate, Link} from "react-router-dom";
import Button from "Components/form/Button";
import usePost from "Hooks/usePost";

import AuthContext from "Context/AuthContext";

const Verify = () => {
  const inputRefs = useRef(Array(6).fill(null));
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // "success" or "error"
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { postData } = usePost();

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
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

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = pastedData[i];
      }
    }
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setResponseType("error");
      setResponseMessage("Please enter the 6-digit code.");
      setTimeout(() => setResponseMessage(""), 3000);
      return;
    }

    try {
      const response = await postData("/auth/verify-email", {
        email: user.email,
        code: otpCode,
      });

      if (response.success) {
        setResponseType("success");
        setResponseMessage(response.message || "Verification successful!");
        navigate("/profile");
      } else {
        setResponseType("error");
        setResponseMessage(response.message || "Verification failed.");
      }
    } catch (error) {
      setResponseType("error");
      setResponseMessage(
        error?.message || "Verification failed. Please try again."
      );
    } finally {
      setTimeout(() => setResponseMessage(""), 3000);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    try {
      const response = await postData("/auth/send-verification", {
        email: user.email,
      });

      if (response.success) {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setResponseType("success");
        setResponseMessage(response.message || "Verification code resent!");
      } else {
        setResponseType("error");
        setResponseMessage(response.message || "Failed to resend code.");
      }
    } catch (error) {
      setResponseType("error");
      setResponseMessage(
        error?.message || "Failed to resend code. Please try again."
      );
    } finally {
      setTimeout(() => setResponseMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the verification code sent to your email address
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
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive a code?{" "}
                  <button
                    onClick={handleResendCode}
                    type="button"
                    className="text-black font-medium hover:text-gray-800"
                  >
                    Resend
                  </button>
                </p>
              </div>

              <Button type="submit" variant="primary" fullWidth>
                Verify
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
