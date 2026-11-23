import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MAX_DELTA, MAX_PIXEL_RATIO } from '../config.js';

// Mengelola satu renderer WebGL: loop, resize, pause saat tidak terlihat, dan cleanup.
// createScene harus berupa fungsi di level modul agar referensinya stabil.
export function useThreeScene(canvasRef, createScene, { paused = false, inView = false, sharedRef } = {}) {
  const controlRef = useRef(null);
  const flagsRef = useRef({ paused, inView });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      document.documentElement.classList.add('no-webgl');
      return undefined;
    }

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(pixelRatio);

    const api = createScene();
    let elapsed = 0;
    let rafId = 0;
    let lastTime = 0;
    let staticFrame = 0;

    const draw = (dt) => {
      const reduce = reduceQuery.matches;
      if (!reduce) elapsed += dt;
      api.update(dt, elapsed, reduce, sharedRef?.current ?? {});
      renderer.render(api.scene, api.camera);
    };

    const loop = (now) => {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / 1000, MAX_DELTA);
      lastTime = now;
      draw(dt);
    };

    const stop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const start = () => {
      if (rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    };

    const sync = () => {
      const { paused: isPaused, inView: visible } = flagsRef.current;
      const run = visible && !isPaused && !document.hidden && !reduceQuery.matches;
      if (run) {
        start();
        return;
      }
      stop();
      if (visible) draw(0); // tampilkan satu frame statis
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      api.resize(w, h, pixelRatio);
      if (!rafId && flagsRef.current.inView) draw(0);
    };

    const controller = new AbortController();
    const { signal } = controller;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    document.addEventListener('visibilitychange', sync, { signal });
    reduceQuery.addEventListener('change', sync, { signal });

    // Saat berhenti (paused atau reduced motion), scroll tetap menggambar ulang satu frame.
    const onScroll = () => {
      if (rafId || staticFrame) return;
      staticFrame = requestAnimationFrame(() => {
        staticFrame = 0;
        if (!rafId && flagsRef.current.inView) draw(0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });

    resize();
    sync();
    controlRef.current = { sync };

    return () => {
      controller.abort();
      stop();
      if (staticFrame) cancelAnimationFrame(staticFrame);
      resizeObserver.disconnect();
      controlRef.current = null;
      api.dispose();
      renderer.dispose();
    };
  }, [canvasRef, createScene, sharedRef]);

  useEffect(() => {
    flagsRef.current = { paused, inView };
    controlRef.current?.sync();
  }, [paused, inView]);
}