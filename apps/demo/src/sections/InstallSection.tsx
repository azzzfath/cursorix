import { CodeExample } from '../components/CodeExample';

const installCode = `npm install cursorix`;

const usageCode = `import { Cursor } from 'cursorix';

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
          <h2>Get Started</h2>
          <p>Install Cursorix and add beautiful cursor effects in minutes.</p>
        </div>

        <div className="install-grid">
          <div className="install-step">
            <div className="install-step-number">1</div>
            <h3>Install the package</h3>
            <p>Add Cursorix to your React project via npm, yarn, or pnpm.</p>
            <CodeExample code={installCode} title="Terminal" />
          </div>

          <div className="install-step">
            <div className="install-step-number">2</div>
            <h3>Add the Cursor component</h3>
            <p>Import and configure the cursor with any combination of effects.</p>
            <CodeExample code={usageCode} title="App.tsx" />
          </div>

          <div className="install-step">
            <div className="install-step-number">3</div>
            <h3>Add magnetic targets</h3>
            <p>Use data attributes on any element to make it a magnetic target.</p>
            <CodeExample code={magneticCode} title="JSX" />
          </div>

          <div className="install-step">
            <div className="install-step-number">4</div>
            <h3>Add morph targets</h3>
            <p>Cursor morphs on hover over elements with data-morph attribute.</p>
            <CodeExample code={morphCode} title="JSX" />
          </div>
        </div>
      </div>
    </section>
  );
}
