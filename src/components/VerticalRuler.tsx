import { useEffect, useState } from 'react';

export function VerticalRuler() {
  const [cursorY, setCursorY] = useState<number>(240);
  const [scrollPct, setScrollPct] = useState<number>(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setCursorY(e.clientY);
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollPct(Math.round((window.scrollY / maxScroll) * 100));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const ticks = Array.from({ length: 36 }, (_, i) => i);

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 z-30 hidden h-screen w-10 flex-col items-end justify-between border-l border-white/8 bg-[#090A0E]/45 py-24 backdrop-blur-xs xl:flex"
    >
      {/* Tick marks */}
      <div className="flex h-full w-full flex-col items-end justify-between pr-1">
        {ticks.map((i) => {
          const isMajor = i % 6 === 0;
          const isMed = i % 3 === 0 && !isMajor;
          return (
            <div key={i} className="flex items-center gap-1">
              {isMajor && (
                <span className="font-mono text-[8px] text-white/30">
                  {String(i * 3).padStart(2, '0')}
                </span>
              )}
              <span
                className={`block h-px ${
                  isMajor ? 'w-3.5 bg-white/35' : isMed ? 'w-2 bg-white/20' : 'w-1 bg-white/12'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Live cursor Y hairline marker tinted by scroll-interpolated accent */}
      <div
        className="fixed right-0 flex items-center transition-transform duration-75"
        style={{ top: 0, transform: `translate3d(0, ${cursorY}px, 0)` }}
      >
        <span
          className="block h-[1.5px] w-7 shadow-sm"
          style={{ backgroundColor: 'var(--accent-hex, #455CE9)' }}
        />
      </div>

      {/* Bottom scroll percentage */}
      <div
        className="fixed right-1.5 bottom-4 font-mono text-[9px] font-medium"
        style={{ color: 'var(--accent-hex, #60A5FA)' }}
      >
        {String(scrollPct).padStart(2, '0')}%
      </div>
    </aside>
  );
}
