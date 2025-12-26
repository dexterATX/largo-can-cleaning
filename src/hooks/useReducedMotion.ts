'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion or is on a mobile device
 * Returns true if animations should be reduced/disabled for performance
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Check if mobile device (width < 768px or touch device)
    const isMobile = window.innerWidth < 768 ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0);

    setShouldReduceMotion(mediaQuery.matches || isMobile);

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches || isMobile);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Also listen for resize to detect orientation changes
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setShouldReduceMotion(mediaQuery.matches || nowMobile);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook to detect if the device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0)
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
