import { useRef, useEffect, useState } from "react";
import { useInView, useAnimation } from "framer-motion";

const useEnhancedScrollAnimation = (threshold = 0.1, delay = 0) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    threshold,
    once: true, // Animation triggers only once
    margin: "-100px 0px -100px 0px", // Trigger animation slightly before element is fully visible
  });

  const controls = useAnimation();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (isInView && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;

      const timer = setTimeout(() => {
        controls.start("visible");
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, controls, delay]);

  // Animation variants for different effects
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.6,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  // Hover variants for interactive feedback
  const hoverVariants = {
    hover: {
      y: -4,
      scale: 1.01,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.99,
      y: -2,
      transition: {
        duration: 0.1,
      },
    },
  };

  return {
    ref,
    isInView,
    controls,
    hasAnimated: hasTriggeredRef.current,
    variants: {
      card: cardVariants,
      container: containerVariants,
      child: childVariants,
      hover: hoverVariants,
    },
  };
};

export default useEnhancedScrollAnimation;
