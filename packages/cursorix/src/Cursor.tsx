import { useState, useEffect, useRef } from 'react';
import type { CursorProps, MousePosition, MorphState } from './types';
import { useMousePosition } from './hooks/useMousePosition';
import { useMagnetic } from './hooks/useMagnetic';
import { useMorph } from './hooks/useMorph';
import { DotEffect } from './effects/DotEffect';
import { TrailEffect } from './effects/TrailEffect';
import { SpotlightEffect } from './effects/SpotlightEffect';
import { MagneticEffect } from './effects/MagneticEffect';
import { MorphEffect } from './effects/MorphEffect';
import { ClickEffect } from './effects/ClickEffect';
import './styles/cursors.css';

/**
 * Composable cursor component. Mix & match effects by passing
 * configuration objects to each effect prop.
 *
 * @example
 * ```tsx
 * <Cursor
 *   dot={{ color: "#ff6b6b", size: 20, shape: "circle" }}
 *   trail={{ variant: "dots", color: "#4ecdc4", length: 10 }}
 *   spotlight={{ radius: 150, opacity: 0.15 }}
 * />
 * ```
 */
export function Cursor({
  zIndex = 9999,
  hideNativeCursor = true,
  disabled = false,
  dot,
  inner,
  outer,
  trail,
  spotlight,
  magnetic,
  morph,
  click,
}: CursorProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
      setIsTouchDevice(mq.matches);
      const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  const effectiveDot = dot || (inner || outer ? { inner, outer } : undefined);
  const hasActiveEffects = Boolean(effectiveDot || trail || spotlight || magnetic || click);
  const isEffectivelyDisabled = disabled || !hasActiveEffects || isTouchDevice;
  // Native cursor is only hidden if dot effect is explicitly enabled and not on a touch device
  const shouldHideNative = hideNativeCursor && !isEffectivelyDisabled && Boolean(effectiveDot);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const { position } = useMousePosition();
  const { calculateOffset } = useMagnetic(magnetic);
  const { calculateMorph } = useMorph(morph);

  // Combined position (mouse + magnetic offset)
  const combinedPosition = useRef<MousePosition>({ x: -100, y: -100 });
  const dotPositionRef = useRef<MousePosition>({ x: -100, y: -100 });
  const morphStateRef = useRef<MorphState>({
    isHovering: false,
    targetSize: morph?.hoverSize ?? 60,
    targetOpacity: morph?.hoverOpacity ?? 0.2,
  });
  const animFrameId = useRef<number>(0);

  // Track global mousedown / mouseup for tactile click feedback
  useEffect(() => {
    const handleDown = (e: PointerEvent | MouseEvent) => {
      if ('button' in e && e.button !== 0) return;
      setIsMouseDown(true);
    };
    const handleUp = () => setIsMouseDown(false);

    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    window.addEventListener('pointercancel', handleUp, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  // Apply hide-cursor class to body only when custom cursor is active
  useEffect(() => {
    if (shouldHideNative) {
      document.body.classList.add('cursorix-hide-cursor');
    } else {
      document.body.classList.remove('cursorix-hide-cursor');
    }
    return () => {
      document.body.classList.remove('cursorix-hide-cursor');
    };
  }, [shouldHideNative]);

  // Main animation loop for combined position
  useEffect(() => {
    if (isEffectivelyDisabled) return;

    const updatePosition = () => {
      const mousePos = position.current ?? { x: -100, y: -100 };

      // Initialize dotPositionRef once on first valid mouse coordinate
      if (dotPositionRef.current.x < -50 && mousePos.x > -50) {
        dotPositionRef.current.x = mousePos.x;
        dotPositionRef.current.y = mousePos.y;
      }

      // Calculate magnetic offset
      if (magnetic) {
        const offset = calculateOffset(mousePos);
        combinedPosition.current.x = mousePos.x + offset.x;
        combinedPosition.current.y = mousePos.y + offset.y;
      } else {
        combinedPosition.current.x = mousePos.x;
        combinedPosition.current.y = mousePos.y;
      }

      // Calculate morph state (only when dot is also present)
      if (effectiveDot && morph) {
        morphStateRef.current = calculateMorph(mousePos);
      }

      animFrameId.current = requestAnimationFrame(updatePosition);
    };

    animFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [isEffectivelyDisabled, effectiveDot, magnetic, morph, position, calculateOffset, calculateMorph]);

  if (isEffectivelyDisabled) return null;

  const effectMousePosition = magnetic ? combinedPosition : position;

  return (
    <div
      className="cursorix-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        margin: 0,
        padding: 0,
        border: 'none',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex,
      }}
      aria-hidden="true"
    >
      {spotlight && (
        <SpotlightEffect
          {...spotlight}
          mousePosition={effectMousePosition}
          zIndex={zIndex - 2}
        />
      )}

      {effectiveDot && (
        <DotEffect
          {...effectiveDot}
          mousePosition={effectMousePosition}
          zIndex={zIndex}
          morphState={morph ? morphStateRef : undefined}
          morphDuration={morph?.duration}
          dotPositionRef={dotPositionRef}
          isMouseDown={isMouseDown}
          clickScale={click?.scale}
        />
      )}

      {trail && (
        <TrailEffect
          {...trail}
          mousePosition={effectiveDot ? dotPositionRef : effectMousePosition}
          zIndex={zIndex - 1}
        />
      )}

      {click && (
        <ClickEffect
          {...click}
          zIndex={zIndex + 2}
        />
      )}

      {magnetic && <MagneticEffect {...magnetic} />}
      {effectiveDot && morph && <MorphEffect {...morph} />}
    </div>
  );
}
