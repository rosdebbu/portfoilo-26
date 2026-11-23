import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface IntroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const HEADLINE =
  'Engineering full-stack products, browser-native CFD simulations, and applied AI systems from first principles.';

export function IntroSection({ onNavigate }: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro-word', {
        yPercent: 110,
        duration: 0.75,
        stagger: 0.025,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = HEADLINE.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-5 pt-16 pb-24 text-[#111111] md:px-16 md:pt-36 md:pb-44"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-12 md:items-start md:gap-12">
        {/* Left: Word-by-word masked reveal (Dennis Snellenberg) */}
        <div className="md:col-span-8">
          <p className="mb-4 font-mono text-[11px] tracking-[0.2em] text-[#666666] uppercase md:mb-6 md:text-xs">
            01 / Introduction
          </p>
          <h2 className="font-display text-2xl leading-[1.2] font-medium tracking-[-0.025em] text-[#111111] sm:text-4xl md:text-[2.75rem]">
            {words.map((word, idx) => (
              <span key={idx} className="word-mask mr-[0.26em]">
                <span className="word-inner intro-word">{word}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Right: Concise bio + Magnetic circular About CTA */}
        <div className="flex flex-col items-start justify-between gap-7 md:col-span-4 md:gap-10 md:pt-10">
          <p className="text-sm leading-relaxed text-[#4B5563] sm:text-base">
            B.Tech CSE (Data Science) undergraduate at <strong className="font-medium text-[#111111]">SRMIST</strong>{' '}
            and <strong className="font-medium text-[#111111]">3rd Place NASA Space Apps</strong> winner. Driven by a
            strong interest in <strong className="font-medium text-[#111111]">CFD engineering</strong> (OpenFOAM,
            Navier–Stokes, ParaView), real-time Rust/FastAPI backends, and interactive WebGL.
          </p>

          <MagneticButton
            onClick={() => onNavigate('about')}
            className="h-32 w-32 rounded-full bg-[#1C1D20] text-sm font-medium text-white shadow-xl md:h-40 md:w-40 md:text-base"
            fillClassName="bg-[#455CE9]"
            strength={0.42}
            textStrength={0.22}
          >
            About me
          </MagneticButton>
        </div>
      </div>

      {/* Geometric Waveform Transition into #cfd-lab */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 w-full leading-none" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="block h-16 w-full sm:h-24 md:h-32"
        >
          <path
            fill="#0099ff"
            fillOpacity="0.22"
            transform="translate(0, -14)"
            d="M0,128L68.6,160L137.1,160L205.7,32L274.3,128L342.9,224L411.4,192L480,64L548.6,32L617.1,256L685.7,192L754.3,288L822.9,32L891.4,256L960,32L1028.6,288L1097.1,288L1165.7,0L1234.3,160L1302.9,128L1371.4,64L1440,160L1440,320L1371.4,320L1302.9,320L1234.3,320L1165.7,320L1097.1,320L1028.6,320L960,320L891.4,320L822.9,320L754.3,320L685.7,320L617.1,320L548.6,320L480,320L411.4,320L342.9,320L274.3,320L205.7,320L137.1,320L68.6,320L0,320Z"
          />
          <path
            fill="#0B0C10"
            fillOpacity="1"
            d="M0,128L68.6,160L137.1,160L205.7,32L274.3,128L342.9,224L411.4,192L480,64L548.6,32L617.1,256L685.7,192L754.3,288L822.9,32L891.4,256L960,32L1028.6,288L1097.1,288L1165.7,0L1234.3,160L1302.9,128L1371.4,64L1440,160L1440,320L1371.4,320L1302.9,320L1234.3,320L1165.7,320L1097.1,320L1028.6,320L960,320L891.4,320L822.9,320L754.3,320L685.7,320L617.1,320L548.6,320L480,320L411.4,320L342.9,320L274.3,320L205.7,320L137.1,320L68.6,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
}
