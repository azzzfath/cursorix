import React, { useEffect, useRef } from 'react';
import type { DotEffectProps, DotLayerConfig, DotShape, DotVariant, MousePosition, MorphState } from '../types';

interface DotEffectInternalProps extends DotEffectProps {
  mousePosition: React.RefObject<MousePosition>;
  zIndex: number;
  morphState?: React.RefObject<MorphState>;
  morphDuration?: number;
  dotPositionRef?: React.MutableRefObject<MousePosition>;
  isMouseDown?: boolean;
  clickScale?: number;
}

function renderShapeSvg(
  shape: DotShape = 'circle',
  variant: DotVariant = 'filled',
  color = '#000',
  borderColor?: string,
  borderWidth = 2
) {
  const isBorder =
    variant === 'border' ||
    shape === 'ring' ||
    shape.endsWith('-border');

  const baseShape = shape
    .replace('-border', '')
    .replace('ring', 'circle');

  const strokeColor = borderColor || color;
  const strokeW = isBorder ? (borderWidth || 2) : (borderWidth || 0);
  const fillColor = isBorder ? 'transparent' : color;

  switch (baseShape) {
    case 'square':
      return (
        <rect
          x="14"
          y="14"
          width="72"
          height="72"
          rx="1"
          fill={fillColor}
          stroke={strokeW > 0 ? strokeColor : 'none'}
          strokeWidth={strokeW}
          vectorEffect="non-scaling-stroke"
        />
      );
    case 'triangle':
      return (
        <polygon
          points="50,14 86,82 14,82"
          strokeLinejoin="round"
          fill={fillColor}
          stroke={strokeW > 0 ? strokeColor : 'none'}
          strokeWidth={strokeW}
          vectorEffect="non-scaling-stroke"
        />
      );
    case 'pentagon':
      return (
        <polygon
          points="50,10 90,39 75,86 25,86 10,39"
          strokeLinejoin="round"
          fill={fillColor}
          stroke={strokeW > 0 ? strokeColor : 'none'}
          strokeWidth={strokeW}
          vectorEffect="non-scaling-stroke"
        />
      );
    case 'hexagon':
      return (
        <polygon
          points="50,8 86.4,29 86.4,71 50,92 13.6,71 13.6,29"
          strokeLinejoin="round"
          fill={fillColor}
          stroke={strokeW > 0 ? strokeColor : 'none'}
          strokeWidth={strokeW}
          vectorEffect="non-scaling-stroke"
        />
      );
    case 'diamond':
      return (
        <polygon
          points="50,10 90,50 50,90 10,50"
          strokeLinejoin="round"
          fill={fillColor}
          stroke={strokeW > 0 ? strokeColor : 'none'}
          strokeWidth={strokeW}
          vectorEffect="non-scaling-stroke"
        />
      );
    case 'circle':
    default:
      return (
        <circle
          cx="50"
          cy="50"
          r="42"
          fill={fillColor}
          stroke={strokeW > 0 ? strokeColor : 'none'}
          strokeWidth={strokeW}
          vectorEffect="non-scaling-stroke"
        />
      );
  }
}

export function DotEffect({
  mousePosition,
  zIndex,
  morphState,
  morphDuration = 300,
  inner,
  outer,
  dotPositionRef,
  isMouseDown = false,
  clickScale = 0.82,
  ...restProps
}: DotEffectInternalProps) {
  const isDualLayer = Boolean(inner || outer);

  const innerConfig: DotLayerConfig | null = isDualLayer
    ? inner
      ? {
          shape: inner.shape ?? 'circle',
          variant: inner.variant ?? 'filled',
          color: inner.color ?? restProps.color ?? '#000',
          size: inner.size ?? 8,
          borderColor: inner.borderColor ?? inner.color ?? restProps.color ?? '#000',
          borderWidth: inner.borderWidth ?? 2,
          smoothing: inner.smoothing ?? 0.8,
          mixBlendMode: inner.mixBlendMode ?? restProps.mixBlendMode ?? 'normal',
          rotation: inner.rotation ?? 0,
        }
      : null
    : null;

  const outerConfig: DotLayerConfig | null = isDualLayer
    ? outer
      ? {
          shape: outer.shape ?? 'circle',
          variant: outer.variant ?? (outer.shape?.includes('border') || outer.shape === 'ring' ? 'border' : 'border'),
          color: outer.color ?? restProps.color ?? '#000',
          size: outer.size ?? 36,
          borderColor: outer.borderColor ?? outer.color ?? restProps.color ?? '#000',
          borderWidth: outer.borderWidth ?? 2,
          smoothing: outer.smoothing ?? 0.15,
          mixBlendMode: outer.mixBlendMode ?? restProps.mixBlendMode ?? 'normal',
          rotation: outer.rotation ?? 0,
        }
      : null
    : null;

  // Single dot configuration if not dual layer
  const singleConfig: DotLayerConfig | null = !isDualLayer
    ? {
        shape: restProps.shape ?? 'circle',
        variant: restProps.variant ?? (restProps.shape?.includes('border') || restProps.shape === 'ring' ? 'border' : 'filled'),
        color: restProps.color ?? '#000',
        size: restProps.size ?? 20,
        borderColor: restProps.borderColor ?? restProps.color ?? '#000',
        borderWidth: restProps.borderWidth ?? 2,
        smoothing: restProps.smoothing ?? 0.15,
        mixBlendMode: restProps.mixBlendMode ?? 'normal',
        rotation: restProps.rotation ?? 0,
      }
    : null;

  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const singleRef = useRef<HTMLDivElement>(null);

  const innerPos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const singlePos = useRef({ x: -100, y: -100 });

  const currentInnerScale = useRef(1);
  const currentOuterScale = useRef(1);
  const currentSingleScale = useRef(1);
  const currentInnerOpacity = useRef(1);
  const currentOuterOpacity = useRef(1);
  const currentSingleOpacity = useRef(1);
  const lastInnerOpacity = useRef(-1);
  const lastOuterOpacity = useRef(-1);
  const lastSingleOpacity = useRef(-1);
  const lastTime = useRef(performance.now());

  const animFrameId = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const now = performance.now();
      const delta = Math.min(50, Math.max(0.5, now - lastTime.current));
      lastTime.current = now;
      const timeFactor = delta / 16.67;

      const target = mousePosition.current ?? { x: -100, y: -100 };
      const morph = morphState?.current;
      const pressFactor = isMouseDown ? clickScale : 1.0;

      // Perceptual smooth interpolation function
      // 1.0 = instant snap to mouse coordinates ("pas bgt")
      // Decreasing towards 0 = progressively and visibly smoother floating delay
      const calcSmoothAlpha = (smoothingInput: number) => {
        const s = Math.max(0, Math.min(1, smoothingInput));
        if (s >= 0.99) return 1.0;
        // Exponential perceptual curve: spreads floating response evenly across 0.0 - 1.0
        const baseAlpha = Math.pow(s, 2.6) * 0.98 + 0.008;
        return Math.min(1.0, 1 - Math.pow(Math.max(0, 1 - baseAlpha), timeFactor));
      };

      // Update inner layer (follows cursor tightly, morphs if outer layer is disabled)
      if (innerRef.current && innerConfig) {
        const smooth = calcSmoothAlpha(innerConfig.smoothing ?? 0.8);
        if (smooth >= 1) {
          innerPos.current.x = target.x;
          innerPos.current.y = target.y;
        } else {
          innerPos.current.x += (target.x - innerPos.current.x) * smooth;
          innerPos.current.y += (target.y - innerPos.current.y) * smooth;
        }

        const size = innerConfig.size ?? 8;
        const rot = innerConfig.rotation ? ` rotate(${innerConfig.rotation}deg)` : '';

        if (!outerConfig && morph) {
          const baseMorphScale = morph.isHovering ? (morph.targetSize ?? 60) / size : 1;
          const targetScale = baseMorphScale * pressFactor;
          const targetOpacity = morph.isHovering ? (morph.targetOpacity ?? 0.2) : 1;
          currentInnerScale.current += (targetScale - currentInnerScale.current) * Math.min(1, 0.22 * timeFactor);
          currentInnerOpacity.current += (targetOpacity - currentInnerOpacity.current) * Math.min(1, 0.18 * timeFactor);
          innerRef.current.style.transform = `translate3d(${innerPos.current.x - size / 2}px, ${innerPos.current.y - size / 2}px, 0) scale(${currentInnerScale.current.toFixed(3)})${rot}`;
          if (Math.abs(lastInnerOpacity.current - currentInnerOpacity.current) > 0.008) {
            lastInnerOpacity.current = currentInnerOpacity.current;
            innerRef.current.style.opacity = currentInnerOpacity.current.toFixed(2);
          }
        } else {
          currentInnerScale.current += (pressFactor - currentInnerScale.current) * Math.min(1, 0.25 * timeFactor);
          innerRef.current.style.transform = `translate3d(${innerPos.current.x - size / 2}px, ${innerPos.current.y - size / 2}px, 0) scale(${currentInnerScale.current.toFixed(3)})${rot}`;
        }

        if (dotPositionRef) {
          dotPositionRef.current.x = innerPos.current.x;
          dotPositionRef.current.y = innerPos.current.y;
        }
      }

      // Update outer layer (smooth float follower, morphs on hover via GPU scale)
      if (outerRef.current && outerConfig) {
        const smooth = calcSmoothAlpha(outerConfig.smoothing ?? 0.35);
        if (smooth >= 1) {
          outerPos.current.x = target.x;
          outerPos.current.y = target.y;
        } else {
          outerPos.current.x += (target.x - outerPos.current.x) * smooth;
          outerPos.current.y += (target.y - outerPos.current.y) * smooth;
        }

        const baseSize = outerConfig.size ?? 36;
        const baseMorphScale = morph?.isHovering ? (morph.targetSize ?? 60) / baseSize : 1;
        const targetScale = baseMorphScale * pressFactor;
        const targetOpacity = morph?.isHovering ? (morph.targetOpacity ?? 0.2) : 1;

        currentOuterScale.current += (targetScale - currentOuterScale.current) * Math.min(1, 0.22 * timeFactor);
        currentOuterOpacity.current += (targetOpacity - currentOuterOpacity.current) * Math.min(1, 0.18 * timeFactor);

        const rot = outerConfig.rotation ? ` rotate(${outerConfig.rotation}deg)` : '';
        outerRef.current.style.transform = `translate3d(${outerPos.current.x - baseSize / 2}px, ${outerPos.current.y - baseSize / 2}px, 0) scale(${currentOuterScale.current.toFixed(3)})${rot}`;

        if (Math.abs(lastOuterOpacity.current - currentOuterOpacity.current) > 0.008) {
          lastOuterOpacity.current = currentOuterOpacity.current;
          outerRef.current.style.opacity = currentOuterOpacity.current.toFixed(2);
        }

        if (dotPositionRef && !innerConfig) {
          dotPositionRef.current.x = outerPos.current.x;
          dotPositionRef.current.y = outerPos.current.y;
        }
      }

      // Update single dot layer (morphs on hover via GPU scale)
      if (singleRef.current && singleConfig) {
        const smooth = calcSmoothAlpha(singleConfig.smoothing ?? 0.35);
        if (smooth >= 1) {
          singlePos.current.x = target.x;
          singlePos.current.y = target.y;
        } else {
          singlePos.current.x += (target.x - singlePos.current.x) * smooth;
          singlePos.current.y += (target.y - singlePos.current.y) * smooth;
        }

        const baseSize = singleConfig.size ?? 20;
        const baseMorphScale = morph?.isHovering ? (morph.targetSize ?? 60) / baseSize : 1;
        const targetScale = baseMorphScale * pressFactor;
        const targetOpacity = morph?.isHovering ? (morph.targetOpacity ?? 0.2) : 1;

        currentSingleScale.current += (targetScale - currentSingleScale.current) * Math.min(1, 0.22 * timeFactor);
        currentSingleOpacity.current += (targetOpacity - currentSingleOpacity.current) * Math.min(1, 0.18 * timeFactor);

        const rot = singleConfig.rotation ? ` rotate(${singleConfig.rotation}deg)` : '';
        singleRef.current.style.transform = `translate3d(${singlePos.current.x - baseSize / 2}px, ${singlePos.current.y - baseSize / 2}px, 0) scale(${currentSingleScale.current.toFixed(3)})${rot}`;

        if (Math.abs(lastSingleOpacity.current - currentSingleOpacity.current) > 0.008) {
          lastSingleOpacity.current = currentSingleOpacity.current;
          singleRef.current.style.opacity = currentSingleOpacity.current.toFixed(2);
        }

        if (dotPositionRef) {
          dotPositionRef.current.x = singlePos.current.x;
          dotPositionRef.current.y = singlePos.current.y;
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [mousePosition, morphState, innerConfig, outerConfig, singleConfig, dotPositionRef, isMouseDown, clickScale]);

  const layerBaseStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    willChange: 'transform, opacity',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'center center',
  };

  return (
    <>
      {outerConfig && (
        <div
          ref={outerRef}
          className="cursorix-dot cursorix-dot-outer"
          style={{
            ...layerBaseStyle,
            zIndex,
            width: outerConfig.size ?? 36,
            height: outerConfig.size ?? 36,
            mixBlendMode: outerConfig.mixBlendMode as React.CSSProperties['mixBlendMode'],
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ overflow: 'visible' }}
          >
            {renderShapeSvg(
              outerConfig.shape,
              outerConfig.variant,
              outerConfig.color,
              outerConfig.borderColor,
              outerConfig.borderWidth
            )}
          </svg>
        </div>
      )}

      {innerConfig && (
        <div
          ref={innerRef}
          className="cursorix-dot cursorix-dot-inner"
          style={{
            ...layerBaseStyle,
            zIndex: zIndex + 1,
            width: innerConfig.size ?? 8,
            height: innerConfig.size ?? 8,
            mixBlendMode: innerConfig.mixBlendMode as React.CSSProperties['mixBlendMode'],
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ overflow: 'visible' }}
          >
            {renderShapeSvg(
              innerConfig.shape,
              innerConfig.variant,
              innerConfig.color,
              innerConfig.borderColor,
              innerConfig.borderWidth
            )}
          </svg>
        </div>
      )}

      {singleConfig && (
        <div
          ref={singleRef}
          className="cursorix-dot cursorix-dot-single"
          style={{
            ...layerBaseStyle,
            zIndex,
            width: singleConfig.size ?? 20,
            height: singleConfig.size ?? 20,
            mixBlendMode: singleConfig.mixBlendMode as React.CSSProperties['mixBlendMode'],
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ overflow: 'visible' }}
          >
            {renderShapeSvg(
              singleConfig.shape,
              singleConfig.variant,
              singleConfig.color,
              singleConfig.borderColor,
              singleConfig.borderWidth
            )}
          </svg>
        </div>
      )}
    </>
  );
}
