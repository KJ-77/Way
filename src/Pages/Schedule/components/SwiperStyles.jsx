import { useEffect } from "react";

// Simple hook that doesn't add any custom styles
const useSwiperStyles = () => {
  // Empty hook that can be used if we need to add styles in the future
  useEffect(() => {
    // No styles are being injected as requested
    return () => {};
  }, []);
};

export default useSwiperStyles;
