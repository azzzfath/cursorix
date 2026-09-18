import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ClickEffectProps } from '../types';

interface ClickItem {
  id: number;
  x: number;
  y: number;
}

interface ClickEffectInternalProps extends ClickEffectProps {
  zIndex?: number;
}

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function ClickEffect({
  variant = 'ripple',
  color = '#e94560',
  size = 40,
  duration = 400,
  borderWidth = 2,
  zIndex = 9998,
}: ClickEffectInternalProps) {
  const [clicks, setClicks] = useState<ClickItem[]>([]);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const handlePointerDown = useCallback(
    (e: PointerEvent | MouseEvent) => {
      // Don't trigger if right-click or middle-click
      if ('button' in e && e.button !== 0) return;

      const id = Date.now() + Math.random();
      const newClick: ClickItem = {
        id,
        x: e.clientX,
        y: e.clientY,
      };

      setClicks((prev) => [...prev, newClick]);

      const timer = setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
        timeoutsRef.current.delete(id);
      }, duration + 50);

      timeoutsRef.current.set(id, timer);
    },
    [duration]
  );

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      timeoutsRef.current.forEach((timer) => clearTimeout(timer));
      timeoutsRef.current.clear();
    };
  }, [handlePointerDown]);

  if (clicks.length === 0) return null;

  return (
    <>
      {clicks.map((click) => {
        if (variant === 'pulse') {
          return (
            <div
              key={click.id}
              className="cursorix-click-pulse"
              style={{
                left: click.x,
                top: click.y,
                width: size * 2,
                height: size * 2,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                animationDuration: `${duration}ms`,
                zIndex,
              }}
            />
          );
        }

        if (variant === 'burst') {
          return (
            <div
              key={click.id}
              className="cursorix-click-burst"
              style={{
                left: click.x,
                top: click.y,
                zIndex,
              }}
            >
              {BURST_ANGLES.map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const burstX = Math.cos(rad) * size;
                const burstY = Math.sin(rad) * size;
                const particleSize = Math.max(3, Math.round(size / 9));

                return (
                  <span
                    key={i}
                    className="cursorix-burst-dot"
                    style={
                      {
                        left: -particleSize / 2,
                        top: -particleSize / 2,
                        width: particleSize,
                        height: particleSize,
                        backgroundColor: color,
                        animationDuration: `${duration}ms`,
                        '--burst-x': `${burstX.toFixed(1)}px`,
                        '--burst-y': `${burstY.toFixed(1)}px`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          );
        }

        // 'ripple' or 'shrink'
        return (
          <div
            key={click.id}
            className="cursorix-click-ripple"
            style={{
              left: click.x,
              top: click.y,
              width: size * 2,
              height: size * 2,
              border: `${borderWidth}px solid ${color}`,
              animationDuration: `${duration}ms`,
              zIndex,
            }}
          />
        );
      })}
    </>
  );
}
