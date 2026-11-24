import { useRef } from 'react';
import Reveal from './Reveal.jsx';
import { projects } from '../data/portfolio.js';

// Efek tilt dan glare memakai rect yang di-cache saat pointer masuk,
// jadi tidak ada pembacaan layout berulang di setiap pointermove.
function TiltCard({ children }) {
  const ref = useRef(null);
  const rectRef = useRef(null);

  const setVar = (name, value) => ref.current?.style.setProperty(name, value);

  const onPointerEnter = (event) => {
    if (event.pointerType !== 'mouse') return;
    rectRef.current = event.currentTarget.getBoundingClientRect();
    setVar('--glare', '1');
  };

  const onPointerMove = (event) => {
    const rect = rectRef.current;
    if (!rect || event.pointerType !== 'mouse') return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setVar('--ry', `${((x - 0.5) * 14).toFixed(2)}deg`);
    setVar('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`);
    setVar('--gx', `${(x * 100).toFixed(1)}%`);
    setVar('--gy', `${(y * 100).toFixed(1)}%`);
  };

  const onPointerLeave = () => {
    rectRef.current = null;
    setVar('--rx', '0deg');
    setVar('--ry', '0deg');
    setVar('--glare', '0');
  };

  return (
    <div
      ref={ref}
      className="tilt"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}

export default function Projects() {
  return (
    <>
      <Reveal><h2>Proyek</h2></Reveal>
      <div className="grid">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={Math.min(index * 120, 360)}>
            <TiltCard>
              <article className="card">
                <span className="card-year">{project.year}</span>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {project.link && (
                  <a
                    className="card-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka proyek ↗
                  </a>
                )}
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </>
  );
}