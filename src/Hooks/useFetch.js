import { useState } from "react";
import BASE_URL, { shouldUseMock } from "Utilities/BASE_URL";
import {
  mockHomeData,
  mockScheduleData,
  mockEventData,
  mockProductCategories,
  mockAllProducts,
  getMockProductsByCategory,
} from "data/mockData";

// Mock data resolver for GET endpoints still backed by fixtures.
const getMockData = (url) => {
  if (url === "/home") return mockHomeData;
  if (url === "/schedule") return mockScheduleData;
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
      const response = await fetch(`${BASE_URL}${url}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
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
