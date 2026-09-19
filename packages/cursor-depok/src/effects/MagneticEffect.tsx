import { useEffect } from 'react';
import type { MagneticEffectProps } from '../types';

interface MagneticEffectInternalProps extends MagneticEffectProps {
  // MagneticEffect doesn't render anything visual itself.
  // It modifies cursor position via the useMagnetic hook.
  // This component exists to handle side effects like
  // adding visual feedback to magnetic targets.
}

/**
 * MagneticEffect doesn't render cursor visuals.
 * The magnetic offset is calculated in useMagnetic hook and
 * applied to the cursor position in the main Cursor component.
 * This component adds hover classes to magnetic targets.
 */
export function MagneticEffect({ radius = 150 }: MagneticEffectInternalProps) {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-magnetic]');

    const handleMouseEnter = (e: Event) => {
      (e.target as HTMLElement).classList.add('cursorix-magnetic-active');
    };

    const handleMouseLeave = (e: Event) => {
      (e.target as HTMLElement).classList.remove('cursorix-magnetic-active');
    };

    targets.forEach((target) => {
      target.addEventListener('mouseenter', handleMouseEnter);
      target.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', handleMouseEnter);
        target.removeEventListener('mouseleave', handleMouseLeave);
        target.classList.remove('cursorix-magnetic-active');
      });
    };
  }, [radius]);

  return null;
}
