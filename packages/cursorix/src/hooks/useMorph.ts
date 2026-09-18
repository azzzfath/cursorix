import { useEffect, useRef, useCallback } from 'react';
import type { MorphEffectProps, MorphState, MousePosition } from '../types';

/**
 * Hook that detects hover over [data-morph] elements using passive event delegation.
 * Eliminates per-frame elementFromPoint() calls to prevent forced reflows.
 */
export function useMorph(props: MorphEffectProps | undefined) {
  const state = useRef<MorphState>({
    isHovering: false,
    targetSize: props?.hoverSize ?? 60,
    targetOpacity: props?.hoverOpacity ?? 0.2,
  });

  useEffect(() => {
    if (!props) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.('[data-morph]');
      if (target) {
        const customSize = target.getAttribute('data-morph-size');
        state.current = {
          isHovering: true,
          targetSize: customSize ? parseFloat(customSize) : (props.hoverSize ?? 60),
          targetOpacity: props.hoverOpacity ?? 0.2,
        };
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Element | null;
      if (!related || !related.closest?.('[data-morph]')) {
        state.current = {
          isHovering: false,
          targetSize: props.hoverSize ?? 60,
          targetOpacity: props.hoverOpacity ?? 0.2,
        };
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [props]);

  const calculateMorph = useCallback(
    (_mousePos: MousePosition): MorphState => {
      return state.current;
    },
    []
  );

  return { state, calculateMorph };
}
