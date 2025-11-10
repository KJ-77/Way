import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToTop(options) {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollOptions =
      typeof options === "object" && options !== null
        ? { top: 0, left: 0, ...options }
        : { top: 0, left: 0, behavior: "smooth" };

    window.scrollTo(scrollOptions);
  }, [pathname]);
}
