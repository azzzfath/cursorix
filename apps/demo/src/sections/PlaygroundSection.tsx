import { useState, useMemo, useEffect } from 'react';
import type { CursorProps, DotShape, DotLayerConfig, TrailVariant, SpotlightVariant, ClickVariant } from 'cursor-depok';
import { CodeExample } from '../components/CodeExample';

interface PlaygroundSectionProps {
  onConfigChange: (config: CursorProps) => void;
}

interface NumberSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

function NumberSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: NumberSliderProps) {
  const [textValue, setTextValue] = useState(String(value));

  useEffect(() => {
    setTextValue(String(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTextValue(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(textValue);
    if (isNaN(parsed)) {
      setTextValue(String(value));
    } else {
      const clamped = Math.max(min, Math.min(max, parsed));
      setTextValue(String(clamped));
      onChange(clamped);
    }
  };

  return (
    <div className="control-row">
      <span className="control-label">{label}</span>
      <div className="control-slider-group">
        <input
          type="range"
          className="control-slider"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const num = Number(e.target.value);
            setTextValue(String(num));
            onChange(num);
          }}
        />
        <div className="control-number-wrapper">
          <input
            type="number"
            className="control-number-input"
            min={min}
            max={max}
            step={step}
            value={textValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {unit && <span className="control-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

const shapeOptions: { label: string; value: DotShape }[] = [
  { label: 'Circle', value: 'circle' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Square', value: 'square' },
  { label: 'Pentagon', value: 'pentagon' },
  { label: 'Hexagon', value: 'hexagon' },
  { label: 'Diamond', value: 'diamond' },
];

export function PlaygroundSection({ onConfigChange }: PlaygroundSectionProps) {
  const [enabledEffects, setEnabledEffects] = useState({
    innerDot: true,
    outerEffect: true,
    trail: false,
    spotlight: false,
    magnetic: true,
    morph: false,
    click: true,
  });

  const [innerConfig, setInnerConfig] = useState<DotLayerConfig>({
    shape: 'circle',
    variant: 'filled',
    color: '#e94560',
    size: 8,
    borderWidth: 2,
    smoothing: 0.95,
  });

  const [outerConfig, setOuterConfig] = useState<DotLayerConfig>({
    shape: 'circle',
    variant: 'border',
    color: '#e94560',
    size: 36,
    borderWidth: 2,
    smoothing: 0.45,
  });

  const [mixBlendMode, setMixBlendMode] = useState('normal');

  const [trailConfig, setTrailConfig] = useState({
    variant: 'dots' as TrailVariant,
    color: '#4ecdc4',
    length: 8,
    size: 8,
    fadeOut: true,
  });

  const [spotlightConfig, setSpotlightConfig] = useState({
    variant: 'radial' as SpotlightVariant,
    color: '#ffffff',
    radius: 150,
    opacity: 0.15,
    blur: 40,
  });

  const [magneticConfig, setMagneticConfig] = useState({
    mode: 'both' as 'attract' | 'repel' | 'both',
    radius: 150,
    strength: 0.6,
    maxDisplacement: 32,
  });

  const [morphConfig, setMorphConfig] = useState({
    hoverSize: 60,
    hoverOpacity: 0.2,
    duration: 300,
  });

  const [clickConfig, setClickConfig] = useState({
    variant: 'ripple' as ClickVariant,
    color: '#e94560',
    size: 38,
    duration: 400,
    scale: 0.82,
    borderWidth: 2,
  });

  const [activePreset, setActivePreset] = useState<string>('dual-circle');

  const updateCursor = (overrides?: {
    effects?: typeof enabledEffects;
    inner?: DotLayerConfig;
    outer?: DotLayerConfig;
    blend?: string;
    trail?: typeof trailConfig;
    spotlight?: typeof spotlightConfig;
    magnetic?: typeof magneticConfig;
    morph?: typeof morphConfig;
    click?: typeof clickConfig;
  }) => {
    const eff = overrides?.effects ?? enabledEffects;
    const inn = overrides?.inner ?? innerConfig;
    const out = overrides?.outer ?? outerConfig;
    const bl = overrides?.blend ?? mixBlendMode;
    const tr = overrides?.trail ?? trailConfig;
    const sp = overrides?.spotlight ?? spotlightConfig;
    const mg = overrides?.magnetic ?? magneticConfig;
    const mo = overrides?.morph ?? morphConfig;
    const cl = overrides?.click ?? clickConfig;

    const config: CursorProps = {};
    if (eff.innerDot && eff.outerEffect) {
      config.dot = {
        inner: inn,
        outer: out,
        mixBlendMode: bl,
      };
    } else if (eff.innerDot) {
      config.dot = {
        inner: inn,
        mixBlendMode: bl,
      };
    } else if (eff.outerEffect) {
      config.dot = {
        outer: out,
        mixBlendMode: bl,
      };
    }

    if (eff.trail) config.trail = tr;
    if (eff.spotlight) config.spotlight = sp;
    if (eff.magnetic) config.magnetic = mg;
    if ((eff.innerDot || eff.outerEffect) && eff.morph) config.morph = mo;
    if (eff.click) config.click = cl;
    onConfigChange(config);
  };

  const applyPreset = (preset: 'dot-only' | 'dual-circle' | 'outer-only' | 'comet' | 'cyber-hex' | 'combo') => {
    setActivePreset(preset);
    switch (preset) {
      case 'dot-only': {
        const effects = { innerDot: true, outerEffect: false, trail: false, spotlight: false, magnetic: true, morph: false, click: true };
        const inn: DotLayerConfig = { shape: 'circle', variant: 'filled', color: '#e94560', size: 10, borderWidth: 0, smoothing: 0.95 };
        setEnabledEffects(effects);
        setInnerConfig(inn);
        updateCursor({ effects, inner: inn });
        break;
      }
      case 'dual-circle': {
        const effects = { innerDot: true, outerEffect: true, trail: false, spotlight: false, magnetic: true, morph: false, click: true };
        const inn: DotLayerConfig = { shape: 'circle', variant: 'filled', color: '#ff6b6b', size: 8, borderWidth: 2, smoothing: 0.95 };
        const out: DotLayerConfig = { shape: 'circle', variant: 'border', color: '#ff6b6b', size: 36, borderWidth: 2, smoothing: 0.45 };
        setEnabledEffects(effects);
        setInnerConfig(inn);
        setOuterConfig(out);
        updateCursor({ effects, inner: inn, outer: out });
        break;
      }
      case 'outer-only': {
        const effects = { innerDot: false, outerEffect: true, trail: false, spotlight: false, magnetic: true, morph: false, click: true };
        const out: DotLayerConfig = { shape: 'circle', variant: 'border', color: '#4ecdc4', size: 38, borderWidth: 2, smoothing: 0.4 };
        setEnabledEffects(effects);
        setOuterConfig(out);
        updateCursor({ effects, outer: out });
        break;
      }
      case 'comet': {
        const effects = { innerDot: true, outerEffect: false, trail: true, spotlight: false, magnetic: true, morph: false, click: true };
        const inn: DotLayerConfig = { shape: 'circle', variant: 'filled', color: '#845ef7', size: 8, borderWidth: 2, smoothing: 0.95 };
        const tr = { variant: 'comet' as TrailVariant, color: '#845ef7', length: 12, size: 6, fadeOut: true };
        setEnabledEffects(effects);
        setInnerConfig(inn);
        setTrailConfig(tr);
        updateCursor({ effects, inner: inn, trail: tr });
        break;
      }
      case 'cyber-hex': {
        const effects = { innerDot: true, outerEffect: true, trail: true, spotlight: false, magnetic: true, morph: true, click: true };
        const inn: DotLayerConfig = { shape: 'hexagon', variant: 'filled', color: '#06b6d4', size: 8, borderWidth: 2, smoothing: 0.95 };
        const out: DotLayerConfig = { shape: 'hexagon', variant: 'border', color: '#06b6d4', size: 38, borderWidth: 2, smoothing: 0.45 };
        const tr = { variant: 'dots' as TrailVariant, color: '#06b6d4', length: 6, size: 4, fadeOut: true };
        const mg = { mode: 'both' as const, radius: 140, strength: 0.6, maxDisplacement: 32 };
        const mo = { hoverSize: 56, hoverOpacity: 0.2, duration: 300 };
        setEnabledEffects(effects);
        setInnerConfig(inn);
        setOuterConfig(out);
        setTrailConfig(tr);
        setMagneticConfig(mg);
        setMorphConfig(mo);
        updateCursor({ effects, inner: inn, outer: out, trail: tr, magnetic: mg, morph: mo });
        break;
      }
      case 'combo': {
        const effects = { innerDot: true, outerEffect: true, trail: true, spotlight: true, magnetic: true, morph: true, click: true };
        const inn: DotLayerConfig = { shape: 'circle', variant: 'filled', color: '#e94560', size: 8, borderWidth: 2, smoothing: 0.95 };
        const out: DotLayerConfig = { shape: 'hexagon', variant: 'border', color: '#e94560', size: 36, borderWidth: 2, smoothing: 0.45 };
        const tr = { variant: 'dots' as TrailVariant, color: '#e94560', length: 6, size: 4, fadeOut: true };
        const sp = { variant: 'radial' as SpotlightVariant, color: '#e94560', radius: 150, opacity: 0.12, blur: 40 };
        const mg = { mode: 'both' as const, radius: 150, strength: 0.6, maxDisplacement: 32 };
        const mo = { hoverSize: 60, hoverOpacity: 0.2, duration: 300 };
        setEnabledEffects(effects);
        setInnerConfig(inn);
        setOuterConfig(out);
        setTrailConfig(tr);
        setSpotlightConfig(sp);
        setMagneticConfig(mg);
        setMorphConfig(mo);
        updateCursor({ effects, inner: inn, outer: out, trail: tr, spotlight: sp, magnetic: mg, morph: mo });
        break;
      }
    }
  };

  const toggleEffect = (effect: keyof typeof enabledEffects) => {
    setActivePreset('');
    const updated = { ...enabledEffects, [effect]: !enabledEffects[effect] };
    setEnabledEffects(updated);
    updateCursor({ effects: updated });
  };

  const generatedCode = useMemo(() => {
    const hasAnyEffect = Boolean(
      enabledEffects.innerDot ||
      enabledEffects.outerEffect ||
      enabledEffects.trail ||
      enabledEffects.spotlight ||
      enabledEffects.magnetic ||
      enabledEffects.click
    );

    if (!hasAnyEffect) {
      return '<Cursor disabled />\n{/* No effects enabled — defaults to native browser cursor */}';
    }

    const lines: string[] = ['<Cursor'];
    if (enabledEffects.innerDot && enabledEffects.outerEffect) {
      lines.push('  dot={{');
      const innerProps: string[] = [];
      if (innerConfig.shape !== 'circle') innerProps.push(`shape: '${innerConfig.shape}'`);
      if (innerConfig.variant !== 'filled') innerProps.push(`variant: '${innerConfig.variant}'`);
      innerProps.push(`color: '${innerConfig.color}'`);
      innerProps.push(`size: ${innerConfig.size}`);
      if (innerConfig.variant === 'border' && innerConfig.borderWidth) innerProps.push(`borderWidth: ${innerConfig.borderWidth}`);
      innerProps.push(`smoothing: ${innerConfig.smoothing}`);

      const outerProps: string[] = [];
      if (outerConfig.shape !== 'circle') outerProps.push(`shape: '${outerConfig.shape}'`);
      if (outerConfig.variant !== 'border') outerProps.push(`variant: '${outerConfig.variant}'`);
      outerProps.push(`color: '${outerConfig.color}'`);
      outerProps.push(`size: ${outerConfig.size}`);
      if (outerConfig.borderWidth !== 2) outerProps.push(`borderWidth: ${outerConfig.borderWidth ?? 2}`);
      outerProps.push(`smoothing: ${outerConfig.smoothing}`);

      lines.push(`    inner: { ${innerProps.join(', ')} },`);
      lines.push(`    outer: { ${outerProps.join(', ')} },`);
      if (mixBlendMode !== 'normal') lines.push(`    mixBlendMode: '${mixBlendMode}',`);
      lines.push('  }}');
    } else if (enabledEffects.innerDot) {
      lines.push('  dot={{');
      const innerProps: string[] = [];
      if (innerConfig.shape !== 'circle') innerProps.push(`shape: '${innerConfig.shape}'`);
      if (innerConfig.variant !== 'filled') innerProps.push(`variant: '${innerConfig.variant}'`);
      innerProps.push(`color: '${innerConfig.color}'`);
      innerProps.push(`size: ${innerConfig.size}`);
      if (innerConfig.variant === 'border' && innerConfig.borderWidth) innerProps.push(`borderWidth: ${innerConfig.borderWidth}`);
      innerProps.push(`smoothing: ${innerConfig.smoothing}`);
      lines.push(`    inner: { ${innerProps.join(', ')} },`);
      if (mixBlendMode !== 'normal') lines.push(`    mixBlendMode: '${mixBlendMode}',`);
      lines.push('  }}');
    } else if (enabledEffects.outerEffect) {
      lines.push('  dot={{');
      const outerProps: string[] = [];
      if (outerConfig.shape !== 'circle') outerProps.push(`shape: '${outerConfig.shape}'`);
      if (outerConfig.variant !== 'border') outerProps.push(`variant: '${outerConfig.variant}'`);
      outerProps.push(`color: '${outerConfig.color}'`);
      outerProps.push(`size: ${outerConfig.size}`);
      if (outerConfig.borderWidth !== 2) outerProps.push(`borderWidth: ${outerConfig.borderWidth ?? 2}`);
      outerProps.push(`smoothing: ${outerConfig.smoothing}`);
      lines.push(`    outer: { ${outerProps.join(', ')} },`);
      if (mixBlendMode !== 'normal') lines.push(`    mixBlendMode: '${mixBlendMode}',`);
      lines.push('  }}');
    }

    if (enabledEffects.trail) {
      const props: string[] = [];
      if (trailConfig.variant !== 'dots') props.push(`variant: "${trailConfig.variant}"`);
      props.push(`color: "${trailConfig.color}"`);
      props.push(`length: ${trailConfig.length}`);
      props.push(`size: ${trailConfig.size}`);
      if (!trailConfig.fadeOut) props.push(`fadeOut: false`);
      lines.push(`  trail={{ ${props.join(', ')} }}`);
    }
    if (enabledEffects.spotlight) {
      const props: string[] = [];
      if (spotlightConfig.variant !== 'radial') props.push(`variant: "${spotlightConfig.variant}"`);
      props.push(`color: "${spotlightConfig.color}"`);
      props.push(`radius: ${spotlightConfig.radius}`);
      props.push(`opacity: ${spotlightConfig.opacity}`);
      lines.push(`  spotlight={{ ${props.join(', ')} }}`);
    }
    if (enabledEffects.magnetic) {
      const props: string[] = [];
      if (magneticConfig.mode !== 'both') props.push(`mode: "${magneticConfig.mode}"`);
      if (magneticConfig.radius !== 150) props.push(`radius: ${magneticConfig.radius}`);
      if (magneticConfig.strength !== 0.6) props.push(`strength: ${magneticConfig.strength}`);
      if (magneticConfig.maxDisplacement !== 32) props.push(`maxDisplacement: ${magneticConfig.maxDisplacement}`);
      lines.push(props.length ? `  magnetic={{ ${props.join(', ')} }}` : '  magnetic');
    }
    if ((enabledEffects.innerDot || enabledEffects.outerEffect) && enabledEffects.morph) {
      const props: string[] = [];
      if (morphConfig.hoverSize !== 60) props.push(`hoverSize: ${morphConfig.hoverSize}`);
      if (morphConfig.hoverOpacity !== 0.2) props.push(`hoverOpacity: ${morphConfig.hoverOpacity}`);
      lines.push(props.length ? `  morph={{ ${props.join(', ')} }}` : '  morph');
    }
    if (enabledEffects.click) {
      const props: string[] = [];
      if (clickConfig.variant !== 'ripple') props.push(`variant: "${clickConfig.variant}"`);
      props.push(`color: "${clickConfig.color}"`);
      if (clickConfig.size !== 38) props.push(`size: ${clickConfig.size}`);
      if (clickConfig.duration !== 400) props.push(`duration: ${clickConfig.duration}`);
      if (clickConfig.scale !== 0.82) props.push(`scale: ${clickConfig.scale}`);
      lines.push(`  click={{ ${props.join(', ')} }}`);
    }
    lines.push('/>');
    return lines.join('\n');
  }, [
    enabledEffects,
    innerConfig,
    outerConfig,
    mixBlendMode,
    trailConfig,
    spotlightConfig,
    magneticConfig,
    morphConfig,
    clickConfig,
  ]);

  return (
    <section id="playground" className="playground-section">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Playground</div>
          <h2>Interactive Studio</h2>
          <p>Customize cursor layers in real time and copy the generated component code.</p>
        </div>

        <div className="playground-layout">
          <div className="playground-preview">
            <div className="playground-preview-header">
              <div className="preview-status">
                <span className="live-dot" />
                <span>Interactive Stage</span>
              </div>
              <div className="preview-layer-tags">
                {enabledEffects.innerDot && <span className="preview-tag inner-tag">Inner Dot</span>}
                {enabledEffects.outerEffect && <span className="preview-tag outer-tag">Outer Ring</span>}
                {enabledEffects.trail && <span className="preview-tag trail-tag">Trail</span>}
                {enabledEffects.spotlight && <span className="preview-tag glow-tag">Spotlight</span>}
                {enabledEffects.magnetic && <span className="preview-tag magnet-tag">Magnetic</span>}
                {(enabledEffects.innerDot || enabledEffects.outerEffect) && enabledEffects.morph && (
                  <span className="preview-tag morph-tag">Morph</span>
                )}
                {enabledEffects.click && <span className="preview-tag click-tag">Click Reaction</span>}
              </div>
            </div>

            <div className="playground-preview-inner">
              <div className="preview-crosshair-center" />

              <div className="stage-callout">
                Test your cursor configuration on the elements below
              </div>

              <div className="preview-interactive-row">
                <button
                  className="preview-widget-btn magnetic-widget"
                  data-magnetic="attract"
                  data-magnetic-strength="0.8"
                  type="button"
                >
                  <span>Magnetic Button</span>
                </button>

                <button
                  className="preview-widget-btn morph-widget"
                  data-morph
                  data-morph-size="68"
                  type="button"
                >
                  <span>Hover to Morph</span>
                </button>
              </div>

              {/* Repel Physics Box */}
              <div className="preview-repel-box">
                <div className="repel-box-title">
                  <span>Repel Physics</span>
                </div>
                <p className="repel-text">
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>Push</span>{' '}
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>these</span>{' '}
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>words</span>{' '}
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>away</span>{' '}
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>with</span>{' '}
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>your</span>{' '}
                  <span className="repel-word" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>mouse.</span>
                </p>
                <div className="repel-badges-row">
                  <span className="repel-badge" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>
                    Dodge Target
                  </span>
                  <span className="repel-badge" data-magnetic="repel" data-magnetic-displacement={magneticConfig.maxDisplacement}>
                    Repel Force
                  </span>
                </div>
                <div className="preview-click-hint">
                  <span>Click anywhere on the stage to trigger click feedback ({clickConfig.variant})</span>
                </div>
              </div>

              <div
                className="preview-interactive-card"
                data-magnetic="attract"
                data-magnetic-strength="0.4"
                data-morph
                data-morph-size="78"
                style={{ marginTop: '16px' }}
              >
                <div className="card-top-indicator">
                  <span className="label">Magnetic Card</span>
                </div>
                <p>Snaps pointer to center and expands radius on hover</p>
              </div>
            </div>
          </div>

          <div className="playground-controls">
            {/* Presets Header */}
            <div className="presets-bar">
              <span className="presets-label">Presets:</span>
              <div className="presets-chips">
                <button
                  type="button"
                  className={`preset-chip ${activePreset === 'dot-only' ? 'active' : ''}`}
                  onClick={() => applyPreset('dot-only')}
                >
                  Dot Only
                </button>
                <button
                  type="button"
                  className={`preset-chip ${activePreset === 'dual-circle' ? 'active' : ''}`}
                  onClick={() => applyPreset('dual-circle')}
                >
                  Dual Ring
                </button>
                <button
                  type="button"
                  className={`preset-chip ${activePreset === 'outer-only' ? 'active' : ''}`}
                  onClick={() => applyPreset('outer-only')}
                >
                  Outer Only
                </button>
                <button
                  type="button"
                  className={`preset-chip ${activePreset === 'comet' ? 'active' : ''}`}
                  onClick={() => applyPreset('comet')}
                >
                  Comet
                </button>
                <button
                  type="button"
                  className={`preset-chip ${activePreset === 'cyber-hex' ? 'active' : ''}`}
                  onClick={() => applyPreset('cyber-hex')}
                >
                  Cyber Hex
                </button>
                <button
                  type="button"
                  className={`preset-chip ${activePreset === 'combo' ? 'active' : ''}`}
                  onClick={() => applyPreset('combo')}
                >
                  Full Suite
                </button>
              </div>
            </div>

            {/* Inner Dot Controls */}
            <div className="control-group">
              <div className="control-group-header">
                <h3>Inner Dot</h3>
                <button
                  className={`control-toggle ${enabledEffects.innerDot ? 'active' : ''}`}
                  onClick={() => toggleEffect('innerDot')}
                  id="toggle-inner-dot"
                  type="button"
                  aria-label="Toggle Inner Dot Effect"
                />
              </div>
              {enabledEffects.innerDot && (
                <>
                  <div className="control-row">
                    <span className="control-label">Shape</span>
                    <select
                      className="control-select"
                      value={innerConfig.shape}
                      onChange={(e) => {
                        const updated = { ...innerConfig, shape: e.target.value as DotShape };
                        setInnerConfig(updated);
                        updateCursor({ inner: updated });
                      }}
                    >
                      {shapeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="control-row">
                    <span className="control-label">Style</span>
                    <select
                      className="control-select"
                      value={innerConfig.variant ?? 'filled'}
                      onChange={(e) => {
                        const updated = { ...innerConfig, variant: e.target.value as 'filled' | 'border' };
                        setInnerConfig(updated);
                        updateCursor({ inner: updated });
                      }}
                    >
                      <option value="filled">Filled</option>
                      <option value="border">Border / Outline</option>
                    </select>
                  </div>

                  <div className="control-row">
                    <span className="control-label">Color</span>
                    <input
                      type="color"
                      className="control-color"
                      value={innerConfig.color}
                      onChange={(e) => {
                        const updated = { ...innerConfig, color: e.target.value };
                        setInnerConfig(updated);
                        updateCursor({ inner: updated });
                      }}
                    />
                  </div>

                  <NumberSlider
                    label="Size"
                    value={innerConfig.size ?? 8}
                    min={4}
                    max={60}
                    step={1}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...innerConfig, size: val };
                      setInnerConfig(updated);
                      updateCursor({ inner: updated });
                    }}
                  />

                  {innerConfig.variant === 'border' && (
                    <NumberSlider
                      label="Border Width"
                      value={innerConfig.borderWidth ?? 2}
                      min={1}
                      max={8}
                      step={1}
                      unit="px"
                      onChange={(val) => {
                        const updated = { ...innerConfig, borderWidth: val };
                        setInnerConfig(updated);
                        updateCursor({ inner: updated });
                      }}
                    />
                  )}

                  <NumberSlider
                    label="Smoothing"
                    value={innerConfig.smoothing ?? 0.95}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(val) => {
                      const updated = { ...innerConfig, smoothing: val };
                      setInnerConfig(updated);
                      updateCursor({ inner: updated });
                    }}
                  />

                  <div className="control-row">
                    <span className="control-label">Blend Mode</span>
                    <select
                      className="control-select"
                      value={mixBlendMode}
                      onChange={(e) => {
                        setMixBlendMode(e.target.value);
                        updateCursor({ blend: e.target.value });
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="difference">Difference</option>
                      <option value="exclusion">Exclusion</option>
                      <option value="multiply">Multiply</option>
                      <option value="screen">Screen</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Outer Effect Controls */}
            <div className="control-group">
              <div className="control-group-header">
                <h3>Outer Layer</h3>
                <button
                  className={`control-toggle ${enabledEffects.outerEffect ? 'active' : ''}`}
                  onClick={() => toggleEffect('outerEffect')}
                  id="toggle-outer-effect"
                  type="button"
                  aria-label="Toggle Outer Effect"
                />
              </div>
              {enabledEffects.outerEffect && (
                <>
                  <div className="control-row">
                    <span className="control-label">Shape</span>
                    <select
                      className="control-select"
                      value={outerConfig.shape}
                      onChange={(e) => {
                        const updated = { ...outerConfig, shape: e.target.value as DotShape };
                        setOuterConfig(updated);
                        updateCursor({ outer: updated });
                      }}
                    >
                      {shapeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="control-row">
                    <span className="control-label">Style</span>
                    <select
                      className="control-select"
                      value={outerConfig.variant ?? 'border'}
                      onChange={(e) => {
                        const updated = { ...outerConfig, variant: e.target.value as 'filled' | 'border' };
                        setOuterConfig(updated);
                        updateCursor({ outer: updated });
                      }}
                    >
                      <option value="border">Border / Outline</option>
                      <option value="filled">Filled</option>
                    </select>
                  </div>

                  <div className="control-row">
                    <span className="control-label">Color</span>
                    <input
                      type="color"
                      className="control-color"
                      value={outerConfig.color}
                      onChange={(e) => {
                        const updated = { ...outerConfig, color: e.target.value };
                        setOuterConfig(updated);
                        updateCursor({ outer: updated });
                      }}
                    />
                  </div>

                  <NumberSlider
                    label="Size"
                    value={outerConfig.size ?? 36}
                    min={14}
                    max={120}
                    step={1}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...outerConfig, size: val };
                      setOuterConfig(updated);
                      updateCursor({ outer: updated });
                    }}
                  />

                  {outerConfig.variant !== 'filled' && (
                    <NumberSlider
                      label="Border Width"
                      value={outerConfig.borderWidth ?? 2}
                      min={1}
                      max={8}
                      step={1}
                      unit="px"
                      onChange={(val) => {
                        const updated = { ...outerConfig, borderWidth: val };
                        setOuterConfig(updated);
                        updateCursor({ outer: updated });
                      }}
                    />
                  )}

                  <NumberSlider
                    label="Smoothing"
                    value={outerConfig.smoothing ?? 0.45}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={(val) => {
                      const updated = { ...outerConfig, smoothing: val };
                      setOuterConfig(updated);
                      updateCursor({ outer: updated });
                    }}
                  />
                </>
              )}
            </div>

            {/* Trail Controls */}
            <div className="control-group">
              <div className="control-group-header">
                <h3>Trail</h3>
                <button
                  className={`control-toggle ${enabledEffects.trail ? 'active' : ''}`}
                  onClick={() => toggleEffect('trail')}
                  id="toggle-trail"
                />
              </div>
              {enabledEffects.trail && (
                <>
                  <div className="control-row">
                    <span className="control-label">Variant</span>
                    <select
                      className="control-select"
                      value={trailConfig.variant}
                      onChange={(e) => {
                        const updated = { ...trailConfig, variant: e.target.value as TrailVariant };
                        setTrailConfig(updated);
                        updateCursor({ trail: updated });
                      }}
                    >
                      <option value="dots">Dots</option>
                      <option value="line">Line</option>
                      <option value="comet">Comet</option>
                      <option value="ribbon">Ribbon</option>
                    </select>
                  </div>
                  <div className="control-row">
                    <span className="control-label">Color</span>
                    <input
                      type="color"
                      className="control-color"
                      value={trailConfig.color}
                      onChange={(e) => {
                        const updated = { ...trailConfig, color: e.target.value };
                        setTrailConfig(updated);
                        updateCursor({ trail: updated });
                      }}
                    />
                  </div>
                  <NumberSlider
                    label="Length"
                    value={trailConfig.length}
                    min={2}
                    max={30}
                    step={1}
                    onChange={(val) => {
                      const updated = { ...trailConfig, length: val };
                      setTrailConfig(updated);
                      updateCursor({ trail: updated });
                    }}
                  />

                  <NumberSlider
                    label="Size"
                    value={trailConfig.size}
                    min={2}
                    max={30}
                    step={1}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...trailConfig, size: val };
                      setTrailConfig(updated);
                      updateCursor({ trail: updated });
                    }}
                  />


                </>
              )}
            </div>

            {/* Spotlight Controls */}
            <div className="control-group">
              <div className="control-group-header">
                <h3>Spotlight</h3>
                <button
                  className={`control-toggle ${enabledEffects.spotlight ? 'active' : ''}`}
                  onClick={() => toggleEffect('spotlight')}
                  id="toggle-spotlight"
                />
              </div>
              {enabledEffects.spotlight && (
                <>
                  <div className="control-row">
                    <span className="control-label">Variant</span>
                    <select
                      className="control-select"
                      value={spotlightConfig.variant}
                      onChange={(e) => {
                        const updated = { ...spotlightConfig, variant: e.target.value as SpotlightVariant };
                        setSpotlightConfig(updated);
                        updateCursor({ spotlight: updated });
                      }}
                    >
                      <option value="radial">Radial</option>
                      <option value="gradient">Gradient</option>
                      <option value="box">Box</option>
                    </select>
                  </div>
                  <div className="control-row">
                    <span className="control-label">Color</span>
                    <input
                      type="color"
                      className="control-color"
                      value={spotlightConfig.color}
                      onChange={(e) => {
                        const updated = { ...spotlightConfig, color: e.target.value };
                        setSpotlightConfig(updated);
                        updateCursor({ spotlight: updated });
                      }}
                    />
                  </div>
                  <NumberSlider
                    label="Radius"
                    value={spotlightConfig.radius}
                    min={40}
                    max={400}
                    step={10}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...spotlightConfig, radius: val };
                      setSpotlightConfig(updated);
                      updateCursor({ spotlight: updated });
                    }}
                  />

                  <NumberSlider
                    label="Opacity"
                    value={spotlightConfig.opacity}
                    min={0.01}
                    max={0.8}
                    step={0.01}
                    onChange={(val) => {
                      const updated = { ...spotlightConfig, opacity: val };
                      setSpotlightConfig(updated);
                      updateCursor({ spotlight: updated });
                    }}
                  />

                  <NumberSlider
                    label="Blur"
                    value={spotlightConfig.blur}
                    min={0}
                    max={100}
                    step={5}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...spotlightConfig, blur: val };
                      setSpotlightConfig(updated);
                      updateCursor({ spotlight: updated });
                    }}
                  />
                </>
              )}
            </div>

            {/* Magnetic Physics Controls */}
            <div className="control-group">
              <div className="control-group-header">
                <h3>Magnetic Physics</h3>
                <button
                  className={`control-toggle ${enabledEffects.magnetic ? 'active' : ''}`}
                  onClick={() => toggleEffect('magnetic')}
                  id="toggle-magnetic"
                  type="button"
                  aria-label="Toggle Magnetic Effect"
                />
              </div>
              {enabledEffects.magnetic && (
                <>
                  <div className="control-row">
                    <span className="control-label">Mode</span>
                    <select
                      className="control-select"
                      value={magneticConfig.mode}
                      onChange={(e) => {
                        const updated = {
                          ...magneticConfig,
                          mode: e.target.value as 'attract' | 'repel' | 'both',
                        };
                        setMagneticConfig(updated);
                        updateCursor({ magnetic: updated });
                      }}
                    >
                      <option value="both">Both (Attract &amp; Repel)</option>
                      <option value="repel">Repel Only (Push Elements)</option>
                      <option value="attract">Attract Only (Pull Cursor)</option>
                    </select>
                  </div>

                  <NumberSlider
                    label="Radius"
                    value={magneticConfig.radius}
                    min={50}
                    max={350}
                    step={10}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...magneticConfig, radius: val };
                      setMagneticConfig(updated);
                      updateCursor({ magnetic: updated });
                    }}
                  />

                  <NumberSlider
                    label="Strength"
                    value={magneticConfig.strength}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onChange={(val) => {
                      const updated = { ...magneticConfig, strength: val };
                      setMagneticConfig(updated);
                      updateCursor({ magnetic: updated });
                    }}
                  />

                  {magneticConfig.mode !== 'attract' && (
                    <NumberSlider
                      label="Push Displacement"
                      value={magneticConfig.maxDisplacement}
                      min={10}
                      max={60}
                      step={2}
                      unit="px"
                      onChange={(val) => {
                        const updated = { ...magneticConfig, maxDisplacement: val };
                        setMagneticConfig(updated);
                        updateCursor({ magnetic: updated });
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {/* Click Reaction Controls */}
            <div className="control-group">
              <div className="control-group-header">
                <h3>Click Reaction</h3>
                <button
                  className={`control-toggle ${enabledEffects.click ? 'active' : ''}`}
                  onClick={() => toggleEffect('click')}
                  id="toggle-click"
                  type="button"
                  aria-label="Toggle Click Reaction Effect"
                />
              </div>
              {enabledEffects.click && (
                <>
                  <div className="control-row">
                    <span className="control-label">Variant</span>
                    <select
                      className="control-select"
                      value={clickConfig.variant}
                      onChange={(e) => {
                        const updated = {
                          ...clickConfig,
                          variant: e.target.value as ClickVariant,
                        };
                        setClickConfig(updated);
                        updateCursor({ click: updated });
                      }}
                    >
                      <option value="ripple">Expanding Ripple</option>
                      <option value="burst">Particle Burst</option>
                      <option value="pulse">Soft Pulse</option>
                      <option value="shrink">Tactile Shrink</option>
                    </select>
                  </div>

                  <div className="control-row">
                    <span className="control-label">Color</span>
                    <input
                      type="color"
                      className="control-color"
                      value={clickConfig.color}
                      onChange={(e) => {
                        const updated = { ...clickConfig, color: e.target.value };
                        setClickConfig(updated);
                        updateCursor({ click: updated });
                      }}
                    />
                  </div>

                  <NumberSlider
                    label="Size"
                    value={clickConfig.size}
                    min={15}
                    max={80}
                    step={1}
                    unit="px"
                    onChange={(val) => {
                      const updated = { ...clickConfig, size: val };
                      setClickConfig(updated);
                      updateCursor({ click: updated });
                    }}
                  />

                  <NumberSlider
                    label="Duration"
                    value={clickConfig.duration}
                    min={150}
                    max={800}
                    step={25}
                    unit="ms"
                    onChange={(val) => {
                      const updated = { ...clickConfig, duration: val };
                      setClickConfig(updated);
                      updateCursor({ click: updated });
                    }}
                  />

                  <NumberSlider
                    label="Dot Press Scale"
                    value={clickConfig.scale}
                    min={0.5}
                    max={1.0}
                    step={0.02}
                    onChange={(val) => {
                      const updated = { ...clickConfig, scale: val };
                      setClickConfig(updated);
                      updateCursor({ click: updated });
                    }}
                  />
                </>
              )}
            </div>

            {/* Morph Controls */}
            {(() => {
              const hasDot = enabledEffects.innerDot || enabledEffects.outerEffect;
              return (
                <div className={`control-group ${!hasDot ? 'control-group-disabled' : ''}`} style={!hasDot ? { opacity: 0.5 } : undefined}>
                  <div className="control-group-header">
                    <div>
                      <h3 style={{ display: 'inline' }}>Shape Morphing</h3>
                      {!hasDot && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                          (Requires Inner Dot or Outer Effect)
                        </span>
                      )}
                    </div>
                    <button
                      className={`control-toggle ${hasDot && enabledEffects.morph ? 'active' : ''}`}
                      onClick={() => {
                        if (!hasDot) return;
                        toggleEffect('morph');
                      }}
                      disabled={!hasDot}
                      id="toggle-morph"
                      type="button"
                      aria-label="Toggle Morph Effect"
                      title={!hasDot ? 'Morph effect requires Inner Dot or Outer Effect to be enabled' : undefined}
                    />
                  </div>
                  {hasDot && enabledEffects.morph && (
                    <>
                      <NumberSlider
                        label="Hover Size"
                        value={morphConfig.hoverSize}
                        min={20}
                        max={120}
                        step={2}
                        unit="px"
                        onChange={(val) => {
                          const updated = { ...morphConfig, hoverSize: val };
                          setMorphConfig(updated);
                          updateCursor({ morph: updated });
                        }}
                      />

                      <NumberSlider
                        label="Hover Opacity"
                        value={morphConfig.hoverOpacity}
                        min={0.05}
                        max={0.8}
                        step={0.05}
                        onChange={(val) => {
                          const updated = { ...morphConfig, hoverOpacity: val };
                          setMorphConfig(updated);
                          updateCursor({ morph: updated });
                        }}
                      />

                      <NumberSlider
                        label="Duration"
                        value={morphConfig.duration}
                        min={100}
                        max={600}
                        step={50}
                        unit="ms"
                        onChange={(val) => {
                          const updated = { ...morphConfig, duration: val };
                          setMorphConfig(updated);
                          updateCursor({ morph: updated });
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })()}

            {/* Generated Code */}
            <CodeExample code={generatedCode} title="Generated Code" />
          </div>
        </div>
      </div>
    </section>
  );
}
