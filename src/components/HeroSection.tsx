import { useState } from 'react';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { HeroSimCanvas, type HeroSimMode } from './HeroSimCanvas';
import { MagneticButton } from './MagneticButton';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenMenu: () => void;
}

const SIM_MODES: { id: HeroSimMode; label: string; shortLabel: string }[] = [
  { id: 'dither', label: 'Bayer Dither', shortLabel: 'Dither' },
  { id: 'fluid', label: 'Fluid CFD', shortLabel: 'Fluid' },
  { id: 'halftone', label: 'Halftone', shortLabel: 'Halftone' },
  { id: 'editorial', label: 'Studio Clean', shortLabel: 'Clean' },
];

export function HeroSection({ onNavigate, onOpenMenu }: HeroSectionProps) {
  const [simMode, setSimMode] = useState<HeroSimMode>('dither');

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#1C1D20] text-white"
    >
      {/* Live WebGL Image Simulation Backdrop */}
      <HeroSimCanvas mode={simMode} imageSrc={PROFILE.photo} />

      {/* Top Block (Header + Mobile Compact Top Info so portrait center stays completely open) */}
      <div className="relative z-20 flex flex-col">
        <header className="flex items-center justify-between px-4 py-4 md:px-12 md:py-7">
          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="group flex items-center gap-1.5 text-xs font-medium tracking-tight text-white/95 sm:text-sm"
          >
            <span className="inline-block transition-transform duration-500 group-hover:rotate-[360deg]">©</span>
            <span className="relative flex h-5 items-center overflow-hidden">
              <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                Code by Debjit
              </span>
              <span className="absolute top-full left-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                Debjit Das · SRMIST
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {[
              { id: 'cfd-lab', label: 'CFD Lab' },
              { id: 'spotlight', label: 'Spotlight' },
              { id: 'work', label: 'Work' },
              { id: 'visuals', label: 'Visuals' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
            ].map((link) => (
              <MagneticButton
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                fillClassName="bg-white/12"
                strength={0.28}
                textStrength={0.14}
              >
                {link.label}
              </MagneticButton>
            ))}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md md:hidden"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#455CE9]" />
            <span>Menu</span>
          </button>
        </header>

        {/* MOBILE-ONLY: Tucked neatly at the top right under header, small minimal text, zero portrait blocking */}
        <div className="flex flex-col gap-2 px-4 pt-1 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1D20]/80 py-1 pr-2.5 pl-1.5 ring-1 ring-white/15 backdrop-blur-md">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <div className="globe-wrap scale-[0.42]" aria-hidden="true">
                  <div className="globe-meridian" />
                  <div className="globe-meridian globe-meridian-2" />
                  <div className="globe-meridian globe-meridian-3" />
                  <div className="globe-equator" />
                </div>
              </div>
              <span className="text-[10px] font-medium text-white/90">Chennai, India</span>
            </div>

            <span className="rounded-full bg-black/45 px-2.5 py-1 font-mono text-[9px] tracking-wider text-white/80 uppercase ring-1 ring-white/10 backdrop-blur-md">
              NASA 3rd · CFD · AI
            </span>
          </div>

          <div className="flex items-center gap-1.5 pl-0.5">
            <ArrowDownRight className="h-3.5 w-3.5 shrink-0 text-[#60A5FA]" strokeWidth={2} />
            <p className="font-display text-sm font-medium tracking-tight text-white drop-shadow-sm">
              Full-Stack, AI &amp; CFD Engineer
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP-ONLY Middle Row (Location badge lifted higher so portrait stays balanced) */}
      <div className="relative z-20 hidden items-start justify-between gap-8 md:flex">
        {/* Location Hanger Pill — positioned higher up */}
        <div className="-mt-12 inline-flex w-fit items-center gap-4 rounded-r-full bg-[#1C1D20]/88 py-2.5 pr-3.5 pl-8 shadow-2xl ring-1 ring-white/12 backdrop-blur-md">
          <div className="text-xs leading-snug font-medium text-white/85">
            <div>Located in</div>
            <div className="text-white">Chennai, India</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <div className="globe-wrap scale-[0.88]" aria-hidden="true">
              <div className="globe-meridian" />
              <div className="globe-meridian globe-meridian-2" />
              <div className="globe-meridian globe-meridian-3" />
              <div className="globe-equator" />
              <div className="globe-lat-top" />
              <div className="globe-lat-bot" />
            </div>
          </div>
        </div>

        {/* Right Side: Role + Desktop WebGL Simulation Switcher */}
        <div className="flex flex-col items-end gap-5 pr-12">
          <div className="max-w-xs rounded-2xl bg-black/38 p-4 text-right backdrop-blur-md">
            <ArrowDownRight className="mb-3 ml-auto h-7 w-7 text-white/90" strokeWidth={1.6} />
            <p className="font-display text-3xl leading-tight font-medium tracking-tight text-white">
              Full-Stack, AI
              <br />
              <span className="text-white/85">&amp; CFD Engineer</span>
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-wider text-white/80 uppercase">
              NASA Space Apps 3rd Place · OpenFOAM · WebGL
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-black/48 p-2 backdrop-blur-xl">
            <div className="mb-1.5 flex items-center gap-1.5 px-1.5 font-mono text-[10px] tracking-widest text-white/65 uppercase">
              <Sparkles className="h-3 w-3 text-[#455CE9]" />
              <span>Live WebGL Shader · Move Cursor</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SIM_MODES.map((m) => {
                const active = simMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSimMode(m.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#455CE9] text-white shadow-lg shadow-[#455CE9]/35'
                        : 'bg-white/10 text-white/80 hover:bg-white/18 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Block: Mobile ultra-slim single-row Shader bar + Infinite Name Marquee */}
      <div className="relative z-20 flex flex-col gap-3 pb-4 md:mt-8 md:pb-8">
        {/* MOBILE-ONLY ultra-slim single-row shader strip tucked right above marquee */}
        <div className="px-4 md:hidden">
          <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-1 rounded-full border border-white/15 bg-black/50 p-1 backdrop-blur-xl">
            {SIM_MODES.map((m) => {
              const active = simMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSimMode(m.id)}
                  className={`flex-1 rounded-full px-2 py-1 text-[10px] font-medium transition-all ${
                    active ? 'bg-[#455CE9] text-white shadow-sm' : 'text-white/75'
                  }`}
                >
                  {m.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="animate-marquee select-none">
          {[0, 1].map((copy) => (
            <h1
              key={copy}
              aria-hidden={copy === 1}
              className="font-display text-[10vw] leading-[0.95] font-medium tracking-[-0.035em] whitespace-nowrap text-white md:text-[7.2vw]"
            >
              Debjit Das <span className="mx-4 font-light text-white/40 md:mx-6">—</span>
              Creative Engineer <span className="mx-4 font-light text-white/40 md:mx-6">—</span>
            </h1>
          ))}
        </div>
      </div>
    </section>
  );
}
