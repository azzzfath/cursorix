# Cursorix - React Custom Cursor Library

## Project Overview

**Cursorix** adalah library React untuk membuat custom cursor effects yang indah dan performant di website. Library ini menyediakan berbagai jenis cursor effects melalui component-based API yang mudah digunakan.

## Tech Stack

| Area | Technology |
|------|-----------|
| Language | TypeScript |
| Library Framework | React 18+ |
| Build Tool (Library) | tsup (untuk bundling library) |
| Demo Website | Vite + React |
| Animation | Pure CSS transitions + `requestAnimationFrame` (zero external dependency) |
| Package Manager | pnpm (monorepo workspace) |
| Publishing | npm |

## Project Structure

```
cursorix/
├── AGENTS.md
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml
├── packages/
│   └── cursorix/                   # Library package
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsup.config.ts
│       ├── README.md
│       └── src/
│           ├── index.ts            # Public exports
│           ├── types.ts            # Shared TypeScript types & effect interfaces
│           ├── Cursor.tsx          # Single composable <Cursor /> component
│           ├── hooks/
│           │   ├── useMousePosition.ts  # Track mouse position
│           │   ├── useMagnetic.ts       # Magnetic effect logic (detect data-magnetic)
│           │   └── useMorph.ts          # Morph effect logic (detect data-morph)
│           ├── effects/
│           │   ├── DotEffect.tsx        # Dot follower layer
│           │   ├── TrailEffect.tsx      # Trail/particle layer
│           │   ├── SpotlightEffect.tsx  # Spotlight/glow layer
│           │   ├── MagneticEffect.tsx   # Magnetic attraction layer
│           │   └── MorphEffect.tsx      # Shape morphing layer
│           └── styles/
│               └── cursors.css         # Base cursor styles
└── apps/
    └── demo/                       # Demo website (Vite + React)
        ├── package.json
        ├── vite.config.ts
        ├── index.html
        ├── public/
        └── src/
            ├── main.tsx
            ├── App.tsx
            ├── index.css           # Global styles
            ├── components/
            │   ├── Header.tsx
            │   ├── CursorShowcase.tsx    # Grid showcase semua cursor
            │   ├── CursorCard.tsx        # Card per cursor effect
            │   ├── InteractiveDemo.tsx   # Interactive playground
            │   ├── CodeExample.tsx       # Contoh kode penggunaan
            │   └── Footer.tsx
            └── sections/
                ├── HeroSection.tsx
                ├── ShowcaseSection.tsx
                ├── PlaygroundSection.tsx
                └── InstallSection.tsx
```

## API Design

### Composable Single Component API

Semua cursor effects dikontrol melalui satu `<Cursor />` component. Setiap effect adalah prop opsional yang bisa di-mix & match sesuka hati.

```tsx
import { Cursor } from 'cursorix';

function App() {
  return (
    <>
      {/* Mix & match effects sesuka hati! */}
      <Cursor
        dot={{ color: "#ff6b6b", size: 20 }}
        trail={{ color: "#4ecdc4", length: 10 }}
        spotlight={{ radius: 150, opacity: 0.15 }}
      />

      {/* Atau cuma satu effect */}
      <Cursor dot={{ size: 16, color: "#000" }} />

      <YourApp />
    </>
  );
}
```

### Effect Props

Setiap effect diaktifkan dengan passing object ke prop yang sesuai. Kalau prop tidak di-pass, effect-nya tidak aktif.

#### `dot` — Dot Follower Effect
Titik / bentuk geometris yang mengikuti mouse dengan smooth animation. Mendukung **single dot** ataupun **dual layer (inner + outer)** dengan bentuk poligon (segitiga, segi empat, segi lima, segi enam, lingkaran) dan varian border/ring.

```tsx
dot?: {
  // 1. Dual Layer Configuration (Inner + Outer)
  inner?: {
    shape?: 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'diamond' | 'ring' | 'triangle-border' | 'square-border' | 'pentagon-border' | 'hexagon-border'
    variant?: 'filled' | 'border' // Default: "filled"
    color?: string                // Default: "#000"
    size?: number                 // Default: 8
    borderColor?: string
    borderWidth?: number          // Default: 2
    smoothing?: number            // Smoothing 0-1, default: 0.8 (snappy follow)
    mixBlendMode?: string
    rotation?: number
  }
  outer?: {
    shape?: 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'diamond' | 'ring' | 'triangle-border' | 'square-border' | 'pentagon-border' | 'hexagon-border'
    variant?: 'filled' | 'border' // Default: "border"
    color?: string                // Default: "#000"
    size?: number                 // Default: 36
    borderColor?: string
    borderWidth?: number          // Default: 2
    smoothing?: number            // Smoothing 0-1, default: 0.15 (smooth float follow)
    mixBlendMode?: string
    rotation?: number
  }

  // 2. Atau Single Layer Configuration (Backward compatible)
  shape?: 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'diamond' | 'ring' | 'triangle-border' | 'square-border' | 'pentagon-border' | 'hexagon-border'
  variant?: 'filled' | 'border'
  color?: string           // Default: "#000"
  size?: number            // Diameter dalam px, default: 20
  borderColor?: string     // Border color
  borderWidth?: number     // Border width, default: 2
  smoothing?: number       // Smoothing factor 0-1, default: 0.15
  mixBlendMode?: string    // CSS mix-blend-mode, default: "normal"
  rotation?: number
}
```

#### `trail` — Trail/Particle Effect
Jejak partikel/titik yang mengikuti mouse.

```tsx
trail?: {
  variant?: 'dots' | 'line' | 'comet' | 'ribbon' 
                             // Jenis trail, default: "dots"
  color?: string           // Default: "#000"
  length?: number          // Jumlah trail dots / panjang trail, default: 8
  size?: number            // Ukuran trail dot / ketebalan line, default: 8
  fadeOut?: boolean         // Apakah trail menghilang, default: true
  smoothing?: number       // Smoothing factor, default: 0.2
  borderColor?: string     // Border/outline color, default: none
  borderWidth?: number     // Border/outline width, default: 0
}
```

#### `spotlight` — Spotlight/Glow Effect
Efek spotlight/glow yang mengikuti mouse.

```tsx
spotlight?: {
  variant?: 'radial' | 'gradient' | 'box'
                             // Jenis spotlight, default: "radial"
  color?: string           // Warna spotlight, default: "#fff"
  radius?: number          // Radius spotlight, default: 150
  opacity?: number         // Opacity, default: 0.15
  blur?: number            // Blur amount, default: 40
}
```

#### `magnetic` — Magnetic Attraction Effect
Cursor tertarik ke elemen yang memiliki attribute `data-magnetic`.

```tsx
magnetic?: {
  radius?: number          // Jarak magnet aktif dalam px, default: 150
  strength?: number        // Kekuatan magnet 0-1, default: 0.5
}
```

Target elemen cukup diberi `data-magnetic` attribute:
```html
<button data-magnetic>Hover me — cursor akan tertarik!</button>

<!-- Override strength per elemen -->
<button data-magnetic data-magnetic-strength="0.8">Strong magnet</button>
```

#### `morph` — Shape Morphing Effect
Cursor berubah ukuran/bentuk saat hover elemen yang memiliki attribute `data-morph`.

```tsx
morph?: {
  hoverSize?: number       // Ukuran saat hover, default: 60
  hoverOpacity?: number    // Opacity saat hover, default: 0.2
  duration?: number        // Durasi animasi ms, default: 300
}
```

Target elemen cukup diberi `data-morph` attribute:
```html
<a href="#" data-morph>Hover me — cursor akan membesar!</a>

<!-- Override size per elemen -->
<a href="#" data-morph data-morph-size="80">Big morph</a>
```

### Global Props

Props yang berlaku untuk keseluruhan `<Cursor />` component:

```tsx
<Cursor
  zIndex?: number          // z-index untuk semua effects, default: 9999
  hideNativeCursor?: boolean // Sembunyikan cursor native, default: true
  disabled?: boolean       // Disable semua effects, default: false

  // Effect props
  dot?: DotEffectProps
  trail?: TrailEffectProps
  spotlight?: SpotlightEffectProps
  magnetic?: MagneticEffectProps
  morph?: MorphEffectProps
/>
```

### Contoh Kombinasi

```tsx
{/* 1. Dot + Spotlight — cursor titik dengan glow effect */}
<Cursor
  dot={{ color: "#1a1a2e", size: 12 }}
  spotlight={{ radius: 200, opacity: 0.1, color: "#e94560" }}
/>

{/* 2. Dot + Trail — cursor titik dengan jejak partikel */}
<Cursor
  dot={{ color: "#4ecdc4", size: 10 }}
  trail={{ length: 12, fadeOut: true, color: "#4ecdc4" }}
/>

{/* 3. Dot + Magnetic + Morph — interactive cursor */}
<Cursor
  dot={{ color: "#000", size: 16, mixBlendMode: "difference" }}
  magnetic={{ strength: 0.6, radius: 200 }}
  morph={{ hoverSize: 50, hoverOpacity: 0.15 }}
/>
```

## Design Guidelines (Demo Website)

### Theme: Light Minimalist
- **Background**: Putih bersih (`#ffffff`) dengan subtle pattern/noise
- **Accent Colors**: Curated palette, bukan warna generic
  - Primary: `#1a1a2e` (dark navy)
  - Secondary: `#e94560` (coral red)
  - Tertiary: `#0f3460` (deep blue)
  - Neutral: `#f5f5f5`, `#e0e0e0`
- **Typography**: Google Fonts - "Inter" untuk body, "Space Grotesk" untuk headings
- **Layout**: Clean whitespace, grid-based showcase
- **Interactions**: Subtle hover animations, smooth transitions
- **Cards**: Soft shadows, rounded corners, subtle borders

### Demo Website Sections
1. **Hero**: Nama library, tagline, CTA install command
2. **Showcase**: Grid of cards, masing-masing menampilkan satu cursor type. Saat hover card, cursor berubah sesuai tipe.
3. **Playground**: Interactive section dimana user bisa coba switch antar cursor types dan tweak props
4. **Installation**: Copy-paste install command dan contoh kode
5. **Footer**: Links ke GitHub, npm, docs

## Development Rules

### Code Style
- Gunakan functional components dan React hooks
- Semua komponen harus typed dengan TypeScript (no `any`)
- Export semua public API dari `src/index.ts`
- Gunakan `forwardRef` jika komponen perlu expose ref
- Naming convention: PascalCase untuk components, camelCase untuk hooks/utils

### Performance
- Gunakan `requestAnimationFrame` untuk smooth cursor animation
- Avoid re-render unnecessary - gunakan `useRef` untuk posisi mouse
- CSS transforms untuk pergerakan cursor (GPU accelerated)
- Cursor elements harus `position: fixed` dan `pointer-events: none`
- Cleanup semua event listeners dan animation frames di `useEffect` cleanup

### Accessibility
- Cursor effects bersifat visual enhancement only
- Pastikan default cursor tetap ada (hide native cursor hanya di area yang ada custom cursor)
- Respect `prefers-reduced-motion` media query - disable animations jika user memilih reduced motion

### Library Build
- Build dengan `tsup` - output ESM dan CJS
- Include CSS file yang bisa di-import
- Include TypeScript declaration files
- `peerDependencies`: react >= 18.0.0, react-dom >= 18.0.0
- Zero runtime dependency (selain React)

### Testing & Verification
- Pastikan `pnpm build` berhasil di packages/cursorix
- Pastikan `pnpm dev` di apps/demo berjalan tanpa error
- Test setiap cursor type secara visual di demo website
- Pastikan smooth animation tanpa jank
