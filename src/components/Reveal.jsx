import { useRef } from 'react';
import { useInView } from '../hooks/useInView.js';

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.15, once: true });
  const classes = ['reveal', inView ? 'is-visible' : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} style={{ '--delay': `${delay}ms` }}>
      {children}
    </Tag>
  );
}