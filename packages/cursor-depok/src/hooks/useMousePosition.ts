import { useEffect, useRef, useCallback } from 'react';
import type { MousePosition } from '../types';

/**
 * Hook that tracks mouse position using requestAnimationFrame for smooth updates.
 * Returns a ref to avoid unnecessary re-renders.
 */
export function useMousePosition() {
  const position = useRef<MousePosition>({ x: -100, y: -100 });
  const isActive = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    position.current = { x: e.clientX, y: e.clientY };
    if (!isActive.current) {
      isActive.current = true;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isActive.current = false;
    position.current = { x: -100, y: -100 };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { position, isActive };
}
