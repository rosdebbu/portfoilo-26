import { useEffect, useState } from 'react';
import gsap from 'gsap';

const GREETINGS = ['Hello', 'নমস্কার', 'नमस्ते', 'Vanakkam', 'Hola', 'Debjit Das'];

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (index < GREETINGS.length - 1) {
      const delay = index === 0 ? 420 : 145;
      const timer = setTimeout(() => setIndex((i) => i + 1), delay);
      return () => clearTimeout(timer);
    }

    const exitTimer = setTimeout(() => {
      gsap.to('.preloader-curtain', {
        yPercent: -115,
        duration: 0.85,
        ease: 'power4.inOut',
        onComplete: () => {
          setDone(true);
          onComplete();
        },
      });
    }, 260);

    return () => clearTimeout(exitTimer);
  }, [index, onComplete]);

  if (done) return null;

  return (
    <div
      className="preloader-curtain fixed inset-0 z-[100] flex items-center justify-center bg-[#141517] text-white"
      aria-label="Loading portfolio"
    >
      <div className="flex items-center gap-3.5 text-3xl font-medium tracking-tight md:text-5xl font-display">
        <span className="h-2.5 w-2.5 rounded-full bg-[#455CE9]" />
        <span>{GREETINGS[index]}</span>
      </div>
      {/* Curved bottom edge like Dennis Snellenberg */}
      <div
        className="pointer-events-none absolute -bottom-24 left-1/2 h-32 w-[140%] -translate-x-1/2 rounded-[50%] bg-[#141517]"
        aria-hidden="true"
      />
    </div>
  );
}
