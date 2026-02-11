import { useState } from "react";
import BASE_URL, { MOCK_MODE } from "Utilities/BASE_URL";
import {
  mockMyRegistrations,
  mockRegistrationResponse,
  mockSuccessResponse,
} from "data/mockData";

/**
 * Mock response resolver for authenticated endpoints
 */
const getMockAuthGet = (url) => {
  if (url.includes("/registrations/my-registrations"))
    return mockMyRegistrations;

  // Fallback
  return { data: [] };
};

const getMockAuthPost = (url) => {
  if (url.includes("/registrations/request-full-class"))
    return mockRegistrationResponse;
  if (url.includes("/registrations")) return mockRegistrationResponse;

  // Fallback
  return mockSuccessResponse;
};

const useAuth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse error response from server
  const parseErrorResponse = async (response) => {
    try {
      const errorData = await response.json();
      return {
        status: response.status,
        message: errorData.message || "Network response was not ok",
        data: errorData,
      };
    } catch (e) {
      return {
        status: response.status,
        message: "Network response was not ok",
      };
    }
  };

  // For GET requests with authentication
  const fetchWithAuth = async (url, token) => {
    setLoading(true);
    setError(null);

    // Mock mode
    if (MOCK_MODE) {
      try {
        await new Promise((r) => setTimeout(r, 200));
        const result = getMockAuthGet(url);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }

    // Real mode
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorObj = await parseErrorResponse(response);
        setError(errorObj);
        throw errorObj;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      if (error.status) throw error;
      const genericError = {
        status: 500,
        message: error.message || "An unknown error occurred",
      };
      setError(genericError);
      throw genericError;
    } finally {
      setLoading(false);
    }
  };

  // For POST requests with authentication
  const postWithAuth = async (url, token, data = null) => {
    setLoading(true);
    setError(null);

    // Mock mode
    if (MOCK_MODE) {
      try {
        await new Promise((r) => setTimeout(r, 400));
        const result = getMockAuthPost(url);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }

    // Real mode
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const config = {
        method: "POST",
        headers,
        credentials: "include",
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${BASE_URL}${url}`, config);

      if (!response.ok) {
        const errorObj = await parseErrorResponse(response);
        setError(errorObj);
        throw errorObj;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      if (error.status) throw error;
      const genericError = {
        status: 500,
        message: error.message || "An unknown error occurred",
      };
      setError(genericError);
      throw genericError;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchWithAuth, postWithAuth };
};

export default useAuth;
