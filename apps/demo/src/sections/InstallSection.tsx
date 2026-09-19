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
          <div className="section-eyebrow">Documentation</div>
          <h2>Get Started</h2>
          <p>A quick guide to dropping Cursor Depok into your React project.</p>
        </div>

        <div className="install-grid">
          <div className="install-step">
            <div className="install-step-number">1</div>
            <h3>Install package</h3>
            <p>Add cursor-depok using your favorite package manager.</p>
            <CodeExample code={installCode} title="Terminal" />
          </div>

          <div className="install-step">
            <div className="install-step-number">2</div>
            <h3>Mount &lt;Cursor /&gt;</h3>
            <p>Render the component near the root of your React application.</p>
            <CodeExample code={usageCode} title="App.tsx" />
          </div>

          <div className="install-step">
            <div className="install-step-number">3</div>
            <h3>Magnetic elements</h3>
            <p>Add the <code>data-magnetic</code> attribute to buttons or links to attract the cursor.</p>
            <CodeExample code={magneticCode} title="JSX" />
          </div>

          <div className="install-step">
            <div className="install-step-number">4</div>
            <h3>Hover morphing</h3>
            <p>Add the <code>data-morph</code> attribute to expand or reshape the cursor on hover.</p>
            <CodeExample code={morphCode} title="JSX" />
          </div>
        </div>
      </div>
    </section>
  );
}
