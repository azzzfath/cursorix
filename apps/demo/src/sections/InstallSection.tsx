import { CodeExample } from '../components/CodeExample';

const installCode = `npm install cursor-depok`;

const usageCode = `import { Cursor } from 'cursor-depok';

function App() {
  return (
    <>
      <Cursor
        dot={{ shape: "circle", color: "#e94560", size: 20 }}
        trail={{ variant: "dots", color: "#4ecdc4", length: 8 }}
        spotlight={{ radius: 150, opacity: 0.15 }}
        magnetic={{ strength: 0.5, radius: 150 }}
        morph={{ hoverSize: 60, hoverOpacity: 0.2 }}
      />
      <YourApp />
    </>
  );
}`;

const magneticCode = `{/* Add data-magnetic to any element */}
<button data-magnetic>
  I attract the cursor!
</button>

{/* Override strength per element */}
<button data-magnetic data-magnetic-strength="0.8">
  Strong magnet!
</button>`;

const morphCode = `{/* Add data-morph to any element */}
<a href="#" data-morph>
  Cursor grows on hover!
</a>

{/* Override size per element */}
<a href="#" data-morph data-morph-size="80">
  Even bigger!
</a>`;

export function InstallSection() {
  return (
    <section className="install-section" id="install">
      <div className="container">
        <div className="section-header">
          <h2>Quick Start</h2>
          <p>Install and use in minutes.</p>
        </div>

        <div className="install-grid">
          <div className="install-step">
            <div className="install-step-number">1</div>
            <h3>Install</h3>
            <p>Add cursor-depok to your project.</p>
            <CodeExample code={installCode} title="Terminal" />
          </div>

          <div className="install-step">
            <div className="install-step-number">2</div>
            <h3>Add Component</h3>
            <p>Import and configure the cursor component.</p>
            <CodeExample code={usageCode} title="App.tsx" />
          </div>

          <div className="install-step">
            <div className="install-step-number">3</div>
            <h3>Magnetic Effect</h3>
            <p>Add data-magnetic to any element to attract the cursor.</p>
            <CodeExample code={magneticCode} title="JSX" />
          </div>

          <div className="install-step">
            <div className="install-step-number">4</div>
            <h3>Morph Effect</h3>
            <p>Add data-morph to expand the cursor on hover.</p>
            <CodeExample code={morphCode} title="JSX" />
          </div>
        </div>
      </div>
    </section>
  );
}
