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
  specs: string[];
  tags: string[];
  config: CursorProps;
  accentColor: string;
}

const showcaseCards: CursorCardData[] = [
  {
    number: '01',
    category: 'Minimal',
    title: 'Dot Minimal',
    description: 'Titik simpel yang nempel presisi tanpa jeda, cocok buat web portofolio atau blog bersih.',
    specs: ['10px Core', 'Ngebut', 'Ripple Click'],
    tags: ['dot', 'minimal', 'snappy'],
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
    title: 'Dot + Ring Melayang',
    description: 'Kombinasi titik inti yang lincah dengan cincin luar yang melayang anggun.',
    specs: ['8px Core', '36px Ring', 'Inersia Lembut'],
    tags: ['dual-layer', 'circle', 'floating'],
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
    title: 'Cincin Kosong',
    description: 'Cincin luar berongga tanpa titik tengah, gerakan inersia sangat mengalir.',
    specs: ['38px Ring', 'Mengalir', 'Tanpa Titik'],
    tags: ['outer-only', 'ring', 'smooth'],
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
    category: 'Partikel',
    title: 'Jejak Komet',
    description: 'Ekor partikel lentur yang meliuk dinamis ngikutin ayunan mouse kamu.',
    specs: ['12 Partikel', 'Lentur', 'Burst Click'],
    tags: ['trail', 'comet', 'physics'],
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
    category: 'Interaktif',
    title: 'Magnet & Dorong',
    description: 'Kursor tertarik otomatis ke tombol dan bisa dorong tulisan menjauh.',
    specs: ['Sedot Magnet', 'Dorong Teks', 'Morph Halo'],
    tags: ['magnetic', 'repel', 'morph'],
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
    category: 'Glow',
    title: 'Spotlight Sorot',
    description: 'Cahaya lembut yang menerangi konten tepat di bawah posisi kursor.',
    specs: ['150px Radius', 'Cahaya Lembut', 'Ambient'],
    tags: ['spotlight', 'radial', 'glow'],
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
          <div className="section-eyebrow">Katalog Gaya</div>
          <h2>Pilihan Gaya Kursor</h2>
          <p>
            Arahin kursor kamu ke kartu mana aja untuk langsung ngerasain karakternya.
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
                        <span>🧲 Sedot</span>
                      </button>
                      <span
                        className="card-stage-pill repel-pill"
                        data-magnetic="repel"
                        data-magnetic-displacement="26"
                      >
                        💨 Dorong Teks
                      </span>
                    </div>
                  ) : (
                    <span
                      className="card-stage-pill"
                      data-morph
                      data-morph-size="52"
                    >
                      Sentuh Aku
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
                    <span>Atur di Studio</span>
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
