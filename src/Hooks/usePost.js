import { useState } from "react";
import BASE_URL, { MOCK_MODE } from "Utilities/BASE_URL";
import { throwIfNotOk } from "../lib/errors";
import {
  getMockLoginResponse,
  getMockRegisterResponse,
  mockSuccessResponse,
  mockVerifyResponse,
} from "data/mockData";

/**
 * Mock response resolver for POST endpoints
 */
const getMockPostResponse = (url, data) => {
  if (url === "/auth/login") return getMockLoginResponse(data?.email);
  if (url === "/auth/register") return getMockRegisterResponse(data);
  if (url === "/auth/verify-email") return mockVerifyResponse;
  if (url === "/auth/send-verification") return mockSuccessResponse;
  if (url === "/user/profile") return { success: true, data: data };
  if (url === "/user/change-password") return mockSuccessResponse;
  if (url === "/user/request-password-reset") return mockSuccessResponse;
  if (url === "/user/verify-reset-code")
    return { success: true, data: { resetToken: "mock-reset-token" } };
  if (url === "/user/reset-password") return mockSuccessResponse;
  if (url === "/event/request") return mockSuccessResponse;

  // Fallback
  return mockSuccessResponse;
};

const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, data, token) => {
    setLoading(true);
    setError(null);

    // Mock mode: return mock response with simulated delay
    if (MOCK_MODE) {
      try {
        await new Promise((r) => setTimeout(r, 500));
        const result = getMockPostResponse(url, data);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }

    // Real mode: POST to backend
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(data),
      });
      // Throws ApiError with backend code/status so call sites can branch by code
      await throwIfNotOk(response, "Network response was not ok");
      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default usePost;
