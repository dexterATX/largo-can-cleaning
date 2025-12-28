'use client';

import { useState, useEffect, startTransition } from 'react';

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

    startTransition(() => {
      setShouldReduceMotion(mediaQuery.matches || isMobile);
    });

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches || isMobile);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Debounced resize handler to prevent excessive re-renders
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const nowMobile = window.innerWidth < 768;
        setShouldReduceMotion(mediaQuery.matches || nowMobile);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
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

    // Debounced resize handler
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
}
