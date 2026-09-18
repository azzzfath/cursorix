import React, { useEffect, useRef } from 'react';
import type { SpotlightEffectProps, MousePosition } from '../types';

interface SpotlightEffectInternalProps extends SpotlightEffectProps {
  mousePosition: React.RefObject<MousePosition>;
  zIndex: number;
}

export function SpotlightEffect({
  variant = 'radial',
  color = '#fff',
  radius = 150,
  opacity = 0.15,
  blur = 40,
  mousePosition,
  zIndex,
}: SpotlightEffectInternalProps) {
  const spotRef = useRef<HTMLDivElement>(null);
  const currentPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number>(0);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    const animate = () => {
      const target = mousePosition.current ?? { x: -100, y: -100 };

      const dx = target.x - currentPos.current.x;
      const dy = target.y - currentPos.current.y;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        currentPos.current.x += dx * 0.3;
        currentPos.current.y += dy * 0.3;
        spot.style.transform = `translate3d(${currentPos.current.x - radius}px, ${currentPos.current.y - radius}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [mousePosition, radius]);

  const getSpotlightStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: radius * 2,
      height: radius * 2,
      pointerEvents: 'none',
      zIndex: zIndex - 2,
      opacity,
      willChange: 'transform',
    };

    switch (variant) {
      case 'gradient':
        return {
          ...base,
          background: `radial-gradient(circle at 30% 30%, ${color} 0%, transparent 70%)`,
          borderRadius: '50%',
        };
      case 'box':
        return {
          ...base,
          background: 'transparent',
          borderRadius: '16px',
          boxShadow: `0 0 ${Math.min(blur, 30)}px ${color}`,
        };
      case 'radial':
      default:
        return {
          ...base,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          borderRadius: '50%',
        };
    }
  };

  return <div ref={spotRef} style={getSpotlightStyles()} className="cursorix-spotlight" />;
}
