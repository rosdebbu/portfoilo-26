import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, type ProjectItem } from './data/portfolioData';
import { Preloader } from './components/Preloader';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { CfdTopologyLab } from './components/CfdTopologyLab';
import { SpotlightChapters } from './components/SpotlightChapters';
import { WorkArchive } from './components/WorkArchive';
import { VisualsGallery } from './components/VisualsGallery';
import { EditorialAbout } from './components/EditorialAbout';
import { CurvedFooter } from './components/CurvedFooter';
import { WaveDivider } from './components/WaveDivider';
import { ContactModal } from './components/ContactModal';
import { VerticalRuler } from './components/VerticalRuler';
import { BlueprintBackground } from './components/BlueprintBackground';

gsap.registerPlugin(ScrollTrigger);

// Scroll-linked accent stops (howsillyistoosilly.lol inspired)
const ACCENT_STOPS: [number, number, number][] = [
  [69, 92, 233],   // Hero: Electric Blue (#455CE9)
  [0, 210, 255],   // CFD Lab: Spectral Cyan (#00D2FF)
  [168, 85, 247],  // Spotlight: Violet (#A855F7)
  [16, 185, 129],  // Work: Emerald (#10B981)
  [244, 63, 94],   // Visuals: Rose (#F43F5E)
  [96, 165, 250],  // About & Contact: Sky Blue (#60A5FA)
];

function lerpColor(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (ACCENT_STOPS.length - 1);
  const idx = Math.min(ACCENT_STOPS.length - 2, Math.floor(scaled));
  const t = scaled - idx;
  const a = ACCENT_STOPS[idx];
  const b = ACCENT_STOPS[idx + 1];
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

export function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(() => {
    try {
      const slug = new URLSearchParams(window.location.search).get('project');
      if (slug) return PROJECTS.find((p) => p.id === slug) ?? null;
    } catch {
      // ignore
    }
    return null;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Keep ?project=<id> synced for shareable deep links
  const handleSelectProject = useCallback((project: ProjectItem | null) => {
    setSelectedProject(project);
    try {
      const url = new URL(window.location.href);
      if (project) url.searchParams.set('project', project.id);
      else url.searchParams.delete('project');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const updateAccent = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const hex = lerpColor(window.scrollY / maxScroll);
      document.documentElement.style.setProperty('--accent-hex', hex);
    };

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      updateAccent();
    });
    updateAccent();

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.0 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#090A0E] text-white">
      <Preloader onComplete={handlePreloaderComplete} />
      <BlueprintBackground />
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} onNavigate={handleNavigate} />
      <VerticalRuler />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <main className="relative z-20">
        <HeroSection onNavigate={handleNavigate} onOpenMenu={() => setDrawerOpen(true)} />
        <WaveDivider fromColor="#14151A" toColor="#111218" variant="gentle" accent={false} />
        <IntroSection onNavigate={handleNavigate} />
        <WaveDivider fromColor="#111218" toColor="#0B0C10" variant="flow" />
        <CfdTopologyLab />
        <WaveDivider fromColor="#0B0C10" toColor="#111215" variant="swell" />
        <SpotlightChapters onSelectProject={handleSelectProject} />
        <WaveDivider fromColor="#111215" toColor="#0C0D12" variant="gentle" />
        <WorkArchive selectedProject={selectedProject} onSelectProject={handleSelectProject} />
        <WaveDivider fromColor="#0C0D12" toColor="#0F1117" variant="flow" />
        <VisualsGallery />
        <WaveDivider fromColor="#0F1117" toColor="#13151E" variant="swell" />
        <EditorialAbout />
        <WaveDivider fromColor="#13151E" toColor="#090A0E" variant="gentle" />
      </main>

      <CurvedFooter onOpenContact={() => setContactOpen(true)} />
    </div>
  );
}

export default App;
