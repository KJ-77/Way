import { useState } from "react";
import BASE_URL from "Utilities/BASE_URL";

const useAuth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse error response from server
  const parseErrorResponse = async (response) => {
    try {
      const errorData = await response.json();
      // Return a structured error object with status code and message
      return {
        status: response.status,
        message: errorData.message || "Network response was not ok",
        data: errorData,
      };
    } catch (e) {
      // If we can't parse the JSON, return a generic error
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
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorObj = await parseErrorResponse(response);
        console.log("API Error Response:", errorObj); // Add detailed logging
        setError(errorObj);
        throw errorObj;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      // If it's already our parsed error, just throw it
      if (error.status) throw error;

      // Otherwise set and throw a generic error
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

  // For POST requests with authentication (with or without data)
  const postWithAuth = async (url, token, data = null) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const config = {
        method: "POST",
        headers,
        credentials: "include", // Include cookies if needed
      };

      // Only add body if data exists
      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${BASE_URL}${url}`, config);

      if (!response.ok) {
        const errorObj = await parseErrorResponse(response);
        console.log("API Error Response:", errorObj); // Add detailed logging
        setError(errorObj);
        throw errorObj;
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      // If it's already our parsed error, just throw it
      if (error.status) throw error;

      // Otherwise set and throw a generic error
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
