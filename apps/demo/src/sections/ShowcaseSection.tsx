import { useState } from 'react';
import type { CursorProps } from 'cursorix';

interface ShowcaseSectionProps {
  onCursorChange: (config: CursorProps) => void;
}

interface CursorCardData {
  number: string;
  category: string;
  title: string;
  description: string;
  specs: string[];
  tags: string[];
  config: CursorProps;
  accentColor: string;
}

const showcaseCards: CursorCardData[] = [
  {
    number: '01',
    category: 'Minimal',
    title: 'Dot Only',
    description: 'Ultra-minimalist single dot tracking your cursor with snappy zero-lag precision.',
    specs: ['Dot: 10px', 'Smooth: 0.95', 'Tactile Click'],
    tags: ['dot', 'minimal', 'snappy'],
    accentColor: '#e94560',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#e94560', size: 10, smoothing: 0.95 },
      },
      click: { variant: 'ripple', color: '#e94560', size: 36 },
    },
  },
  {
    number: '02',
    category: 'Dual-Layer',
    title: 'Dot + Outer Ring',
    description: 'The signature dual-layer: responsive inner core with a smooth floating outer halo.',
    specs: ['Core: 8px', 'Ring: 36px', 'Float: 0.45'],
    tags: ['dual-layer', 'circle', 'floating'],
    accentColor: '#ff6b6b',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#ff6b6b', size: 8, smoothing: 0.95 },
        outer: { shape: 'circle', color: '#ff6b6b', size: 36, borderWidth: 2, smoothing: 0.45 },
      },
      click: { variant: 'ripple', color: '#ff6b6b', size: 38 },
    },
  },
  {
    number: '03',
    category: 'Outline',
    title: 'Outer Only',
    description: 'Hollow ring with smooth inertial float and zero inner dot for clean aesthetics.',
    specs: ['Ring: 38px', 'Smooth: 0.40', 'Zero Core'],
    tags: ['outer-only', 'ring', 'smooth'],
    accentColor: '#4ecdc4',
    config: {
      dot: {
        outer: { shape: 'circle', color: '#4ecdc4', size: 38, borderWidth: 2, smoothing: 0.4 },
      },
      click: { variant: 'ripple', color: '#4ecdc4', size: 40 },
    },
  },
  {
    number: '04',
    category: 'Particle',
    title: 'Fluid Comet Trail',
    description: 'Aerodynamic particle tail that gracefully curves with cursor momentum.',
    specs: ['Trail: 12 Dots', 'Comet Tail', 'Particle Burst'],
    tags: ['trail', 'comet', 'physics'],
    accentColor: '#845ef7',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#845ef7', size: 8, smoothing: 0.95 },
      },
      trail: { variant: 'comet', color: '#845ef7', length: 12, size: 6 },
      click: { variant: 'burst', color: '#845ef7', size: 36 },
    },
  },
  {
    number: '05',
    category: 'Physics',
    title: 'Magnetic & Morph',
    description: 'Snaps to buttons, physically pushes repel text away, and expands into a hover halo.',
    specs: ['Attract & Repel', 'Push: 32px', 'Morph Halo'],
    tags: ['magnetic', 'repel', 'morph'],
    accentColor: '#06b6d4',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#06b6d4', size: 8, smoothing: 0.95 },
        outer: { shape: 'circle', color: '#06b6d4', size: 34, borderWidth: 2, smoothing: 0.45 },
      },
      magnetic: { mode: 'both', radius: 150, strength: 0.6, maxDisplacement: 32 },
      morph: { hoverSize: 56, hoverOpacity: 0.2, duration: 300 },
      click: { variant: 'ripple', color: '#06b6d4', size: 36 },
    },
  },
  {
    number: '06',
    category: 'Lighting',
    title: 'Ambient Spotlight',
    description: 'Soft radial beam illuminating the content directly beneath the cursor.',
    specs: ['Radius: 150px', 'Radial Glow', 'Soft Pulse'],
    tags: ['spotlight', 'radial', 'glow'],
    accentColor: '#f59e0b',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#f59e0b', size: 8, smoothing: 0.95 },
      },
      spotlight: { variant: 'radial', color: '#f59e0b', radius: 150, opacity: 0.15 },
      click: { variant: 'pulse', color: '#f59e0b', size: 40 },
    },
  },
];

export function ShowcaseSection({ onCursorChange }: ShowcaseSectionProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  const handleCardEnter = (card: CursorCardData, index: number) => {
    setActiveIdx(index);
    onCursorChange(card.config);
  };

  return (
    <section id="showcase" className="showcase-section">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Curated Presets</div>
          <h2>Explore Signature Styles</h2>
          <p>
            Hover over any preset card to instantly feel its geometry, smoothing, and physics.
          </p>
        </div>

        <div className="showcase-grid">
          {showcaseCards.map((card, index) => {
            const isActive = activeIdx === index;
            return (
              <div
                key={index}
                className={`cursor-card ${isActive ? 'card-active' : ''}`}
                onMouseEnter={() => handleCardEnter(card, index)}
                onClick={() => handleCardEnter(card, index)}
                id={`showcase-card-${index}`}
                style={{ '--card-accent': card.accentColor } as React.CSSProperties}
              >
                {/* Header */}
                <div className="cursor-card-header">
                  <div className="card-header-left">
                    <span className="card-index-num">{card.number}</span>
                    <span className="card-category-tag">{card.category}</span>
                  </div>
                  <div className="card-header-right">
                    <span className={`card-status-badge ${isActive ? 'active' : ''}`}>
                      <span className="card-status-dot" />
                      {isActive ? 'Active' : 'Hover'}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="cursor-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>

                {/* Key Specs Pills */}
                <div className="card-specs-row">
                  {card.specs.map((spec, sIdx) => (
                    <span key={sIdx} className="card-spec-item">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Interactive Test Pad */}
                <div className="cursor-card-stage">
                  {card.number === '05' ? (
                    <div className="card-stage-split">
                      <button
                        className="card-stage-pill attract-pill"
                        data-magnetic="attract"
                        data-magnetic-strength="0.8"
                        type="button"
                      >
                        <span>🧲 Attract</span>
                      </button>
                      <span
                        className="card-stage-pill repel-pill"
                        data-magnetic="repel"
                        data-magnetic-displacement="26"
                      >
                        💨 Repel Text
                      </span>
                    </div>
                  ) : (
                    <span
                      className="card-stage-pill"
                      data-morph
                      data-morph-size="52"
                    >
                      Hover Target
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="cursor-card-footer">
                  <div className="cursor-card-tags">
                    {card.tags.map((tag) => (
                      <span key={tag} className="cursor-card-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#playground"
                    className="card-customize-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCursorChange(card.config);
                    }}
                  >
                    <span>Studio</span>
                    <span className="arrow-icon">→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
