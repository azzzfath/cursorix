import React, { useEffect, useRef } from 'react';
import type { TrailEffectProps, MousePosition } from '../types';

interface TrailEffectInternalProps extends TrailEffectProps {
  mousePosition: React.RefObject<MousePosition>;
  zIndex: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

// Pre-allocated static buffers to eliminate GC churn in the animation loop
const MAX_PTS = 256;
const splineBuffer: TrailPoint[] = Array.from({ length: MAX_PTS }, () => ({ x: 0, y: 0 }));
const filteredPts: TrailPoint[] = Array.from({ length: MAX_PTS }, () => ({ x: 0, y: 0 }));
const leftPts: TrailPoint[] = Array.from({ length: MAX_PTS }, () => ({ x: 0, y: 0 }));
const rightPts: TrailPoint[] = Array.from({ length: MAX_PTS }, () => ({ x: 0, y: 0 }));

// Centripetal Catmull-Rom spline with circular heading tangent and adaptive high-density sampling
// Eliminates straight polygonal chords during fast sweeping movements
function sampleSmoothSpline(
  points: TrailPoint[],
  count: number,
  heading: { x: number; y: number }
): number {
  if (count <= 1) {
    if (count === 1) {
      splineBuffer[0].x = points[0].x;
      splineBuffer[0].y = points[0].y;
    }
    return count;
  }

  const vMag = Math.hypot(heading.x, heading.y);
  const maxSegSamples = 8;

  if (count === 2) {
    const d = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
    const segSamples = Math.min(maxSegSamples, Math.max(3, Math.ceil(d / 12)));
    const p1 = points[0];
    const p2 = points[1];
    let m1x = p2.x - p1.x;
    let m1y = p2.y - p1.y;
    if (vMag > 1.0) {
      const uX = -heading.x / vMag;
      const uY = -heading.y / vMag;
      m1x = (p2.x - p1.x) * 0.45 + uX * d * 0.55;
      m1y = (p2.y - p1.y) * 0.45 + uY * d * 0.55;
    }
    const m2x = p2.x - p1.x;
    const m2y = p2.y - p1.y;

    let outIdx = 0;
    for (let s = 0; s <= segSamples && outIdx < MAX_PTS; s++) {
      const t = s / segSamples;
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      splineBuffer[outIdx].x = h00 * p1.x + h10 * m1x + h01 * p2.x + h11 * m2x;
      splineBuffer[outIdx].y = h00 * p1.y + h10 * m1y + h01 * p2.y + h11 * m2y;
      outIdx++;
    }
    return outIdx;
  }

  let outIdx = 0;
  splineBuffer[outIdx].x = points[0].x;
  splineBuffer[outIdx].y = points[0].y;
  outIdx++;

  for (let i = 0; i < count - 1 && outIdx < MAX_PTS - 10; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const p0 = i > 0 ? points[i - 1] : { x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y };
    const p3 = i < count - 2 ? points[i + 2] : { x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y };

    const d01 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const d12 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const d23 = Math.hypot(p3.x - p2.x, p3.y - p2.y);

    // Centripetal knot intervals (alpha = 0.5)
    const dt0 = Math.max(0.01, Math.sqrt(d01));
    const dt1 = Math.max(0.01, Math.sqrt(d12));
    const dt2 = Math.max(0.01, Math.sqrt(d23));

    let m1x: number;
    let m1y: number;
    if (i === 0 && vMag > 1.0) {
      // Blend natural chord direction with backward sweep tangent
      // so the curve arcs along the circular motion instead of cutting straight through the chord
      const uX = -heading.x / vMag;
      const uY = -heading.y / vMag;
      const cX = p2.x - p1.x;
      const cY = p2.y - p1.y;
      m1x = cX * 0.45 + uX * d12 * 0.55;
      m1y = cY * 0.45 + uY * d12 * 0.55;
    } else {
      m1x = ((p1.x - p0.x) / dt0 - (p2.x - p0.x) / (dt0 + dt1) + (p2.x - p1.x) / dt1) * dt1;
      m1y = ((p1.y - p0.y) / dt0 - (p2.y - p0.y) / (dt0 + dt1) + (p2.y - p1.y) / dt1) * dt1;
    }

    const m2x = ((p2.x - p1.x) / dt1 - (p3.x - p1.x) / (dt1 + dt2) + (p3.x - p2.x) / dt2) * dt1;
    const m2y = ((p2.y - p1.y) / dt1 - (p3.y - p1.y) / (dt1 + dt2) + (p3.y - p2.y) / dt2) * dt1;

    // Adaptive sampling: when moving fast and distance is large, sample up to 8 points per segment
    // so curves remain perfectly round and circular without straight polygonal segments
    const segSamples = Math.min(maxSegSamples, Math.max(2, Math.ceil(d12 / 12)));

    for (let s = 1; s <= segSamples && outIdx < MAX_PTS; s++) {
      const t = s / segSamples;
      const t2 = t * t;
      const t3 = t2 * t;

      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;

      splineBuffer[outIdx].x = h00 * p1.x + h10 * m1x + h01 * p2.x + h11 * m2x;
      splineBuffer[outIdx].y = h00 * p1.y + h10 * m1y + h01 * p2.y + h11 * m2y;

      outIdx++;
    }
  }

  return outIdx;
}

export function TrailEffect({
  variant = 'dots',
  color = '#000',
  length = 8,
  size = 8,
  fadeOut = true,
  smoothing = 0.3,
  borderColor,
  borderWidth = 0,
  mousePosition,
  zIndex,
}: TrailEffectInternalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trailPoints = useRef<TrailPoint[]>(
    Array.from({ length }, () => ({ x: -100, y: -100 }))
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number>(0);
  const lastMousePos = useRef<MousePosition>({ x: -100, y: -100 });
  const mouseHeading = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMoving = useRef<boolean>(false);
  const idleFade = useRef<number>(1);
  const lastIdleFade = useRef<number>(-1);
  const wasSettled = useRef<boolean>(false);
  const lastFrameTime = useRef<number>(performance.now());

  // Resize points array when length changes
  useEffect(() => {
    const currentMouse = mousePosition.current ?? { x: -100, y: -100 };
    if (trailPoints.current.length !== length) {
      trailPoints.current = Array.from({ length }, (_, idx) => {
        return trailPoints.current[idx] ?? { ...currentMouse };
      });
    }
    wasSettled.current = false;
  }, [length, mousePosition]);

  // Setup DOM elements for 'dots' variant
  useEffect(() => {
    const container = containerRef.current;
    if (!container || variant !== 'dots') return;

    container.innerHTML = '';
    for (let i = 0; i < length; i++) {
      const dot = document.createElement('div');
      dot.style.position = 'fixed';
      dot.style.top = '0';
      dot.style.left = '0';
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = color;
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = String(zIndex - 1);
      dot.style.willChange = 'transform';
      dot.style.transform = 'translate3d(-100px, -100px, 0)';
      dot.style.boxShadow = `0 0 ${Math.max(2, size / 3)}px ${color}40`;

      const progress = i / length;
      const baseOpacity = fadeOut ? Math.max(0.05, 1 - progress * 0.85) : 1;
      dot.style.opacity = String(baseOpacity);

      if (borderWidth > 0 && borderColor) {
        dot.style.border = `${borderWidth}px solid ${borderColor}`;
        dot.style.boxSizing = 'border-box';
      }

      container.appendChild(dot);
    }
  }, [variant, length, size, color, borderColor, borderWidth, zIndex, fadeOut]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      wasSettled.current = false;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [variant]);

  // Main animation loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Reset points on mount to current mouse pos if available
    const initialMouse = mousePosition.current;
    if (initialMouse && initialMouse.x > 0) {
      trailPoints.current = Array.from({ length }, () => ({ ...initialMouse }));
    }

    const animate = () => {
      const now = performance.now();
      const delta = Math.min(50, Math.max(0.5, now - lastFrameTime.current));
      lastFrameTime.current = now;

      const timeFactor = delta / 16.67;
      const mouse = mousePosition.current ?? { x: -100, y: -100 };

      // Initialize lastMousePos on first valid mouse coordinate to prevent jump
      if (lastMousePos.current.x < -50 && mouse.x > 0) {
        lastMousePos.current.x = mouse.x;
        lastMousePos.current.y = mouse.y;
        mouseHeading.current.x = 0;
        mouseHeading.current.y = 0;
      }

      // Detect mouse movement
      const dx = mouse.x - lastMousePos.current.x;
      const dy = mouse.y - lastMousePos.current.y;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0.25) {
        isMoving.current = true;
        idleFade.current = Math.min(1, idleFade.current + 0.1);
        lastMousePos.current.x = mouse.x;
        lastMousePos.current.y = mouse.y;
        mouseHeading.current.x = mouseHeading.current.x * 0.3 + dx * 0.7;
        mouseHeading.current.y = mouseHeading.current.y * 0.3 + dy * 0.7;
      } else {
        isMoving.current = false;
        idleFade.current = Math.max(0.4, idleFade.current - 0.02);
        mouseHeading.current.x *= 0.5;
        mouseHeading.current.y *= 0.5;
      }

      // The head of the trail stays anchored directly at the cursor dot
      const currentPts = trailPoints.current;
      const count = currentPts.length;

      if (count > 0) {
        currentPts[0].x = mouse.x;
        currentPts[0].y = mouse.y;

        for (let i = 1; i < count; i++) {
          const target = currentPts[i - 1];
          const point = currentPts[i];
          const baseS = Math.min(0.95, Math.max(0.12, smoothing * (1 - (i / count) * 0.25)));
          const s = Math.min(0.98, 1 - Math.pow(1 - baseS, timeFactor));

          point.x += (target.x - point.x) * s;
          point.y += (target.y - point.y) * s;
        }
      }

      // Check convergence for idle sleep
      let maxDelta = 0;
      for (let i = 1; i < count; i++) {
        const d = Math.abs(currentPts[i].x - currentPts[i - 1].x) + Math.abs(currentPts[i].y - currentPts[i - 1].y);
        if (d > maxDelta) maxDelta = d;
      }
      const isSettled = !isMoving.current && maxDelta < 0.15;

      // Render Dots Variant
      if (variant === 'dots' && container) {
        if (Math.abs(lastIdleFade.current - idleFade.current) > 0.01) {
          lastIdleFade.current = idleFade.current;
          container.style.opacity = String(idleFade.current);
        }

        if (!isSettled || !wasSettled.current) {
          const dots = container.children;
          for (let i = 0; i < dots.length; i++) {
            const dot = dots[i] as HTMLElement;
            const point = currentPts[i];
            const progress = i / length;
            const scale = fadeOut ? Math.max(0.15, 1 - progress * 0.7) : 1;
            dot.style.transform = `translate3d(${point.x - size / 2}px, ${point.y - size / 2}px, 0) scale(${scale})`;
          }
        }
      }

      // Render Canvas Variants (Line, Comet, Ribbon)
      if (canvas && (variant === 'line' || variant === 'comet' || variant === 'ribbon')) {
        if (isSettled && wasSettled.current) {
          animFrameId.current = requestAnimationFrame(animate);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fast user-space clear without transform thrashing
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

          if (mouse.x > 0 && mouse.y > 0) {
            let filterCount = 0;
            for (let i = 0; i < count && filterCount < MAX_PTS; i++) {
              const pt = currentPts[i];
              if (pt.x <= -50 && pt.y <= -50) continue;
              if (filterCount === 0) {
                filteredPts[0].x = pt.x;
                filteredPts[0].y = pt.y;
                filterCount = 1;
              } else {
                const prev = filteredPts[filterCount - 1];
                const d2 = (pt.x - prev.x) ** 2 + (pt.y - prev.y) ** 2;
                if (d2 >= 2.25) {
                  filteredPts[filterCount].x = pt.x;
                  filteredPts[filterCount].y = pt.y;
                  filterCount++;
                }
              }
            }

            if (filterCount >= 2) {
              const M = sampleSmoothSpline(
                filteredPts,
                filterCount,
                mouseHeading.current
              );

              if (variant === 'line') {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                if (!fadeOut) {
                  ctx.beginPath();
                  ctx.moveTo(splineBuffer[0].x, splineBuffer[0].y);
                  for (let i = 1; i < M; i++) {
                    ctx.lineTo(splineBuffer[i].x, splineBuffer[i].y);
                  }
                  ctx.lineWidth = size;
                  ctx.strokeStyle = color;
                  ctx.globalAlpha = idleFade.current;
                  ctx.stroke();

                  if (borderWidth > 0 && borderColor) {
                    ctx.lineWidth = size + borderWidth * 2;
                    ctx.strokeStyle = borderColor;
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.stroke();
                    ctx.globalCompositeOperation = 'source-over';
                  }
                } else {
                  for (let i = M - 2; i >= 0; i--) {
                    const p0 = splineBuffer[i];
                    const p1 = splineBuffer[i + 1];
                    const prog = i / (M - 1);
                    const alpha = Math.max(0.05, 1 - prog * 0.85) * idleFade.current;

                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.lineWidth = size;
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = alpha;
                    ctx.stroke();

                    if (borderWidth > 0 && borderColor) {
                      ctx.lineWidth = size + borderWidth * 2;
                      ctx.strokeStyle = borderColor;
                      ctx.globalCompositeOperation = 'destination-over';
                      ctx.stroke();
                      ctx.globalCompositeOperation = 'source-over';
                    }
                  }
                }
              } else if (variant === 'comet') {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let i = M - 2; i >= 0; i--) {
                  const p0 = splineBuffer[i];
                  const p1 = splineBuffer[i + 1];
                  const prog = i / (M - 1);
                  const currentWidth = Math.max(1, size * (1 - prog));
                  const currentAlpha = (fadeOut ? Math.max(0.04, 1 - prog) : 1) * idleFade.current;

                  ctx.beginPath();
                  ctx.moveTo(p0.x, p0.y);
                  ctx.lineTo(p1.x, p1.y);
                  ctx.lineWidth = currentWidth;
                  ctx.strokeStyle = color;
                  ctx.globalAlpha = currentAlpha;
                  ctx.stroke();
                }

                // Fast concentric glow without CPU software blur
                const head = splineBuffer[0];
                ctx.beginPath();
                ctx.arc(head.x, head.y, size / 2, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = idleFade.current;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(head.x, head.y, size * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = idleFade.current * 0.25;
                ctx.fill();
              } else if (variant === 'ribbon') {
                const baseWidth = size * 1.5;
                let prevNx = 0;
                let prevNy = 1;

                for (let i = 0; i < M; i++) {
                  const prog = i / (M - 1);
                  const w = Math.max(1, fadeOut ? baseWidth * (1 - prog * 0.7) : baseWidth);
                  let dx = 0;
                  let dy = 0;
                  if (i === 0) {
                    dx = splineBuffer[1].x - splineBuffer[0].x;
                    dy = splineBuffer[1].y - splineBuffer[0].y;
                  } else if (i === M - 1) {
                    dx = splineBuffer[M - 1].x - splineBuffer[M - 2].x;
                    dy = splineBuffer[M - 1].y - splineBuffer[M - 2].y;
                  } else {
                    dx = splineBuffer[i + 1].x - splineBuffer[i - 1].x;
                    dy = splineBuffer[i + 1].y - splineBuffer[i - 1].y;
                  }

                  const dSq = dx * dx + dy * dy;
                  let nx = prevNx;
                  let ny = prevNy;
                  if (dSq > 0.01) {
                    const d = Math.sqrt(dSq);
                    let rawNx = -dy / d;
                    let rawNy = dx / d;
                    if (i === 0) {
                      nx = rawNx;
                      ny = rawNy;
                    } else {
                      if (prevNx * rawNx + prevNy * rawNy < 0) {
                        rawNx = -rawNx;
                        rawNy = -rawNy;
                      }
                      nx = prevNx * 0.65 + rawNx * 0.35;
                      ny = prevNy * 0.65 + rawNy * 0.35;
                      const nd = Math.hypot(nx, ny);
                      if (nd > 0.001) {
                        nx /= nd;
                        ny /= nd;
                      }
                    }
                    prevNx = nx;
                    prevNy = ny;
                  }

                  const halfW = w / 2;
                  leftPts[i].x = splineBuffer[i].x + nx * halfW;
                  leftPts[i].y = splineBuffer[i].y + ny * halfW;
                  rightPts[i].x = splineBuffer[i].x - nx * halfW;
                  rightPts[i].y = splineBuffer[i].y - ny * halfW;
                }

                for (let i = M - 2; i >= 0; i--) {
                  const prog = i / (M - 1);
                  const alpha = (fadeOut ? Math.max(0.05, 1 - prog * 0.85) : 1) * idleFade.current;

                  ctx.beginPath();
                  ctx.moveTo(leftPts[i].x, leftPts[i].y);
                  ctx.lineTo(leftPts[i + 1].x, leftPts[i + 1].y);
                  ctx.lineTo(rightPts[i + 1].x, rightPts[i + 1].y);
                  ctx.lineTo(rightPts[i].x, rightPts[i].y);
                  ctx.closePath();

                  ctx.fillStyle = color;
                  ctx.globalAlpha = alpha;
                  ctx.fill();

                  if (borderWidth > 0 && borderColor) {
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    ctx.stroke();
                  }
                }
              }
            } else if (filterCount === 1) {
              ctx.beginPath();
              ctx.arc(filteredPts[0].x, filteredPts[0].y, size / 2, 0, Math.PI * 2);
              ctx.fillStyle = color;
              ctx.globalAlpha = idleFade.current;
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;
        }
      }

      wasSettled.current = isSettled;
      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [variant, color, length, size, fadeOut, smoothing, borderColor, borderWidth, mousePosition]);

  const needsCanvas = variant === 'line' || variant === 'comet' || variant === 'ribbon';

  return (
    <>
      <div
        ref={containerRef}
        className="cursorix-trail"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      />
      {needsCanvas && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: zIndex - 1,
          }}
          className="cursorix-trail-canvas"
        />
      )}
    </>
  );
}
