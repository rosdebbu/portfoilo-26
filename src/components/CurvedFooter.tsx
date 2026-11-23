import { useEffect, useRef, useState } from 'react';
import { ArrowDownLeft } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { MagneticButton } from './MagneticButton';

export function CurvedFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [istTime, setIstTime] = useState<string>('');

  // Real-time IST clock (Dennis Snellenberg live local time)
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: PROFILE.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setIstTime(`${formatted} IST`);
      } catch {
        setIstTime('GMT+5:30');
      }
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer id="contact" ref={footerRef} className="relative overflow-hidden bg-[#1C1D20] text-white">
      {/* Smooth Wave SVG Transition from White About Section into Dark Footer */}
      <div className="relative w-full bg-white leading-none" aria-hidden="true">
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
            d="M0,32L48,69.3C96,107,192,181,288,202.7C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,181.3C1248,171,1344,85,1392,42.7L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="#1C1D20"
            fillOpacity="1"
            d="M0,32L48,69.3C96,107,192,181,288,202.7C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,181.3C1248,171,1344,85,1392,42.7L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-16 md:pt-28 md:pb-12">
        {/* Top Row: Avatar + Let's work together + Arrow */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3.5 md:gap-5">
              <img
                src={PROFILE.photo}
                alt={PROFILE.name}
                className="h-12 w-12 rounded-full object-cover object-[center_20%] ring-2 ring-white/15 md:h-20 md:w-20"
              />
              <h2 className="font-display text-4xl leading-none font-medium tracking-[-0.03em] sm:text-6xl md:text-7xl">
                Let’s work
              </h2>
            </div>
            <h2 className="mt-1.5 font-display text-4xl leading-none font-medium tracking-[-0.03em] sm:text-6xl md:mt-2 md:text-7xl">
              together
            </h2>
          </div>

          <ArrowDownLeft className="hidden h-8 w-8 text-white/75 md:block" strokeWidth={1.6} />
        </div>

        {/* Horizontal Rule Intersected by Magnetic #455CE9 "Get in touch" Circle */}
        <div className="relative my-12 md:my-20">
          <div className="h-[1px] w-full bg-white/15" />
          <div className="mt-6 flex justify-end md:absolute md:top-1/2 md:right-12 md:mt-0 md:-translate-y-1/2">
            <MagneticButton
              href={`mailto:${PROFILE.email}`}
              className="h-32 w-32 rounded-full bg-[#455CE9] text-sm font-medium text-white shadow-2xl shadow-[#455CE9]/30 md:h-44 md:w-44 md:text-base"
              fillClassName="bg-[#334BD3]"
              strength={0.42}
              textStrength={0.22}
            >
              Get in touch
            </MagneticButton>
          </div>
        </div>

        {/* Contact Pill Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <MagneticButton
            href={`mailto:${PROFILE.email}`}
            className="w-full rounded-full border border-white/25 px-6 py-3.5 text-xs font-medium text-white sm:w-auto md:px-7 md:py-4 md:text-sm"
            fillClassName="bg-[#455CE9]"
            strength={0.24}
            textStrength={0.12}
          >
            {PROFILE.email}
          </MagneticButton>

          <MagneticButton
            href={`tel:${PROFILE.phone.replace(/\s+/g, '')}`}
            className="w-full rounded-full border border-white/25 px-6 py-3.5 text-xs font-medium text-white sm:w-auto md:px-7 md:py-4 md:text-sm"
            fillClassName="bg-[#455CE9]"
            strength={0.24}
            textStrength={0.12}
          >
            {PROFILE.phone}
          </MagneticButton>

          <MagneticButton
            href={PROFILE.resumePdf}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-full border border-white/25 px-6 py-3.5 text-xs font-medium text-white sm:w-auto md:px-7 md:py-4 md:text-sm"
            fillClassName="bg-[#455CE9]"
            strength={0.24}
            textStrength={0.12}
          >
            Resume PDF ↗
          </MagneticButton>
        </div>

        {/* Bottom Metadata Bar: Version, Live Local IST Time, Socials */}
        <div className="mt-20 flex flex-col justify-between gap-8 border-t border-white/12 pt-8 sm:flex-row sm:items-end">
          <div className="flex flex-wrap gap-10">
            <div>
              <div className="font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">Version</div>
              <div className="mt-1.5 text-sm text-white/90">2026 © Debjit Das</div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">Local Time</div>
              <div className="mt-1.5 font-mono text-sm text-white/90">{istTime || 'IST (GMT+5:30)'}</div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">Socials</div>
            <div className="mt-1.5 flex flex-wrap gap-5 text-sm text-white/85">
              <a href={PROFILE.github} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
                GitHub
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
                LinkedIn
              </a>
              <a href={PROFILE.leetcode} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
                LeetCode
              </a>
              <a href={PROFILE.zenodo} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
                Zenodo
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
