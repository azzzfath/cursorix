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
          <div className="section-eyebrow">Dokumentasi Cepat</div>
          <h2>Cara Pemasangan</h2>
          <p>Cuma butuh 2 menit, kursor web kamu langsung beda dan lebih hidup.</p>
        </div>

        <div className="install-grid">
          <div className="install-step">
            <div className="install-step-number">1</div>
            <h3>Install Package</h3>
            <p>Pasang cursor-depok lewat npm, pnpm, atau yarn.</p>
            <CodeExample code={installCode} title="Terminal" />
          </div>

          <div className="install-step">
            <div className="install-step-number">2</div>
            <h3>Pasang Komponen</h3>
            <p>Import dan letakkan komponen &lt;Cursor /&gt; di root aplikasi kamu.</p>
            <CodeExample code={usageCode} title="App.tsx" />
          </div>

          <div className="install-step">
            <div className="install-step-number">3</div>
            <h3>Efek Magnetik</h3>
            <p>Cukup kasih atribut <code>data-magnetic</code> ke tombol atau link apa aja.</p>
            <CodeExample code={magneticCode} title="JSX" />
          </div>

          <div className="install-step">
            <div className="install-step-number">4</div>
            <h3>Efek Morph</h3>
            <p>Beri atribut <code>data-morph</code> biar kursor membesar pas di-hover.</p>
            <CodeExample code={morphCode} title="JSX" />
          </div>
        </div>
      </div>
    </section>
  );
}
