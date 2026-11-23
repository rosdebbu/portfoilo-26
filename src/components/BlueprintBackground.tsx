import { useEffect, useRef } from 'react';

interface Shockwave {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

export function BlueprintBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pointer = { x: -999, y: -999 };
    const waves: Shockwave[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const onClick = (e: MouseEvent) => {
      // Spawn subtle pressure-wave ripple on click
      waves.push({ x: e.clientX, y: e.clientY, r: 8, alpha: 0.55 });
      if (waves.length > 5) waves.shift();
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    const spacing = width < 768 ? 44 : 38;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);

      const accent =
        getComputedStyle(document.documentElement).getPropertyValue('--accent-hex').trim() || '#455CE9';

      // Advance pressure shockwaves
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].r += 6.5;
        waves[i].alpha *= 0.94;
        if (waves[i].alpha < 0.02 || waves[i].r > Math.max(width, height) * 0.65) {
          waves.splice(i, 1);
        }
      }

      // Draw subtle pressure-wave rings
      for (const w of waves) {
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = w.alpha * 0.35;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Draw micro dot matrix with cursor repulsion + shockwave displacement
      const scrollOffset = (window.scrollY * 0.15) % spacing;
      for (let y = -scrollOffset; y < height + spacing; y += spacing) {
        for (let x = spacing * 0.5; x < width; x += spacing) {
          let dx = 0;
          let dy = 0;
          let highlight = 0;

          // Pointer deflection
          const px = x - pointer.x;
          const py = y - pointer.y;
          const pDist = Math.hypot(px, py);
          if (pDist < 120 && pDist > 1) {
            const force = (1 - pDist / 120) * 8;
            dx += (px / pDist) * force;
            dy += (py / pDist) * force;
            highlight = Math.max(highlight, 1 - pDist / 120);
          }

          // Shockwave displacement
          for (const w of waves) {
            const wx = x - w.x;
            const wy = y - w.y;
            const wDist = Math.hypot(wx, wy);
            const band = Math.abs(wDist - w.r);
            if (band < 36 && wDist > 1) {
              const push = (1 - band / 36) * 9 * w.alpha;
              dx += (wx / wDist) * push;
              dy += (wy / wDist) * push;
              highlight = Math.max(highlight, (1 - band / 36) * w.alpha);
            }
          }

          ctx.beginPath();
          ctx.arc(x + dx, y + dy, highlight > 0.15 ? 1.5 : 1.0, 0, Math.PI * 2);
          ctx.fillStyle = highlight > 0.15 ? accent : 'rgba(255, 255, 255, 0.08)';
          ctx.globalAlpha = highlight > 0.15 ? Math.min(0.65, 0.2 + highlight * 0.5) : 1;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      {/* Fixed click-shockwave pressure dot field */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 h-full w-full"
      />

      {/* Subtle Desktop CAD / Aerospace Vertical Drafting Guides */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 mx-auto hidden max-w-6xl border-x border-white/[0.04] lg:block"
      />
    </>
  );
}
