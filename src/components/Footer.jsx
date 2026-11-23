import Reveal from './Reveal.jsx';
import { footer, profile, socials } from '../data/portfolio.js';

const scrollToTop = () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
};

export default function Footer() {
  const loop = [...footer.marquee, ...footer.marquee];

  return (
    <footer className="footer">
      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-track">
          {loop.map((word, index) => (
            <span key={`${word}-${index}`}>{word}</span>
          ))}
        </div>
      </div>

      <div className="footer-inner">
        <Reveal>
          <span className="status">
            <span className="status-dot" aria-hidden="true" />
            {footer.status}
          </span>
          <h2 className="footer-title">{footer.title}</h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="socials">
            {socials.map((item) => {
              const isMail = item.href.startsWith('mailto:');
              return (
                <a
                  key={item.label}
                  className="social"
                  href={item.href}
                  style={{ '--c': item.color }}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noreferrer'}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </Reveal>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.name}. Dibuat dengan React.js dan Three.js.
          </span>
          <button type="button" className="to-top" onClick={scrollToTop}>
            Kembali ke atas ↑
          </button>
        </div>
      </div>
    </footer>
  );
}