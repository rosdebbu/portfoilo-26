import { useEffect, useRef } from 'react';
import type { SimVisualType } from '../data/portfolioData';

interface ProjectSimCanvasProps {
  visualType: SimVisualType;
  accentFrom: string;
  accentTo: string;
  bgTone: string;
  className?: string;
}

export function ProjectSimCanvas({
  visualType,
  accentFrom,
  accentTo,
  bgTone,
  className = '',
}: ProjectSimCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let t = Math.random() * 10;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    // Pre-seed deterministic nodes for network / globe
    const nodes = Array.from({ length: 18 }, (_, i) => ({
      x: ((i * 73) % 100) / 100,
      y: ((i * 41 + 17) % 100) / 100,
      vx: ((i % 3) - 1) * 0.0014 + 0.0005,
      vy: (((i + 1) % 3) - 1) * 0.0012 - 0.0004,
    }));

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      t += 0.018;

      // Base background
      ctx.fillStyle = bgTone;
      ctx.fillRect(0, 0, w, h);

      // Soft ambient gradient glow
      const grad = ctx.createRadialGradient(
        w * (0.5 + Math.sin(t * 0.5) * 0.15),
        h * (0.5 + Math.cos(t * 0.4) * 0.15),
        10,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.72
      );
      grad.addColorStop(0, accentFrom + '44');
      grad.addColorStop(0.55, accentTo + '18');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (visualType === 'fluid') {
        // Navier-Stokes inspired flow streamlines around a cylinder obstacle
        const cx = w * 0.38;
        const cy = h * 0.5;
        const r = Math.min(w, h) * 0.13;

        for (let row = 0; row < 14; row++) {
          const baseY = (h / 15) * (row + 1);
          ctx.beginPath();
          for (let x = 0; x <= w; x += 10) {
            const dx = x - cx;
            const dy = baseY - cy;
            const d2 = dx * dx + dy * dy + 220;
            const wake = x > cx ? Math.sin(x * 0.045 - t * 4.2 + row * 0.6) * Math.exp(-Math.abs(dy) / 55) * 14 : 0;
            const deflect = (dy / d2) * r * r * 1.9;
            const y = baseY + deflect + wake + Math.sin(x * 0.02 - t * 2.2) * 3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = row % 2 === 0 ? accentTo + 'cc' : accentFrom + 'aa';
          ctx.lineWidth = row % 3 === 0 ? 1.8 : 1.1;
          ctx.stroke();
        }

        // Obstacle cylinder
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = '#090910';
        ctx.fill();
        ctx.strokeStyle = accentTo;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      } else if (visualType === 'network') {
        // AI Agent node graph with live data packets
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0.08 || n.x > 0.92) n.vx *= -1;
          if (n.y < 0.12 || n.y > 0.88) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = (nodes[i].x - nodes[j].x) * w;
            const dy = (nodes[i].y - nodes[j].y) * h;
            const dist = Math.hypot(dx, dy);
            if (dist < Math.min(w, h) * 0.42) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
              ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
              ctx.strokeStyle = accentFrom + '66';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        nodes.forEach((n, idx) => {
          const px = n.x * w;
          const py = n.y * h;
          const pulse = 2.5 + Math.sin(t * 3 + idx) * 1.4;
          ctx.beginPath();
          ctx.arc(px, py, pulse, 0, Math.PI * 2);
          ctx.fillStyle = idx % 3 === 0 ? accentTo : '#ffffff';
          ctx.fill();
        });
      } else if (visualType === 'globe') {
        // Rotating wireframe orbital globe with NASA fire hotspots
        const cx = w * 0.5;
        const cy = h * 0.5;
        const R = Math.min(w, h) * 0.34;

        ctx.strokeStyle = accentTo + '45';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = -2; i <= 2; i++) {
          const ry = (i / 3) * R;
          const rx = Math.sqrt(Math.max(0, R * R - ry * ry));
          ctx.beginPath();
          ctx.ellipse(cx, cy + ry, rx, rx * 0.18, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        for (let m = 0; m < 6; m++) {
          const a = (m / 6) * Math.PI + t * 0.35;
          const rx = Math.abs(Math.cos(a)) * R;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
          ctx.strokeStyle = accentFrom + '55';
          ctx.stroke();
        }

        // Orbiting fire hotspots
        for (let k = 0; k < 14; k++) {
          const lon = k * 1.1 + t * 0.65;
          const lat = Math.sin(k * 2.1) * 0.9;
          const z = Math.cos(lon) * Math.cos(lat);
          if (z > -0.1) {
            const x = cx + Math.sin(lon) * Math.cos(lat) * R;
            const y = cy + Math.sin(lat) * R;
            const r = 2.2 + (z + 0.1) * 3.5;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = k % 2 === 0 ? accentFrom : accentTo;
            ctx.fill();
          }
        }
      } else if (visualType === 'dither') {
        // Animated ordered Bayer dither plasma field
        const step = 9;
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const nx = x / w;
            const ny = y / h;
            const v =
              Math.sin(nx * 6 + t * 1.4) * 0.5 +
              Math.cos(ny * 5 - t * 1.1) * 0.5 +
              Math.sin((nx + ny) * 4 + t);
            const norm = (v + 2) / 4;
            const bayer = (((x / step) % 2) * 2 + ((y / step) % 2)) / 4;
            if (norm > bayer * 0.85 + 0.15) {
              ctx.fillStyle = norm > 0.65 ? accentTo + 'cc' : accentFrom + 'aa';
              ctx.fillRect(x, y, step - 3, step - 3);
            }
          }
        }
      } else if (visualType === 'matrix') {
        // Fintech real-time EMI curve + glowing grid
        ctx.strokeStyle = accentFrom + '25';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 28) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 28) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        for (let c = 0; c < 3; c++) {
          ctx.beginPath();
          for (let x = 0; x <= w; x += 6) {
            const p = x / w;
            const y =
              h * 0.65 -
              Math.pow(p, 1.5 + c * 0.35) * h * 0.42 +
              Math.sin(p * 10 - t * 2 + c) * 6;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = c === 0 ? accentFrom : c === 1 ? accentTo : '#ffffffaa';
          ctx.lineWidth = c === 0 ? 2.4 : 1.4;
          ctx.stroke();
        }
      } else {
        // Coastal telemetry / ShoreSense acoustic & tide waves
        for (let layer = 0; layer < 8; layer++) {
          ctx.beginPath();
          const baseY = h * 0.3 + layer * (h * 0.075);
          for (let x = 0; x <= w; x += 8) {
            const y =
              baseY +
              Math.sin(x * 0.025 + t * (1.8 + layer * 0.15) + layer) * 14 +
              Math.cos(x * 0.012 - t + layer * 0.7) * 8;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = layer % 2 === 0 ? accentFrom + 'bb' : accentTo + '88';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [visualType, accentFrom, accentTo, bgTone]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />;
}
