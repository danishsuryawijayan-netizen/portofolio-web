import Hero from './components/Hero.jsx';
import Reveal from './components/Reveal.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Footer from './components/Footer.jsx';
import { about, profile, skillsIntro } from './data/portfolio.js';

const NAV_ITEMS = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#proyek', label: 'Proyek' },
  { href: '#keahlian', label: 'Keahlian' },
  { href: '#kontak', label: 'Kontak' },
];

export default function App() {
  return (
    <div className="page">
      <header className="nav">
        <a href="#top" className="brand">{profile.name}</a>
        <nav className="nav-links" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-btn"
              style={{ '--i': index }}
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </header>

      <main>
        <Hero />

        <section id="tentang" className="section">
          <Reveal><h2>Tentang</h2></Reveal>
          <Reveal delay={120}><p className="lead">{about}</p></Reveal>
        </section>

        <section id="proyek" className="section">
          <Projects />
        </section>

        <section id="keahlian" className="section">
          <Reveal><h2>Keahlian</h2></Reveal>
          <Reveal delay={120}><p className="lead">{skillsIntro}</p></Reveal>
          <div className="skills-wrap">
            <Skills />
          </div>
        </section>

        <section id="kontak" className="section contact">
          <Reveal><h2>Mari berkolaborasi</h2></Reveal>
          <Reveal delay={120}>
            <p className="lead">Punya ide atau proyek yang ingin dibuat bersama? Tulis saja.</p>
          </Reveal>
          <Reveal delay={240}>
            <a className="cta" href={`mailto:${profile.email}`}>{profile.email}</a>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}