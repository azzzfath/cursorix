<div align="center">

# ✨ Cursorix

<p align="center">
  <strong>Fluid, composable, and hardware-accelerated custom cursor physics for React.</strong>
  <br />
  Mix geometric dual-layer followers, spline trails, ambient spotlights, true magnetic attraction & repulsion, and shape morphing with zero runtime dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cursorix"><img src="https://img.shields.io/npm/v/cursorix?style=for-the-badge&color=e94560&logo=npm" alt="npm version" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-3b82f6.svg?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/Dependencies-0-10b981?style=for-the-badge" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <a href="#-quick-start"><b>Quick Start</b></a> •
  <a href="#-key-features"><b>Key Features</b></a> •
  <a href="#-curated-presets"><b>Presets</b></a> •
  <a href="#-api-reference"><b>API Reference</b></a> •
  <a href="#-framework-integration"><b>Next.js & Vite</b></a> •
  <a href="#-license"><b>License</b></a>
</p>

</div>

---

## 💡 Why Cursorix?

Custom cursors on the web often suffer from input lag, high CPU usage, stutter on high-refresh monitors, and broken mobile gesture handling. 

**Cursorix was built from the ground up to solve these challenges:**
- 🏎️ **Hardware-Accelerated** — Driven by `requestAnimationFrame` with GPU transform translation (`translate3d`). No React state thrashing on mousemove.
- 🧩 **Single Composable API** — Combine dot layers, trails, magnetic physics, and glows in a single `<Cursor />` component.
- 🧲 **True Magnetic Physics** — Both **attraction** (snaps into interactive targets) and **repulsion** (physically pushes text/badges away from the cursor).
- 📱 **Intelligent Touchscreen Sleep** — Automatically shuts down animation loops and unmounts overlays on mobile phones & tablets (`(pointer: coarse)`) to save battery and maintain native touch ergonomics.
- 📦 **Zero External Runtime Dependencies** — Only React & ReactDOM as peer dependencies. Ultra-lightweight bundle size.

---

## 📦 Installation

```bash
# npm
npm install cursorix

# pnpm
pnpm add cursorix

# yarn
yarn add cursorix

# bun
bun add cursorix
```

---

## ⚡ Quick Start

Add `<Cursor />` anywhere inside your React app:

```tsx
import React from 'react';
import { Cursor } from 'cursorix';

export default function App() {
  return (
    <>
      {/* 1. Composable Cursor Component */}
      <Cursor
        dot={{
          inner: { shape: 'circle', color: '#e94560', size: 8, smoothing: 0.8 },
          outer: { shape: 'hexagon-border', color: '#e94560', size: 36, borderWidth: 2, smoothing: 0.15 },
        }}
        trail={{ variant: 'comet', color: '#e94560', length: 10 }}
        magnetic={{ mode: 'both', strength: 0.6, radius: 140 }}
        click={{ variant: 'ripple', color: '#e94560' }}
      />

      {/* 2. Interactive DOM Targets */}
      <main>
        {/* Attracts the cursor magnetically */}
        <button data-magnetic="attract">Attract Me</button>

        {/* Physically dodges & repels away from cursor */}
        <span data-magnetic="repel">Push Me Away!</span>

        {/* Morphs cursor shape & size on hover */}
        <a href="#learn-more" data-morph>Hover to Expand</a>
      </main>
    </>
  );
}
```

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🎯 **Dual Layer Geometric Dots** | Snappy inner core layer combined with a smooth floating outer geometric ring. Supports `circle`, `square`, `triangle`, `pentagon`, `hexagon`, `diamond`, and outline rings. |
| 🧲 **Magnetic Attraction & Repulsion** | Two-way physics: pull cursor toward buttons (`attract`) or physically repel interactive text elements away (`repel`). |
| 🌊 **Spline Trail Engine** | Smooth Catmull-Rom spline curves with `line`, `comet`, `ribbon`, and fading `dots`. |
| 💥 **Tactile Click Feedback** | Micro-interactions on click (`ripple`, `burst`, `pulse`, `shrink`) with dynamic cursor scaling. |
| 💡 **Ambient Glow & Spotlight** | Follower spotlight with `radial`, `gradient`, or `box` variations with configurable blur and opacity. |
| 🔮 **Morphing Targets** | Smoothly morphs cursor dimensions and opacity when hovering elements with `data-morph`. |
| 📱 **Mobile & Reduced Motion Safe** | Automatically pauses and sleeps on touch devices and respects `prefers-reduced-motion`. |

---

## 🎨 Curated Presets

### 1. Minimalist Core & Outer Ring
Snappy inner dot with a smooth floating outer ring:
```tsx
<Cursor
  dot={{
    inner: { shape: 'circle', color: '#0f172a', size: 8, smoothing: 0.8 },
    outer: { shape: 'circle', variant: 'border', color: '#e94560', size: 36, borderWidth: 2, smoothing: 0.15 },
  }}
  magnetic={{ strength: 0.5, radius: 150 }}
/>
```

### 2. Cyberpunk Hexagon & Comet Trail
Geometric polygon cursor with a glowing comet spline trail:
```tsx
<Cursor
  dot={{
    inner: { shape: 'hexagon', color: '#845ef7', size: 10 },
    outer: { shape: 'hexagon-border', color: '#845ef7', size: 40, borderWidth: 2, smoothing: 0.12 },
  }}
  trail={{ variant: 'comet', color: '#845ef7', length: 14 }}
  spotlight={{ variant: 'radial', color: '#845ef7', radius: 180, opacity: 0.12 }}
/>
```

### 3. Kinetic Magnetic & Tactile Click
Interactive cursor that reacts to clicks and button magnets:
```tsx
<Cursor
  dot={{ shape: 'circle', color: '#e94560', size: 12 }}
  magnetic={{ mode: 'both', strength: 0.6, radius: 160, maxDisplacement: 25 }}
  click={{ variant: 'burst', color: '#e94560', size: 48, duration: 450 }}
/>
```

---

## 📖 API Reference

### `<Cursor />` Global Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `zIndex` | `number` | `9999` | z-index layer for all cursor elements. |
| `hideNativeCursor` | `boolean` | `true` | Hides the default browser cursor when custom cursor is active. |
| `disabled` | `boolean` | `false` | Disables all cursor layers and restores native cursor. |
| `dot` | `DotEffectProps` | `undefined` | Dot follower layer configuration. |
| `trail` | `TrailEffectProps` | `undefined` | Trail/particle follower configuration. |
| `spotlight` | `SpotlightEffectProps` | `undefined` | Ambient glow/spotlight layer. |
| `magnetic` | `MagneticEffectProps` | `undefined` | Magnetic attraction and repulsion physics. |
| `click` | `ClickEffectProps` | `undefined` | Tactile click reaction feedback. |
| `morph` | `MorphEffectProps` | `undefined` | Hover morphing configuration. |

---

### `dot` Props

Supports **Dual Layer** (`inner` + `outer`) or **Single Layer** configuration:

```tsx
interface DotLayerConfig {
  shape?: 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'diamond' | 'ring' | 'triangle-border' | 'square-border' | 'pentagon-border' | 'hexagon-border';
  variant?: 'filled' | 'border';
  color?: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  smoothing?: number;      // 0 = floaty delay, 1 = instant follow
  mixBlendMode?: string;   // e.g. "difference"
  rotation?: number;
}
```

---

### `magnetic` Physics Props

```tsx
interface MagneticEffectProps {
  mode?: 'attract' | 'repel' | 'both';  // Default: 'both'
  radius?: number;                       // Activation distance in px (Default: 150)
  strength?: number;                     // Physics strength 0 to 1 (Default: 0.5)
  maxDisplacement?: number;              // Max push distance in px for repel targets (Default: 30)
}
```

#### In your HTML / JSX:
```html
<!-- Magnetically pulls the cursor toward the center of the button -->
<button data-magnetic="attract">Magnetic Button</button>

<!-- Custom attraction strength per element -->
<button data-magnetic data-magnetic-strength="0.85">High Gravity</button>

<!-- Physically dodges & repels text away like real magnetic poles -->
<span data-magnetic="repel">Don't Touch Me!</span>

<!-- Repel with custom dodge distance -->
<span data-repel data-magnetic-displacement="45">Extreme Dodge</span>
```

---

### `trail` Props

```tsx
interface TrailEffectProps {
  variant?: 'dots' | 'line' | 'comet' | 'ribbon'; // Default: 'dots'
  color?: string;                                // Default: '#000'
  length?: number;                               // Number of trail nodes (Default: 8)
  size?: number;                                 // Particle size / line width in px (Default: 8)
  fadeOut?: boolean;                             // Whether trail nodes fade out (Default: true)
  smoothing?: number;                            // Follow smoothing factor (Default: 0.2)
  borderColor?: string;
  borderWidth?: number;
}
```

---

### `click` Props

```tsx
interface ClickEffectProps {
  variant?: 'ripple' | 'burst' | 'pulse' | 'shrink'; // Default: 'ripple'
  color?: string;                                    // Default: '#e94560'
  size?: number;                                     // Effect radius in px (Default: 40)
  duration?: number;                                 // Animation duration in ms (Default: 400)
  scale?: number;                                    // Scale factor for dot on click (Default: 0.8)
  borderWidth?: number;                              // Ripple ring thickness (Default: 2)
}
```

---

## ⚡ Framework Integration

### Next.js (App Router)

Because Cursorix interacts with browser DOM and animation frames, simply wrap it in a client component:

```tsx
// components/CustomCursor.tsx
'use client';

import { Cursor } from 'cursorix';

export function CustomCursor() {
  return (
    <Cursor
      dot={{
        inner: { shape: 'circle', color: '#e94560', size: 8 },
        outer: { shape: 'circle', variant: 'border', color: '#e94560', size: 32 },
      }}
      magnetic={{ mode: 'both' }}
    />
  );
}
```

Then include it in your root `app/layout.tsx`:

```tsx
// app/layout.tsx
import { CustomCursor } from '@/components/CustomCursor';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
```

### Vite + React

Just import and add `<Cursor />` in your `App.tsx` directly!

---

## 📂 Monorepo Architecture

This project is built as an open source monorepo managed with `pnpm`:

```
cursorix/
├── packages/
│   └── cursorix/          # Core React library (published to npm)
│       ├── src/
│       │   ├── effects/   # Modular effect layers (Dot, Trail, Spotlight, Magnet, Click, Morph)
│       │   ├── hooks/     # Physics & event hooks (useMousePosition, useMagnetic, useMorph)
│       │   ├── styles/    # Hardware-accelerated CSS
│       │   └── Cursor.tsx # Composable single component
│       ├── tsup.config.ts # ESM + CJS + DTS bundler
│       └── package.json
└── apps/
    └── demo/              # Interactive showcase & live studio (Vite + React)
        ├── src/
        └── package.json
```

---

## 🛠️ Local Development

```bash
# 1. Clone the repository
git clone https://github.com/azzzfath/cursorix.git
cd cursorix

# 2. Install workspace dependencies
pnpm install

# 3. Start local development server (demo studio)
pnpm dev

# 4. Build cursorix library package
pnpm --filter cursorix build

# 5. Build all packages & demo website
pnpm build:all
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/azzzfath/cursorix/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) © 2026-present [Cursorix Contributors](https://github.com/azzzfath/cursorix).
