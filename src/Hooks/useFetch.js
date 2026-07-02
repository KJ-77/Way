import { useState } from "react";
import { shouldUseMock } from "Utilities/BASE_URL";
import { apiFetch } from "../lib/api";
import {
  mockHomeData,
  mockEventData,
  mockProductCategories,
  mockAllProducts,
  getMockProductsByCategory,
} from "data/mockData";

// Mock data resolver for GET endpoints still backed by fixtures.
// /schedule is NOT in here — it always hits the real backend via
// LIVE_ENDPOINT_PREFIXES in Utilities/BASE_URL.
const getMockData = (url) => {
  if (url === "/home") return mockHomeData;
  if (url === "/event") return mockEventData;
  if (url === "/product-categories") return mockProductCategories;
  if (url === "/products") return mockAllProducts;

  // /products/category/:id
  const categoryMatch = url.match(/^\/products\/category\/(.+)$/);
  if (categoryMatch) return getMockProductsByCategory(categoryMatch[1]);

  // Fallback
  return { data: [] };
};

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    // Per-endpoint override: if MOCK_MODE is on but this URL is in LIVE_ENDPOINTS,
    // skip the mock branch and hit the real backend.
    if (shouldUseMock(url)) {
      try {
        await new Promise((r) => setTimeout(r, 300));
        const result = getMockData(url);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      // apiFetch resolves BASE_URL and attaches the Cognito ID token when a
      // session exists. Live endpoints that were previously public (packages,
      // schedule) now require auth — hitting them without a token returns 401.
      const response = await apiFetch(url);
      if (!response.ok) {
        throw new Error(`Request failed (HTTP ${response.status})`);
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default useFetch;
