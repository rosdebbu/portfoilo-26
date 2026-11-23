import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, ArrowUpRight, Flame, RotateCcw, Sliders, Wind } from 'lucide-react';

type CfdFieldMode = 'topology' | 'vorticity' | 'pressure' | 'thermal';
type ObstacleType = 'cylinder' | 'airfoil' | 'none';

const FIELD_MODES: { id: CfdFieldMode; label: string; desc: string }[] = [
  { id: 'topology', label: 'Spectral Contours', desc: 'Topology iso-elevation & wave interference' },
  { id: 'vorticity', label: 'Vorticity Wake', desc: 'Kármán vortex street & shear curl' },
  { id: 'pressure', label: 'Pressure Iso-Lines', desc: 'Stagnation & Bernoulli pressure contours' },
  { id: 'thermal', label: 'Thermal Plume', desc: 'Convective heat-transfer field (FoamTwin)' },
];

const OBSTACLES: { id: ObstacleType; label: string }[] = [
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'airfoil', label: 'NACA Airfoil' },
  { id: 'none', label: 'Free Field' },
];

const MODE_NUM: Record<CfdFieldMode, number> = {
  topology: 0,
  vorticity: 1,
  pressure: 2,
  thermal: 3,
};

const OBSTACLE_NUM: Record<ObstacleType, number> = {
  cylinder: 0,
  airfoil: 1,
  none: 2,
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uPointerActive;
  uniform float uTime;
  uniform float uReynolds;
  uniform float uVelocity;
  uniform float uMode;
  uniform float uObstacle;

  varying vec2 vUv;

  // Smooth value noise + fBM for turbulence
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.04 + vec2(17.1, 31.7);
      a *= 0.5;
    }
    return v;
  }

  // Signed distance for cylinder or NACA-like symmetric airfoil
  float obstacleSDF(vec2 p, float type) {
    if (type > 1.5) return 10.0; // Free field
    if (type < 0.5) {
      return length(p) - 0.145; // Cylinder
    }
    // Symmetric NACA-inspired teardrop airfoil tilted slightly
    float ang = -0.14;
    mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 q = rot * p;
    q.x += 0.05;
    float x = clamp((q.x + 0.18) / 0.42, 0.0, 1.0);
    float halfThick = 0.14 * (2.969 * sqrt(max(x, 0.0001)) - 1.26 * x - 1.71 * x * x);
    float dx = max(abs(q.x - 0.03) - 0.21, 0.0);
    float dy = abs(q.y) - max(halfThick, 0.002);
    return length(vec2(dx, max(dy, 0.0))) + min(max(dx, dy), 0.0);
  }

  // Spectral iridescent palette inspired by Topology (recent.design/i/4hdoto0-topology)
  vec3 topologyPalette(float t) {
    vec3 a = vec3(0.55, 0.56, 0.68);
    vec3 b = vec3(0.45, 0.42, 0.44);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.08, 0.34, 0.62);
    return a + b * cos(6.28318 * (c * t + d));
  }

  // Scientific CFD colormaps
  vec3 vorticityPalette(float t) {
    vec3 neg = vec3(0.07, 0.32, 0.92);
    vec3 mid = vec3(0.06, 0.07, 0.11);
    vec3 pos = vec3(0.96, 0.22, 0.52);
    vec3 hi  = vec3(0.15, 0.95, 0.96);
    vec3 col = t < 0.5 ? mix(neg, mid, t * 2.0) : mix(mid, pos, (t - 0.5) * 2.0);
    return mix(col, hi, smoothstep(0.82, 1.0, t));
  }

  vec3 pressurePalette(float t) {
    vec3 c0 = vec3(0.05, 0.08, 0.18);
    vec3 c1 = vec3(0.14, 0.42, 0.88);
    vec3 c2 = vec3(0.12, 0.84, 0.78);
    vec3 c3 = vec3(0.98, 0.86, 0.36);
    if (t < 0.33) return mix(c0, c1, t / 0.33);
    if (t < 0.66) return mix(c1, c2, (t - 0.33) / 0.33);
    return mix(c2, c3, (t - 0.66) / 0.34);
  }

  vec3 thermalPalette(float t) {
    vec3 c0 = vec3(0.05, 0.03, 0.12);
    vec3 c1 = vec3(0.46, 0.11, 0.54);
    vec3 c2 = vec3(0.94, 0.34, 0.18);
    vec3 c3 = vec3(1.00, 0.92, 0.48);
    if (t < 0.35) return mix(c0, c1, t / 0.35);
    if (t < 0.72) return mix(c1, c2, (t - 0.35) / 0.37);
    return mix(c2, c3, (t - 0.72) / 0.28);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (vUv - 0.5) * aspect;

    // Obstacle positioned slightly upstream (left of center)
    vec2 obsCenter = vec2(-0.24 * aspect.x, 0.0);
    vec2 rel = p - obsCenter;
    float sdf = obstacleSDF(rel, uObstacle);

    // Normalized Reynolds factor (0 = laminar, 1 = turbulent shedding)
    float reNorm = clamp((uReynolds - 100.0) / 2300.0, 0.0, 1.0);
    float speed = 0.6 + uVelocity * 1.4;
    float t = uTime * speed;

    // Potential flow streamfunction + Kármán vortex street wake
    float r2 = dot(rel, rel) + 0.018;
    float obsStrength = uObstacle > 1.5 ? 0.0 : 1.0;

    // Streamfunction psi around obstacle
    float psi = rel.y * (1.0 - obsStrength * 0.022 / r2);

    // Downstream wake envelope
    float downstream = smoothstep(-0.04, 0.22, rel.x) * obsStrength;
    float wakeWidth = exp(-pow(rel.y / (0.18 + max(rel.x, 0.0) * 0.26), 2.0));

    // Alternating Karman vortices downstream
    float shedFreq = 4.2 + reNorm * 6.5;
    float karman = sin(rel.x * (9.0 + reNorm * 7.0) - t * shedFreq)
                 * cos(rel.y * 10.0)
                 * downstream * wakeWidth * (0.25 + reNorm * 0.85);

    // Turbulence eddies
    float turb = (fbm(vec2(p.x * 3.8 - t * 0.9, p.y * 3.8 + karman * 0.6)) - 0.5) * (0.25 + reNorm * 0.9);

    // Interactive cursor/touch vortex & wave ripple
    vec2 mPos = (uMouse - 0.5) * aspect;
    float mDist = length(p - mPos);
    float pointerWave = sin(mDist * 26.0 - uTime * 5.2) * exp(-mDist * 3.6) * (0.28 + uPointerActive * 0.45);

    // Stagnation pressure peak in front of obstacle
    float stag = exp(-length(rel - vec2(-0.15, 0.0)) * 7.5) * obsStrength * 0.85;

    // Combine scalar field value
    float field = 0.5 + psi * 0.55 + karman * 0.52 + turb * 0.45 + pointerWave + stag * 0.45;

    // Concentric topographic contour iso-lines (Topology signature!)
    float contourFreq = mix(14.0, 22.0, reNorm);
    float contourVal = abs(fract(field * contourFreq) - 0.5);
    float isoLine = 1.0 - smoothstep(0.02, 0.075, contourVal);

    // Streamline filaments
    float streamVal = abs(fract((psi + karman * 0.28 + pointerWave * 0.25) * 9.0) - 0.5);
    float streamLine = 1.0 - smoothstep(0.015, 0.05, streamVal);

    vec3 col;
    if (uMode < 0.5) {
      // MODE 0: TOPOLOGY SPECTRAL CONTOURS (recent.design/i/4hdoto0-topology)
      vec3 spectral = topologyPalette(field * 0.85 + uTime * 0.05);
      vec3 deepBase = mix(vec3(0.06, 0.07, 0.11), spectral * 0.72, 0.65);
      col = mix(deepBase, spectral * 1.25 + vec3(0.18), isoLine * 0.72);
      col += vec3(0.12, 0.16, 0.28) * streamLine * 0.25;
    } else if (uMode < 1.5) {
      // MODE 1: VORTICITY WAKE
      float vort = clamp(0.5 + karman * 0.85 + turb * 0.55 + pointerWave * 0.9, 0.0, 1.0);
      col = vorticityPalette(vort);
      col += vec3(0.85, 0.95, 1.0) * streamLine * 0.22;
      col += vec3(0.25, 0.5, 1.0) * isoLine * 0.14;
    } else if (uMode < 2.5) {
      // MODE 2: PRESSURE ISO-LINES
      float pres = clamp(0.45 + stag * 0.7 - abs(karman) * 0.45 + pointerWave * 0.6 + turb * 0.2, 0.0, 1.0);
      col = pressurePalette(pres);
      col = mix(col, vec3(0.95, 0.98, 1.0), isoLine * 0.42);
    } else {
      // MODE 3: THERMAL PLUME
      float temp = clamp(0.22 + downstream * wakeWidth * 0.72 + stag * 0.4 + turb * 0.35 + pointerWave * 0.5, 0.0, 1.0);
      col = thermalPalette(temp);
      col = mix(col, vec3(1.0, 0.96, 0.82), isoLine * 0.24);
    }

    // Crisp obstacle solid body + boundary-layer rim glow
    if (uObstacle < 1.5) {
      float bodyMask = smoothstep(0.005, -0.005, sdf);
      float rim = exp(-abs(sdf) * 55.0);
      col = mix(col, vec3(0.07, 0.08, 0.10), bodyMask);
      col += vec3(0.75, 0.88, 1.0) * rim * 0.65;
    }

    // Subtle scientific grid overlay
    vec2 gridUv = abs(fract(p * 6.0) - 0.5);
    float grid = (1.0 - smoothstep(0.48, 0.5, max(gridUv.x, gridUv.y))) * 0.05;
    col += vec3(1.0) * grid;

    // Gentle vignette
    float vig = smoothstep(1.3, 0.35, length(vUv - 0.5));
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function CfdTopologyLab() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fieldMode, setFieldMode] = useState<CfdFieldMode>('topology');
  const [obstacle, setObstacle] = useState<ObstacleType>('airfoil');
  const [reynolds, setReynolds] = useState<number>(1250);
  const [velocity, setVelocity] = useState<number>(0.65);

  const stateRef = useRef({
    mode: MODE_NUM.topology,
    obstacle: OBSTACLE_NUM.airfoil,
    reynolds: 1250,
    velocity: 0.65,
  });

  useEffect(() => {
    stateRef.current = {
      mode: MODE_NUM[fieldMode],
      obstacle: OBSTACLE_NUM[obstacle],
      reynolds,
      velocity,
    };
  }, [fieldMode, obstacle, reynolds, velocity]);

  useEffect(() => {
    const container = mountRef.current;
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
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uMouse: { value: new THREE.Vector2(0.55, 0.5) },
      uPointerActive: { value: 0 },
      uTime: { value: 0 },
      uReynolds: { value: stateRef.current.reynolds },
      uVelocity: { value: stateRef.current.velocity },
      uMode: { value: stateRef.current.mode },
      uObstacle: { value: stateRef.current.obstacle },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const targetMouse = { x: 0.55, y: 0.5 };
    const currentMouse = { x: 0.55, y: 0.5 };
    let pointerActive = 0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(rect.width, 1)));
      targetMouse.y = Math.max(0, Math.min(1, 1.0 - (clientY - rect.top) / Math.max(rect.height, 1)));
      pointerActive = 1.0;
    };

    const onPointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onPointerLeave = () => {
      pointerActive = 0;
    };

    const onResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);

    let rafId = 0;
    let visible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!visible) return;
      const elapsed = clock.getElapsedTime();

      if (pointerActive < 0.05) {
        targetMouse.x = 0.58 + Math.sin(elapsed * 0.6) * 0.16;
        targetMouse.y = 0.5 + Math.cos(elapsed * 0.5) * 0.14;
      }

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
      pointerActive *= 0.96;

      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
      uniforms.uPointerActive.value = pointerActive;
      uniforms.uReynolds.value = stateRef.current.reynolds;
      uniforms.uVelocity.value = stateRef.current.velocity;
      uniforms.uMode.value = stateRef.current.mode;
      uniforms.uObstacle.value = stateRef.current.obstacle;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const strouhal = (0.198 * (1 - 19.7 / Math.max(reynolds, 40))).toFixed(3);
  const regime = reynolds < 400 ? 'Laminar Flow' : reynolds < 1400 ? 'Vortex Shedding' : 'Turbulent Wake';

  return (
    <section id="cfd-lab" className="relative bg-[#0B0C10] px-5 py-16 text-white md:px-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Header explaining CFD Engineering Interest + Topology Inspiration */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/12 pb-8 md:mb-12 md:flex-row md:items-end">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#60A5FA] uppercase">
                02 / Interactive CFD &amp; Topology Lab
              </span>
              <span className="rounded-full border border-white/15 bg-white/6 px-2.5 py-0.5 font-mono text-[10px] text-white/70">
                Inspired by Topology · recent.design
              </span>
            </div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
              Computational Fluid Dynamics,
              <br />
              <span className="text-white/55">Live in the Browser.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/65">
            Beyond full-stack engineering, I’m deeply interested in{' '}
            <strong className="font-medium text-white">Computational Fluid Dynamics (CFD)</strong> — turning
            Navier–Stokes PDEs, OpenFOAM meshes, and ParaView fields into real-time interactive WebGL simulations.
          </p>
        </div>

        {/* Main Interactive WebGL Stage + HUD Controls */}
        <div className="overflow-hidden rounded-3xl border border-white/14 bg-[#11131A] shadow-2xl">
          {/* Live WebGL Canvas */}
          <div className="relative aspect-[4/3] w-full cursor-crosshair sm:aspect-[16/9]">
            <div ref={mountRef} className="absolute inset-0 h-full w-full" />

            {/* Top HUD Bar: Live CFD Telemetry */}
            <div className="pointer-events-none absolute top-3 right-3 left-3 flex flex-wrap items-center justify-between gap-2 md:top-5 md:right-5 md:left-5">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 font-mono text-[10px] text-white/90 backdrop-blur-md md:text-[11px]">
                <Activity className="h-3.5 w-3.5 text-[#00F0FF]" />
                <span>Re = {reynolds}</span>
                <span className="text-white/35">|</span>
                <span>St ≈ {strouhal}</span>
                <span className="hidden text-white/35 sm:inline">|</span>
                <span className="hidden text-[#60A5FA] sm:inline">{regime}</span>
              </div>

              <div className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 font-mono text-[10px] text-white/75 backdrop-blur-md">
                Move / Drag to Perturb Flow
              </div>
            </div>

            {/* Bottom-left active mode description */}
            <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-xl border border-white/12 bg-black/50 px-3.5 py-2 backdrop-blur-md sm:block md:bottom-5 md:left-5">
              <div className="font-mono text-[10px] tracking-wider text-white/55 uppercase">Active Field</div>
              <div className="text-xs font-medium text-white">
                {FIELD_MODES.find((m) => m.id === fieldMode)?.desc}
              </div>
            </div>
          </div>

          {/* Interactive CFD Controls Panel (Responsive for both Laptop & Phone) */}
          <div className="grid grid-cols-1 gap-6 border-t border-white/12 bg-[#13151C] p-5 md:grid-cols-12 md:p-6">
            {/* Field Mode Selector */}
            <div className="md:col-span-5">
              <div className="mb-2.5 flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/55 uppercase">
                <Flame className="h-3.5 w-3.5 text-[#455CE9]" />
                <span>Scalar / Vector Field</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {FIELD_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFieldMode(m.id)}
                    className={`rounded-xl px-3 py-2 text-left text-xs font-medium transition-all ${
                      fieldMode === m.id
                        ? 'bg-[#455CE9] text-white shadow-lg shadow-[#455CE9]/30'
                        : 'bg-white/6 text-white/75 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Obstacle Geometry Selector */}
            <div className="md:col-span-3">
              <div className="mb-2.5 flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/55 uppercase">
                <Wind className="h-3.5 w-3.5 text-[#00F0FF]" />
                <span>Boundary Body</span>
              </div>
              <div className="flex flex-wrap gap-2 md:flex-col">
                {OBSTACLES.map((obs) => (
                  <button
                    key={obs.id}
                    type="button"
                    onClick={() => setObstacle(obs.id)}
                    className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-medium transition-all md:text-left ${
                      obstacle === obs.id
                        ? 'bg-white text-[#111111] hover:bg-white hover:text-[#111111]'
                        : 'bg-white/6 text-white/75 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {obs.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reynolds & Velocity Sliders */}
            <div className="flex flex-col justify-between gap-4 md:col-span-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-wider text-white/65 uppercase">
                  <span className="inline-flex items-center gap-1.5">
                    <Sliders className="h-3 w-3 text-[#60A5FA]" />
                    Reynolds Number (Re)
                  </span>
                  <span className="text-white">{reynolds}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2400}
                  step={50}
                  value={reynolds}
                  onChange={(e) => setReynolds(Number(e.target.value))}
                  aria-label="Reynolds number"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-[#455CE9]"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-wider text-white/65 uppercase">
                  <span>Inflow Velocity (U∞)</span>
                  <span className="text-white">{velocity.toFixed(2)} m/s</span>
                </div>
                <input
                  type="range"
                  min={0.15}
                  max={1.5}
                  step={0.05}
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  aria-label="Inflow velocity"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-[#00F0FF]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setFieldMode('topology');
                    setObstacle('airfoil');
                    setReynolds(1250);
                    setVelocity(0.65);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-1.5 font-mono text-[11px] text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>

                <a
                  href="https://github.com/rosdebbu/openn_fOam"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-[#60A5FA] hover:underline"
                >
                  <span>OpenZess CFD Repo</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CFD Engineering Pillars (concise, authentic cards) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Navier–Stokes & Solvers',
              body: 'Building Python & Rust numerical solvers that stream live velocity, pressure, and vorticity fields over WebSockets.',
            },
            {
              title: 'OpenFOAM & ParaView',
              body: 'Exploring finite-volume meshing, boundary conditions, and VTK/ParaView export pipelines in OpenZess Studio & FoamTwin.',
            },
            {
              title: 'WebGL Scientific Visualization',
              body: 'Translating heavy desktop CFD post-processing into 60fps browser-native Three.js & GLSL shader viewports.',
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="font-display text-base font-medium text-white">{card.title}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-white/60">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
