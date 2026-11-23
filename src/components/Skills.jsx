import Reveal from './Reveal.jsx';
import SkillLogo from './SkillLogo.jsx';
import { skills, skillsBadge } from '../data/portfolio.js';

export default function Skills() {
  return (
    <div className="skill-grid">
      {skills.map((skill, index) => (
        <Reveal key={skill.id} delay={Math.min(index * 60, 480)}>
          <article className="skill-card">
            <span className="skill-badge">{skillsBadge}</span>
            <div className="skill-logo">
              <SkillLogo id={skill.id} />
            </div>
            <h3>{skill.name}</h3>
            <p>{skill.desc}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}