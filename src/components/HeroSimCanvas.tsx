import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type HeroSimMode = 'dither' | 'fluid' | 'halftone' | 'editorial';

interface HeroSimCanvasProps {
  mode: HeroSimMode;
  imageSrc: string;
}

const MODE_INDEX: Record<HeroSimMode, number> = {
  dither: 0,
  fluid: 1,
  halftone: 2,
  editorial: 3,
};

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageRes;
  uniform vec2 uMouse;
  uniform float uVelocity;
  uniform float uTime;
  uniform float uMode;
  uniform float uHasTexture;

  varying vec2 vUv;

  // Cover-fit UVs with subtle portrait framing bias upward
  vec2 getCoverUv(vec2 uv, vec2 res, vec2 imgRes) {
    float screenAspect = res.x / max(res.y, 1.0);
    float imgAspect = imgRes.x / max(imgRes.y, 1.0);
    vec2 scaled = uv;
    if (screenAspect > imgAspect) {
      float scale = imgAspect / screenAspect;
      scaled.y = (uv.y - 0.5) * scale + 0.56;
    } else {
      float scale = screenAspect / imgAspect;
      scaled.x = (uv.x - 0.5) * scale + 0.5;
    }
    return clamp(scaled, 0.001, 0.999);
  }

  // Simplex-like smooth hash noise for fluid simulation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // 4x4 Bayer ordered dithering matrix (Astro Dither)
  float bayer4(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int idx = y * 4 + x;
    if (idx == 0) return 0.0 / 16.0;
    if (idx == 1) return 8.0 / 16.0;
    if (idx == 2) return 2.0 / 16.0;
    if (idx == 3) return 10.0 / 16.0;
    if (idx == 4) return 12.0 / 16.0;
    if (idx == 5) return 4.0 / 16.0;
    if (idx == 6) return 14.0 / 16.0;
    if (idx == 7) return 6.0 / 16.0;
    if (idx == 8) return 3.0 / 16.0;
    if (idx == 9) return 11.0 / 16.0;
    if (idx == 10) return 1.0 / 16.0;
    if (idx == 11) return 9.0 / 16.0;
    if (idx == 12) return 15.0 / 16.0;
    if (idx == 13) return 7.0 / 16.0;
    if (idx == 14) return 13.0 / 16.0;
    return 5.0 / 16.0;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 uv = getCoverUv(vUv, uResolution, uImageRes);

    // Mouse parallax
    vec2 mouseOffset = (uMouse - 0.5) * 0.024;
    vec2 pUv = clamp(uv - mouseOffset, 0.002, 0.998);

    float dist = length((vUv - uMouse) * aspect);
    float cursorField = smoothstep(0.42, 0.0, dist);

    vec3 baseColor = vec3(0.18, 0.19, 0.22);
    if (uHasTexture > 0.5) {
      baseColor = texture2D(uTexture, pUv).rgb;
    }

    vec3 finalColor = baseColor;

    // MODE 0: ASTRO DITHER (Ordered Bayer + Neon + Glitch)
    if (uMode < 0.5) {
      float glitchShift = (cursorField * 0.016 + uVelocity * 0.012);
      float scanGlitch = step(0.985, sin(vUv.y * 80.0 + uTime * 3.5)) * 0.008;

      float r = texture2D(uTexture, clamp(pUv + vec2(glitchShift + scanGlitch, 0.0), 0.002, 0.998)).r;
      float g = texture2D(uTexture, pUv).g;
      float b = texture2D(uTexture, clamp(pUv - vec2(glitchShift, 0.0), 0.002, 0.998)).b;

      float luma = dot(vec3(r, g, b), vec3(0.299, 0.587, 0.114));
      // Boost contrast for dramatic dither silhouette
      luma = smoothstep(0.08, 0.88, luma);

      float pixelScale = mix(3.2, 2.0, cursorField);
      float threshold = bayer4(gl_FragCoord.xy / pixelScale);
      float bit = step(threshold, luma + cursorField * 0.14);

      vec3 bgDark = vec3(0.04, 0.045, 0.075);
      vec3 neonA = vec3(0.27, 0.36, 0.91);  // Electric blue (#455CE9)
      vec3 neonB = vec3(0.95, 0.18, 0.62);  // Astro magenta
      vec3 neonC = vec3(0.08, 0.92, 0.96);  // Cyber cyan

      float grad = clamp(vUv.x * 0.65 + sin(uTime * 0.45 + vUv.y * 2.5) * 0.25 + cursorField * 0.45, 0.0, 1.0);
      vec3 ink = mix(mix(neonA, neonB, grad), neonC, cursorField * 0.75);

      // Subtle starfield speckles in dark areas
      float star = step(0.9975, hash(floor(gl_FragCoord.xy / 2.0) + floor(uTime * 0.8)));
      finalColor = mix(bgDark + star * 0.35, ink, bit);
    }
    // MODE 1: FLUID SIMULATION (FoamTwin CFD Curl-Noise Ripple)
    else if (uMode < 1.5) {
      float n1 = noise(vUv * 6.0 + vec2(uTime * 0.35, -uTime * 0.2));
      float n2 = noise(vUv * 12.0 - vec2(uTime * 0.25, uTime * 0.4));
      vec2 flow = vec2(n1 - 0.5, n2 - 0.5) * (0.022 + cursorField * 0.065 + uVelocity * 0.05);

      float ripple = sin(dist * 34.0 - uTime * 5.0) * cursorField * 0.015;
      vec2 fUv = clamp(pUv + flow + vec2(ripple), 0.002, 0.998);

      float r = texture2D(uTexture, clamp(fUv + vec2(0.004 * cursorField, 0.0), 0.002, 0.998)).r;
      float g = texture2D(uTexture, fUv).g;
      float b = texture2D(uTexture, clamp(fUv - vec2(0.004 * cursorField, 0.0), 0.002, 0.998)).b;
      vec3 sampled = vec3(r, g, b);

      // Iridescent CFD velocity-field highlight near cursor
      vec3 cfdColor = mix(vec3(0.08, 0.35, 0.95), vec3(0.0, 0.95, 0.85), n1);
      finalColor = mix(sampled * 0.82, cfdColor, cursorField * 0.34 + abs(ripple) * 8.0);
    }
    // MODE 2: EDITORIAL HALFTONE (Dynamic Dot Screen)
    else if (uMode < 2.5) {
      float luma = dot(baseColor, vec3(0.299, 0.587, 0.114));
      float angle = 0.55;
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      float freq = mix(6.5, 4.5, cursorField);
      vec2 cell = fract((rot * gl_FragCoord.xy) / freq) - 0.5;
      float radius = sqrt(clamp(luma, 0.0, 1.0)) * 0.58;
      float dotMask = smoothstep(radius + 0.05, radius - 0.05, length(cell));

      vec3 paper = vec3(0.11, 0.115, 0.13);
      vec3 ink = mix(vec3(0.92, 0.93, 0.95), vec3(0.27, 0.36, 0.91), cursorField * 0.85);
      finalColor = mix(paper, ink, dotMask);
    }
    // MODE 3: EDITORIAL CLEAN (Dennis Snellenberg / Resident Neutral)
    else {
      float luma = dot(baseColor, vec3(0.299, 0.587, 0.114));
      vec3 desaturated = mix(vec3(luma), baseColor, 0.42);
      // Soft studio neutral lift
      finalColor = mix(vec3(0.56, 0.58, 0.59), desaturated, 0.78);
    }

    // Subtle edge vignette for typography legibility
    float vig = smoothstep(1.25, 0.32, length(vUv - 0.5));
    finalColor *= mix(0.68, 1.0, vig);

    // Bottom gradient scrim for hero marquee readability
    float bottomScrim = smoothstep(0.0, 0.36, vUv.y);
    finalColor *= mix(0.55, 1.0, bottomScrim);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function HeroSimCanvas({ mode, imageSrc }: HeroSimCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<number>(MODE_INDEX[mode]);

  useEffect(() => {
    modeRef.current = MODE_INDEX[mode];
  }, [mode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uImageRes: { value: new THREE.Vector2(1000, 1200) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uMode: { value: modeRef.current },
      uHasTexture: { value: 0 },
    };

    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      uniforms.uTexture.value = tex;
      uniforms.uHasTexture.value = 1;
      if (tex.image) {
        uniforms.uImageRes.value.set(tex.image.width || 1000, tex.image.height || 1200);
      }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };
    let velocity = 0;
    let lastInteractionAt = 0;

    const updateFromCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const nx = (clientX - rect.left) / Math.max(rect.width, 1);
      const ny = 1.0 - (clientY - rect.top) / Math.max(rect.height, 1);
      const dx = nx - targetMouse.x;
      const dy = ny - targetMouse.y;
      velocity = Math.min(1.5, velocity + Math.hypot(dx, dy) * 3.5);
      targetMouse.x = Math.max(0, Math.min(1, nx));
      targetMouse.y = Math.max(0, Math.min(1, ny));
      lastInteractionAt = performance.now();
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateFromCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateFromCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle autonomous shader drift on touch/idle screens so mobile stays alive
      if (performance.now() - lastInteractionAt > 2500) {
        targetMouse.x = 0.5 + Math.sin(elapsed * 0.55) * 0.22;
        targetMouse.y = 0.55 + Math.cos(elapsed * 0.42) * 0.16;
      }

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
      velocity *= 0.92;

      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
      uniforms.uVelocity.value = velocity;
      uniforms.uMode.value = modeRef.current;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden bg-[#1C1D20]"
      aria-hidden="true"
    />
  );
}
