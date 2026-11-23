import { useRef } from 'react';
import { useInView } from '../hooks/useInView.js';
import { useThreeScene } from '../hooks/useThreeScene.js';

export default function ThreeCanvas({ scene, sharedRef, paused = false, className = '' }) {
  const canvasRef = useRef(null);
  const inView = useInView(canvasRef);

  useThreeScene(canvasRef, scene, { paused, inView, sharedRef });

  return (
    <canvas
      ref={canvasRef}
      className={`three-canvas ${className}`.trim()}
      aria-hidden="true"
    />
  );
}