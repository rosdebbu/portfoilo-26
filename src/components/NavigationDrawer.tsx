import { useEffect, useState } from 'react';
import { PROFILE } from '../data/portfolioData';
import { MagneticButton } from './MagneticButton';

interface NavigationDrawerProps {
  open: boolean;
  setOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'cfd-lab', label: 'CFD Lab' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function NavigationDrawer({ open, setOpen, onNavigate }: NavigationDrawerProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Scroll-triggered circular floating hamburger button (Dennis Snellenberg) */}
      <div
        className={`fixed top-4 right-4 z-[70] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:top-6 md:right-6 ${
          scrolled || open ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'
        }`}
      >
        <MagneticButton
          onClick={() => setOpen((v) => !v)}
          ariaLabel={open ? 'Close navigation menu' : 'Open navigation menu'}
          className={`h-13 w-13 rounded-full border border-white/15 shadow-2xl transition-colors duration-300 md:h-16 md:w-16 ${
            open ? 'bg-[#455CE9]' : 'bg-[#1C1D20]'
          }`}
          fillClassName="bg-[#455CE9]"
          strength={0.35}
          textStrength={0.18}
        >
          <div className="flex h-5 w-5 flex-col items-center justify-center gap-1.5 md:w-6">
            <span
              className={`block h-[1.5px] w-5 bg-white transition-transform duration-300 md:w-6 ${
                open ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white transition-transform duration-300 md:w-6 ${
                open ? '-translate-y-[4px] -rotate-45' : ''
              }`}
            />
          </div>
        </MagneticButton>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/55 backdrop-blur-xs transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Full-height Dark Slide-in Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[60] flex h-[100dvh] w-full max-w-[440px] flex-col justify-between bg-[#1C1D20] px-8 py-12 text-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] sm:px-14 sm:py-14 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-8 sm:pt-0">
          <p className="mb-6 border-b border-white/15 pb-3 text-[11px] font-medium tracking-[0.18em] text-white/45 uppercase sm:mb-8 sm:pb-4">
            Navigation
          </p>
          <nav className="flex flex-col gap-2.5 sm:gap-3">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className="group flex items-center gap-3.5 py-1 text-left font-display text-3xl font-medium tracking-tight text-white/85 transition-colors hover:text-white sm:text-5xl"
              >
                <span className="h-2.5 w-2.5 scale-0 rounded-full bg-[#455CE9] transition-transform duration-300 group-hover:scale-100" />
                <span className="transition-transform duration-300 group-hover:translate-x-2">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/15 pt-5 sm:pt-6">
          <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-white/45 uppercase sm:mb-4">Socials</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              GitHub
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              LinkedIn
            </a>
            <a href={PROFILE.leetcode} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              LeetCode
            </a>
            <a href={PROFILE.resumePdf} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              Resume PDF
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
