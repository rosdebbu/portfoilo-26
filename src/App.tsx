import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectItem } from './data/portfolioData';
import { Preloader } from './components/Preloader';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { CfdTopologyLab } from './components/CfdTopologyLab';
import { SpotlightChapters } from './components/SpotlightChapters';
import { WorkArchive } from './components/WorkArchive';
import { EditorialAbout } from './components/EditorialAbout';
import { CurvedFooter } from './components/CurvedFooter';
import { WaveDivider } from './components/WaveDivider';
import { ContactModal } from './components/ContactModal';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

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
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} onNavigate={handleNavigate} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <main>
        <HeroSection onNavigate={handleNavigate} onOpenMenu={() => setDrawerOpen(true)} />
        <WaveDivider fromColor="#14151A" toColor="#111218" variant="gentle" accent={false} />
        <IntroSection onNavigate={handleNavigate} />
        <WaveDivider fromColor="#111218" toColor="#0B0C10" variant="flow" />
        <CfdTopologyLab />
        <WaveDivider fromColor="#0B0C10" toColor="#111215" variant="swell" />
        <SpotlightChapters onSelectProject={setSelectedProject} />
        <WaveDivider fromColor="#111215" toColor="#0C0D12" variant="gentle" />
        <WorkArchive selectedProject={selectedProject} onSelectProject={setSelectedProject} />
        <WaveDivider fromColor="#0C0D12" toColor="#13151E" variant="flow" />
        <EditorialAbout />
        <WaveDivider fromColor="#13151E" toColor="#090A0E" variant="swell" />
      </main>

      <CurvedFooter onOpenContact={() => setContactOpen(true)} />
    </div>
  );
}

export default App;
