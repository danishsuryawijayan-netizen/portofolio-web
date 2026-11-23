import * as THREE from 'three';
import { GALAXY } from '../config.js';

const vertexShader = `
attribute float aRadius;
attribute float aAngle;
attribute float aSeed;
attribute float aScale;

uniform float uTime;
uniform float uSpin;
uniform float uSize;
uniform float uPixelRatio;
uniform float uMaxRadius;
uniform vec2 uPointer;

varying vec3 vColor;
varying float vAlpha;

void main() {
  float r = aRadius;
  // Rotasi diferensial: bagian dalam berputar lebih cepat.
  float a = aAngle + uTime * uSpin / (0.4 + r * 0.6);
  float thickness = (aSeed - 0.5) * (0.04 + 0.22 * exp(-r * 1.4));
  vec3 p = vec3(cos(a) * r, thickness, sin(a) * r);

  // Partikel terdorong menjauh dari kursor di bidang galaksi.
  vec2 d = p.xz - uPointer;
  float dist = length(d);
  float push = smoothstep(0.9, 0.0, dist) * 0.35;
  p.xz += normalize(d + vec2(1e-5)) * push;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (6.0 / -mv.z);

  vec3 inner = vec3(1.0, 0.84, 0.6);
  vec3 outer = vec3(0.45, 0.35, 1.0);
  vColor = mix(inner, outer, smoothstep(0.0, uMaxRadius, r));
  vAlpha = 0.55 + 0.45 * sin(uTime * 2.0 + aSeed * 40.0);
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

// PRNG ber-seed agar hasil galaksi selalu sama setiap kali dimuat.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createGalaxyScene() {
  const { count, arms, radius, spin, pointSize, seed } = GALAXY;
  const rand = mulberry32(seed);

  const aRadius = new Float32Array(count);
  const aAngle = new Float32Array(count);
  const aSeed = new Float32Array(count);
  const aScale = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(), 1.4) * radius;
    const armBase = ((i % arms) / arms) * Math.PI * 2;
    const spiral = r * 1.4;
    const jitter = (rand() - 0.5) * (0.35 + r * 0.25);
    aRadius[i] = r;
    aAngle[i] = armBase + spiral + jitter;
    aSeed[i] = rand();
    aScale[i] = 0.4 + rand() * 1.1;
  }

  const geometry = new THREE.BufferGeometry();
  // Posisi dihitung di shader, jadi atribut position hanya placeholder.
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('aRadius', new THREE.BufferAttribute(aRadius, 1));
  geometry.setAttribute('aAngle', new THREE.BufferAttribute(aAngle, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(aScale, 1));

  const uniforms = {
    uTime: { value: 0 },
    uSpin: { value: spin },
    uSize: { value: pointSize },
    uPixelRatio: { value: 1 },
    uMaxRadius: { value: radius },
    uPointer: { value: new THREE.Vector2(999, 999) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;

  const scene = new THREE.Scene();
  scene.add(points);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 4.2, 2.0);
  camera.lookAt(0, 0, 0);

  const state = { aspect: 1 };
  const pointer = { x: 0, y: 0, active: false };
  const smooth = { x: 999, z: 999 };
  const controller = new AbortController();

  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.active = true;
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true, signal: controller.signal },
  );

  return {
    scene,
    camera,
    update(dt, time, reduce, shared) {
      // Kamera naik dan menjauh saat di-scroll.
      const progress = shared.progress ?? 0;
      camera.position.set(0, 4.2 + progress * 1.8, 2.0 + progress * 2.5);
      camera.lookAt(0, 0, 0);

      uniforms.uTime.value = time;

      const halfH = camera.position.length() * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
      const halfW = halfH * state.aspect;
      const k = 1 - Math.exp(-dt * 4);
      const active = pointer.active && !reduce;
      const tx = active ? pointer.x * halfW : 999;
      const tz = active ? -pointer.y * halfH : 999;
      smooth.x += (tx - smooth.x) * k;
      smooth.z += (tz - smooth.z) * k;
      uniforms.uPointer.value.set(smooth.x, smooth.z);
    },
    resize(w, h, pixelRatio) {
      state.aspect = w / h;
      camera.aspect = state.aspect;
      camera.updateProjectionMatrix();
      uniforms.uPixelRatio.value = pixelRatio;
    },
    dispose() {
      controller.abort();
      geometry.dispose();
      material.dispose();
    },
  };
}