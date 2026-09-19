import { useEffect } from 'react';
import type { MorphEffectProps } from '../types';

interface MorphEffectInternalProps extends MorphEffectProps {
  // MorphEffect doesn't render anything visual.
  // Morph state is calculated by useMorph hook and
  // applied to DotEffect's size/opacity.
}

/**
 * MorphEffect manages hover state on [data-morph] elements.
 * The visual morph (size/opacity changes) is applied by DotEffect.
 */
export function MorphEffect({ duration = 300 }: MorphEffectInternalProps) {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-morph]');

    const handleMouseEnter = (e: Event) => {
      (e.target as HTMLElement).classList.add('cursorix-morph-active');
    };

    const handleMouseLeave = (e: Event) => {
      (e.target as HTMLElement).classList.remove('cursorix-morph-active');
    };

    targets.forEach((target) => {
      target.addEventListener('mouseenter', handleMouseEnter);
      target.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', handleMouseEnter);
        target.removeEventListener('mouseleave', handleMouseLeave);
        target.classList.remove('cursorix-morph-active');
      });
    };
  }, [duration]);

  return null;
}
