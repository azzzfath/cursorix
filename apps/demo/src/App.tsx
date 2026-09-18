import { useState, useEffect } from 'react';
import { Cursor } from 'cursorix';
import type { CursorProps } from 'cursorix';
import { Header } from './components/Header';
import { HeroSection } from './sections/HeroSection';
import { ShowcaseSection } from './sections/ShowcaseSection';
import { PlaygroundSection } from './sections/PlaygroundSection';
import { InstallSection } from './sections/InstallSection';
import { Footer } from './components/Footer';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [cursorConfig, setCursorConfig] = useState<CursorProps>({
    dot: {
      inner: { shape: 'circle', color: '#e94560', size: 8, smoothing: 0.95 },
      outer: { shape: 'circle', color: '#e94560', size: 36, borderWidth: 2, smoothing: 0.45 },
    },
    click: {
      variant: 'ripple',
      color: '#e94560',
      size: 38,
      duration: 400,
    },
    magnetic: {
      mode: 'both',
      radius: 150,
      strength: 0.6,
      maxDisplacement: 30,
    },
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <Cursor {...cursorConfig} />
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <HeroSection />
        <ShowcaseSection onCursorChange={setCursorConfig} />
        <PlaygroundSection onConfigChange={setCursorConfig} />
        <InstallSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
