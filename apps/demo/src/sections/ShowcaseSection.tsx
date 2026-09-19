import { useState } from 'react';
import type { CursorProps } from 'cursor-depok';

interface ShowcaseSectionProps {
  onCursorChange: (config: CursorProps) => void;
}

interface CursorCardData {
  number: string;
  category: string;
  title: string;
  description: string;
  config: CursorProps;
  accentColor: string;
}

const showcaseCards: CursorCardData[] = [
  {
    number: '01',
    category: 'Minimal',
    title: 'Snappy Dot',
    description: 'Instant response without floating delay. Simple, focused, and precise.',
    accentColor: '#e11d48',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#e11d48', size: 10, smoothing: 0.95 },
      },
      click: { variant: 'ripple', color: '#e11d48', size: 36 },
    },
  },
  {
    number: '02',
    category: 'Dual Layer',
    title: 'Dot + Ring',
    description: 'A tight inner core paired with a trailing outer ring that floats with momentum.',
    accentColor: '#f97316',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#f97316', size: 8, smoothing: 0.95 },
        outer: { shape: 'circle', color: '#f97316', size: 36, borderWidth: 2, smoothing: 0.45 },
      },
      click: { variant: 'ripple', color: '#f97316', size: 38 },
    },
  },
  {
    number: '03',
    category: 'Outline',
    title: 'Hollow Ring',
    description: 'A minimalist circular outline with smooth inertial movement and no center dot.',
    accentColor: '#0891b2',
    config: {
      dot: {
        outer: { shape: 'circle', color: '#0891b2', size: 38, borderWidth: 2, smoothing: 0.4 },
      },
      click: { variant: 'ripple', color: '#0891b2', size: 40 },
    },
  },
  {
    number: '04',
    category: 'Particle',
    title: 'Particle Trail',
    description: 'A curving comet tail of fading dots that bends naturally as you move.',
    accentColor: '#7c3aed',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#7c3aed', size: 8, smoothing: 0.95 },
      },
      trail: { variant: 'comet', color: '#7c3aed', length: 12, size: 6 },
      click: { variant: 'burst', color: '#7c3aed', size: 36 },
    },
  },
  {
    number: '05',
    category: 'Interactive',
    title: 'Magnetic & Repel',
    description: 'Snaps cleanly to interactive buttons while gently pushing surrounding text away.',
    accentColor: '#2563eb',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#2563eb', size: 8, smoothing: 0.95 },
        outer: { shape: 'circle', color: '#2563eb', size: 34, borderWidth: 2, smoothing: 0.45 },
      },
      magnetic: { mode: 'both', radius: 150, strength: 0.6, maxDisplacement: 32 },
      morph: { hoverSize: 56, hoverOpacity: 0.2, duration: 300 },
      click: { variant: 'ripple', color: '#2563eb', size: 36 },
    },
  },
  {
    number: '06',
    category: 'Lighting',
    title: 'Soft Spotlight',
    description: 'A gentle luminous disc that illuminates whatever section your pointer is over.',
    accentColor: '#d97706',
    config: {
      dot: {
        inner: { shape: 'circle', color: '#d97706', size: 8, smoothing: 0.95 },
      },
      spotlight: { variant: 'radial', color: '#d97706', radius: 150, opacity: 0.15 },
      click: { variant: 'pulse', color: '#d97706', size: 40 },
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
          <div className="section-eyebrow">Presets</div>
          <h2>Preset Styles</h2>
          <p>
            Hover over any preset to feel its physics. Click to activate it across the page.
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
                    <h3>{card.title}</h3>
                  </div>
                  <div className="card-header-right">
                    <span className={`card-status-badge ${isActive ? 'active' : ''}`}>
                      <span className="card-status-dot" />
                      {isActive ? 'Active' : 'Preview'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="cursor-card-content">
                  <p>{card.description}</p>
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
                        <span>Magnetic Button</span>
                      </button>
                      <span
                        className="card-stage-pill repel-pill"
                        data-magnetic="repel"
                        data-magnetic-displacement="26"
                      >
                        Repel Text
                      </span>
                    </div>
                  ) : (
                    <span
                      className="card-stage-pill"
                      data-morph
                      data-morph-size="52"
                    >
                      Hover to Test
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="cursor-card-footer">
                  <span className="card-footer-hint">
                    {isActive ? 'Currently active' : 'Click to select'}
                  </span>

                  <a
                    href="#playground"
                    className="card-customize-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCursorChange(card.config);
                    }}
                  >
                    <span>Customize</span>
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
