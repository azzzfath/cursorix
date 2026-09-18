import { useCallback, useEffect, useRef } from 'react';
import type { MagneticEffectProps, MagneticOffset, MousePosition } from '../types';

interface MagneticTarget {
  element: HTMLElement;
  rect: DOMRect;
  strength: number;
  isRepel: boolean;
  maxDisplacement: number;
  hasMoved: boolean;
}

/**
 * Hook that calculates magnetic physics based on proximity to [data-magnetic] and [data-repel] elements.
 * Supports:
 * - Attract mode: pulls cursor toward element center.
 * - Repel mode: physically pushes elements away from cursor (especially text / interactive items).
 * Caches target bounding rects to prevent per-frame forced reflows.
 */
export function useMagnetic(props: MagneticEffectProps | undefined) {
  const offset = useRef<MagneticOffset>({ x: 0, y: 0 });
  const targetsCache = useRef<MagneticTarget[]>([]);
  const isDirty = useRef(true);

  const mode = props?.mode ?? 'both';
  const defaultStrength = props?.strength ?? 0.5;
  const defaultRadius = props?.radius ?? 150;
  const defaultMaxDisplacement = props?.maxDisplacement ?? 30;

  const updateTargets = useCallback(() => {
    if (!props) return;
    const elements = document.querySelectorAll<HTMLElement>('[data-magnetic], [data-repel]');
    targetsCache.current = Array.from(elements).map((el) => {
      const magAttr = el.getAttribute('data-magnetic');
      const isRepelAttr = el.hasAttribute('data-repel') || magAttr === 'repel';

      const customStrength = parseFloat(el.getAttribute('data-magnetic-strength') || '');
      const strength = !isNaN(customStrength) ? customStrength : defaultStrength;

      const customDisplacement = parseFloat(el.getAttribute('data-magnetic-displacement') || '');
      const maxDisplacement = !isNaN(customDisplacement) ? customDisplacement : defaultMaxDisplacement;

      return {
        element: el,
        rect: el.getBoundingClientRect(),
        strength,
        isRepel: isRepelAttr,
        maxDisplacement,
        hasMoved: false,
      };
    });
    isDirty.current = false;
  }, [props, defaultStrength, defaultMaxDisplacement]);

  useEffect(() => {
    if (!props) return;
    updateTargets();

    const markDirty = () => {
      targetsCache.current.forEach((t) => {
        if (t.hasMoved) {
          t.element.style.transform = '';
          t.hasMoved = false;
        }
      });
      isDirty.current = true;
    };

    window.addEventListener('scroll', markDirty, { passive: true });
    window.addEventListener('resize', markDirty, { passive: true });

    return () => {
      window.removeEventListener('scroll', markDirty);
      window.removeEventListener('resize', markDirty);

      targetsCache.current.forEach((target) => {
        if (target.hasMoved) {
          target.element.style.transform = '';
        }
      });
    };
  }, [props, updateTargets]);

  const calculateOffset = useCallback(
    (mousePos: MousePosition): MagneticOffset => {
      if (!props) return { x: 0, y: 0 };

      if (isDirty.current) {
        updateTargets();
      }

      const radius = props.radius ?? defaultRadius;
      let closestOffset: MagneticOffset = { x: 0, y: 0 };
      let closestDistance = Infinity;

      const canAttract = mode === 'attract' || mode === 'both';
      const canRepel = mode === 'repel' || mode === 'both';

      for (const target of targetsCache.current) {
        const rect = target.rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = centerX - mousePos.x;
        const distY = centerY - mousePos.y;
        const distance = Math.hypot(distX, distY);

        if (target.isRepel) {
          // REPEL MODE: push the element away from the cursor
          if (canRepel && distance < radius && distance > 0.1) {
            const pushFactor = Math.pow(1 - distance / radius, 1.2) * target.strength;
            const pushX = (distX / distance) * target.maxDisplacement * pushFactor;
            const pushY = (distY / distance) * target.maxDisplacement * pushFactor;

            target.element.style.transform = `translate3d(${pushX.toFixed(2)}px, ${pushY.toFixed(2)}px, 0)`;
            target.hasMoved = true;
          } else if (target.hasMoved) {
            target.element.style.transform = 'translate3d(0px, 0px, 0px)';
            target.hasMoved = false;
          }
        } else {
          // ATTRACT MODE: pull the cursor toward the element
          if (canAttract && distance < radius && distance < closestDistance) {
            closestDistance = distance;
            const pull = (1 - distance / radius) * target.strength;
            closestOffset = {
              x: distX * pull,
              y: distY * pull,
            };
          }
        }
      }

      offset.current = closestOffset;
      return closestOffset;
    },
    [props, mode, defaultRadius, updateTargets]
  );

  return { offset, calculateOffset };
}
