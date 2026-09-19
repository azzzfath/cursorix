import { useState } from 'react';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

const installCommands: Record<PackageManager, string> = {
  npm: 'npm install cursor-depok',
  pnpm: 'pnpm add cursor-depok',
  yarn: 'yarn add cursor-depok',
  bun: 'bun add cursor-depok',
};

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [pm, setPm] = useState<PackageManager>('npm');

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommands[pm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-pill">Open Source</span>
            <span className="hero-badge-text">v0.1.0 for React 18 & 19</span>
          </div>

          <h1 className="hero-title">
            Cursor Depok
          </h1>

          <p className="hero-tagline">
            Custom cursors that feel good.
          </p>

          <p className="hero-subtitle">
            A small React library for smooth, physics-based cursor interactions.
            Drop in magnetic buttons, fluid trails, and hover morphs with zero dependencies.
          </p>

          {/* Package Manager & Copy Bar */}
          <div className="hero-install-wrapper">
            <div className="pm-tabs">
              {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((manager) => (
                <button
                  key={manager}
                  className={`pm-tab ${pm === manager ? 'active' : ''}`}
                  onClick={() => setPm(manager)}
                  type="button"
                >
                  {manager}
                </button>
              ))}
            </div>

            <div
              className="hero-install"
              onClick={handleCopy}
              id="hero-install-btn"
              data-morph
              data-magnetic
              title="Click to copy command"
            >
              <div className="hero-install-left">
                <span className="prefix">$</span>
                <span className="install-text">{installCommands[pm]}</span>
              </div>
              <div className="copy-action">
                <span className="copy-icon">
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </span>
                <span className="copy-tooltip">{copied ? 'Copied' : 'Copy'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Tactile Mini Sandbox */}
          <div className="hero-sandbox">
            <div className="hero-sandbox-top">
              <div className="sandbox-header-left">
                <span className="sandbox-pulse-dot" />
                <span className="sandbox-title">Interactive Preview</span>
              </div>
              <span className="sandbox-hint">Move your mouse over the controls below</span>
            </div>

            <div className="hero-sandbox-buttons">
              <button
                type="button"
                className="sandbox-btn magnet-btn"
                data-magnetic="attract"
                data-magnetic-strength="0.85"
              >
                <span>Magnetic Button</span>
              </button>

              <span
                className="sandbox-btn repel-btn"
                data-magnetic="repel"
                data-magnetic-displacement="26"
              >
                <span>Repel Element</span>
              </span>

              <button
                type="button"
                className="sandbox-btn morph-btn"
                data-morph
                data-morph-size="64"
              >
                <span>Hover to Morph</span>
              </button>

              <button
                type="button"
                className="sandbox-btn click-btn"
              >
                <span>Click for Ripple</span>
              </button>
            </div>

            <div className="hero-sandbox-note">
              <span>Runs on <code>requestAnimationFrame</code> • Zero dependencies • Smooth 60+ FPS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
