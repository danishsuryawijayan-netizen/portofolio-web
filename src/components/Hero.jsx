import { useRef } from 'react';
import ThreeCanvas from './ThreeCanvas.jsx';
import SplitText from './SplitText.jsx';
import { createGalaxyScene } from '../scenes/galaxy.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { profile } from '../data/portfolio.js';

export default function Hero() {
  const heroRef = useRef(null);
  const sharedRef = useRef({ progress: 0 });
  useScrollProgress(heroRef, sharedRef);

  // Parallax teks mengikuti kursor lewat CSS variable, tanpa setState.
  const handleMove = (event) => {
    const el = event.currentTarget;
    el.style.setProperty('--mx', (event.clientX / window.innerWidth - 0.5).toFixed(3));
    el.style.setProperty('--my', (event.clientY / window.innerHeight - 0.5).toFixed(3));
  };

  return (
    <section id="top" className="hero" ref={heroRef} onPointerMove={handleMove}>
      <ThreeCanvas scene={createGalaxyScene} sharedRef={sharedRef} className="fill" />

      <div className="hero-inner">
        <p className="eyebrow">{profile.role}</p>
        <h1 className="hero-title">
          <SplitText text={profile.name} />
        </h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <div className="hero-actions">
          <a className="cta" href="#proyek">Lihat proyek</a>
        </div>
      </div>
    </section>
  );
}