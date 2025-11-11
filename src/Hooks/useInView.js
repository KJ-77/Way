// Lightweight IntersectionObserver hook to detect when an element
// enters the viewport. Animates once by default.
import { useEffect, useRef, useState } from "react";

export default function useInView(
  options = { threshold: 0.15, root: null, rootMargin: "0px 0px -10% 0px" },
  once = true,
  minEnterIntervalMs = 220
) {
  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const lastIntersectingRef = useRef(false);
  const lastEnterTsRef = useRef(0);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // If no observer support, consider in view to avoid hidden content
      setIsInView(true);
      return;
    }

    let didUnsubscribe = false;
    const observer = new IntersectionObserver((entries) => {
      if (didUnsubscribe) return;
      entries.forEach((entry) => {
        const now = performance.now ? performance.now() : Date.now();
        const isIntersecting = entry.isIntersecting;

        // De-duplicate identical states
        if (isIntersecting === lastIntersectingRef.current) {
          return;
        }

        if (isIntersecting) {
          // Throttle rapid consecutive enters (e.g., React StrictMode/dev or layout jank)
          if (now - lastEnterTsRef.current < minEnterIntervalMs) {
            lastIntersectingRef.current = isIntersecting;
            return;
          }
          lastEnterTsRef.current = now;
          lastIntersectingRef.current = true;
          hasEnteredRef.current = true;
          setIsInView(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          // Only allow exit after we have actually entered once
          lastIntersectingRef.current = false;
          if (hasEnteredRef.current) {
            setIsInView(false);
          }
        }
      });
    }, options);

    observer.observe(node);

    return () => {
      didUnsubscribe = true;
      try {
        observer.disconnect();
      } catch (_) {}
    };
  }, [
    once,
    options,
    options?.threshold,
    options?.root,
    options?.rootMargin,
    minEnterIntervalMs,
  ]);

  return { ref: elementRef, isInView };
}
