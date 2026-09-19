/** Shape options for dot effect */
export type DotShape =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'pentagon'
  | 'hexagon'
  | 'diamond'
  | 'ring'
  | 'square-border'
  | 'triangle-border'
  | 'pentagon-border'
  | 'hexagon-border'
  | 'diamond-border';

/** Fill or outline style for dot effect */
export type DotVariant = 'filled' | 'border';

/** Configuration for an individual dot layer (inner, outer, or single) */
export interface DotLayerConfig {
  /** Shape of the dot layer. Default: "circle" */
  shape?: DotShape;
  /** Fill or outline style. Default: "filled" (or "border" if shape contains "border" or "ring") */
  variant?: DotVariant;
  /** Color of the dot layer. Default: "#000" */
  color?: string;
  /** Diameter in px */
  size?: number;
  /** Border/outline color. Default: same as color */
  borderColor?: string;
  /** Border/outline width in px. Default: 2 */
  borderWidth?: number;
  /** Smoothing factor 0-1, lower = more lag, 1 = instant. */
  smoothing?: number;
  /** CSS mix-blend-mode. Default: "normal" */
  mixBlendMode?: string;
  /** Rotation angle in degrees. Default: 0 */
  rotation?: number;
}

/** Props for the dot follower effect (supports single dot or dual inner/outer layers) */
export interface DotEffectProps extends DotLayerConfig {
  /** Inner layer configuration (snappy, follows cursor tightly) */
  inner?: DotLayerConfig;
  /** Outer layer configuration (floaty, customizable outline/follower) */
  outer?: DotLayerConfig;
}

/** Variant options for trail effect */
export type TrailVariant = 'dots' | 'line' | 'comet' | 'ribbon';

/** Variant options for spotlight effect */
export type SpotlightVariant = 'radial' | 'gradient' | 'box';

/** Props for the trail/particle effect */
export interface TrailEffectProps {
  /** Type of trail. Default: "dots" */
  variant?: TrailVariant;
  /** Color of the trail. Default: "#000" */
  color?: string;
  /** Number of trail dots / trail length. Default: 8 */
  length?: number;
  /** Size of each trail dot / line thickness. Default: 8 */
  size?: number;
  /** Whether trail fades out. Default: true */
  fadeOut?: boolean;
  /** Smoothing factor 0-1. Default: 0.2 */
  smoothing?: number;
  /** Border/outline color. Default: none */
  borderColor?: string;
  /** Border/outline width in px. Default: 0 */
  borderWidth?: number;
}

/** Props for the spotlight/glow effect */
export interface SpotlightEffectProps {
  /** Type of spotlight. Default: "radial" */
  variant?: SpotlightVariant;
  /** Color of the spotlight. Default: "#fff" */
  color?: string;
  /** Radius of the spotlight in px. Default: 150 */
  radius?: number;
  /** Opacity of the spotlight. Default: 0.15 */
  opacity?: number;
  /** Blur amount in px. Default: 40 */
  blur?: number;
}

/** Variant options for click reaction effect */
export type ClickVariant = 'ripple' | 'burst' | 'shrink' | 'pulse';

/** Props for click reaction effect */
export interface ClickEffectProps {
  /** Type of click animation. Default: "ripple" */
  variant?: ClickVariant;
  /** Color of click ripple or burst particles. Default: "#e94560" */
  color?: string;
  /** Size/radius of the click effect in px. Default: 40 */
  size?: number;
  /** Animation duration in ms. Default: 400 */
  duration?: number;
  /** Scale factor for cursor dot shrink on mousedown. Default: 0.8 */
  scale?: number;
  /** Border width for ripple ring. Default: 2 */
  borderWidth?: number;
}

/** Props for the magnetic attraction & repulsion effect */
export interface MagneticEffectProps {
  /** Distance in px at which magnetic effect activates. Default: 150 */
  radius?: number;
  /** Strength of the magnetic pull/push 0-1. Default: 0.5 */
  strength?: number;
  /** Magnetic interaction mode: 'attract' (pull cursor), 'repel' (push elements away), or 'both'. Default: 'both' */
  mode?: 'attract' | 'repel' | 'both';
  /** Maximum displacement in px when pushing repel elements away. Default: 30 */
  maxDisplacement?: number;
}

/** Props for the shape morphing effect */
export interface MorphEffectProps {
  /** Size of cursor when hovering morph targets. Default: 60 */
  hoverSize?: number;
  /** Opacity when hovering morph targets. Default: 0.2 */
  hoverOpacity?: number;
  /** Animation duration in ms. Default: 300 */
  duration?: number;
}

/** Main Cursor component props */
export interface CursorProps {
  /** z-index for all cursor effects. Default: 9999 */
  zIndex?: number;
  /** Whether to hide the native cursor. Default: true */
  hideNativeCursor?: boolean;
  /** Disable all effects. Default: false */
  disabled?: boolean;

  /** Dot follower effect configuration */
  dot?: DotEffectProps;
  /** Inner dot layer configuration (snappy cursor core) */
  inner?: DotLayerConfig;
  /** Outer shape follower configuration (floating border/shape) */
  outer?: DotLayerConfig;
  /** Trail/particle effect configuration */
  trail?: TrailEffectProps;
  /** Spotlight/glow effect configuration */
  spotlight?: SpotlightEffectProps;
  /** Magnetic attraction & repulsion effect configuration */
  magnetic?: MagneticEffectProps;
  /** Shape morphing effect configuration */
  morph?: MorphEffectProps;
  /** Click reaction effect configuration */
  click?: ClickEffectProps;
}

/** Internal mouse position state */
export interface MousePosition {
  x: number;
  y: number;
}

/** Internal morph state */
export interface MorphState {
  isHovering: boolean;
  targetSize: number;
  targetOpacity: number;
}

/** Internal magnetic offset */
export interface MagneticOffset {
  x: number;
  y: number;
}
