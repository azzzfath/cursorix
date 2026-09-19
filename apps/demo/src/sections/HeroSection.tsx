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
      {/* Ambient Aurora Glow */}
      <div className="hero-ambient-glow glow-1" />
      <div className="hero-ambient-glow glow-2" />
      <div className="hero-ambient-glow glow-3" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-pill">Release</span>
            <span className="hero-badge-text">v0.1.0 • Cursor Depok for React</span>
          </div>

          <h1 className="hero-title">
            Cursor Depok <br />
            <span className="hero-title-gradient">for React</span>
          </h1>

          <p className="hero-subtitle">
            A lightweight library to add smooth, interactive cursor effects to your React apps. Zero dependencies.
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

          {/* Feature Specs */}
          <div className="hero-features">
            <div className="hero-feature-item">
              <span className="feature-stat">60 FPS</span>
              <strong className="feature-title">Smooth</strong>
              <span className="feature-desc">Zero lag animation</span>
            </div>

            <div className="hero-feature-item">
              <span className="feature-stat">0 deps</span>
              <strong className="feature-title">Lightweight</strong>
              <span className="feature-desc">Pure React &amp; CSS</span>
            </div>

            <div className="hero-feature-item">
              <span className="feature-stat">5 effects</span>
              <strong className="feature-title">Modular</strong>
              <span className="feature-desc">Mix &amp; match anytime</span>
            </div>

            <div className="hero-feature-item">
              <span className="feature-stat">TypeScript</span>
              <strong className="feature-title">Typed</strong>
              <span className="feature-desc">Full type safety</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
