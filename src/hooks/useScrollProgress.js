import { useEffect } from 'react';

// Menghitung progres (0 sampai 1) sebuah elemen tinggi selama melewati layar.
// Hasilnya ditulis ke CSS variable --p dan ke outRef.current.progress tanpa setState.
export function useScrollProgress(targetRef, outRef, onProgress) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;
    let last = -1;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      if (outRef) outRef.current.progress = p;
      if (onProgress && Math.abs(p - last) > 0.001) {
        last = p;
        onProgress(p);
      }
    };

    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [targetRef, outRef, onProgress]);
}