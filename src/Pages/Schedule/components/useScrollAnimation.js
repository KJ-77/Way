import { useEffect, useState, useRef } from "react";

const useScrollAnimation = (threshold = 0.4, rootMargin = "0px") => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Create observer instance only once
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Only trigger the animation if not already visible
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Once visible, disconnect observer to prevent any re-triggering
          if (observerRef.current && ref.current) {
            observerRef.current.unobserve(ref.current);
            observerRef.current.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    const currentObserver = observerRef.current;

    if (currentRef && currentObserver && !isVisible) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentRef && currentObserver) {
        currentObserver.unobserve(currentRef);
        currentObserver.disconnect();
      }
    };
  }, [threshold, rootMargin, isVisible]);

  return { ref, isVisible };
};

export default useScrollAnimation;
