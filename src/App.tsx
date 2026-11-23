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

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <div className="min-h-screen w-full bg-[#1C1D20]">
      <Preloader onComplete={handlePreloaderComplete} />
      <NavigationDrawer open={drawerOpen} setOpen={setDrawerOpen} onNavigate={handleNavigate} />

      <main>
        <HeroSection onNavigate={handleNavigate} onOpenMenu={() => setDrawerOpen(true)} />
        <IntroSection onNavigate={handleNavigate} />
        <CfdTopologyLab />
        <SpotlightChapters onSelectProject={setSelectedProject} />
        <WorkArchive selectedProject={selectedProject} onSelectProject={setSelectedProject} />
        <EditorialAbout />
      </main>

      <CurvedFooter />
    </div>
  );
}

export default App;
