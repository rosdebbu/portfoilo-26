import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Layers } from 'lucide-react';
import { PROJECTS, type ProjectItem } from '../data/portfolioData';
import { ProjectSimCanvas } from './ProjectSimCanvas';
import { MagneticButton } from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface SpotlightChaptersProps {
  onSelectProject: (project: ProjectItem) => void;
}

export function SpotlightChapters({ onSelectProject }: SpotlightChaptersProps) {
  const containerRef = useRef<HTMLElement>(null);
  const featured = PROJECTS.filter((p) => p.featuredChapter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>('.spotlight-chapter');
      chapters.forEach((chapter) => {
        const stage = chapter.querySelector('.spotlight-stage');
        const floatCard = chapter.querySelector('.spotlight-float');

        if (stage) {
          gsap.fromTo(
            stage,
            { scale: 0.94, y: 36 },
            {
              scale: 1.03,
              y: -24,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        if (floatCard) {
          gsap.fromTo(
            floatCard,
            { y: 40 },
            {
              y: -36,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="spotlight"
      ref={containerRef}
      className="relative bg-[#111215] px-5 py-16 text-white md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header (Shopify Editions editorial typography) */}
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-white/12 pb-8 md:mb-16 md:flex-row md:items-end md:pb-10">
          <div>
            <p className="mb-2.5 font-mono text-[11px] tracking-[0.2em] text-white/50 uppercase md:mb-3 md:text-xs">
              03 / The Flagship Edition
            </p>
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
              Scroll-Choreographed
              <br />
              <span className="text-white/55">Engineering Highlights.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Three flagship systems spanning open-source AI agents, browser-native Navier–Stokes CFD simulation, and
            NASA satellite fire harmonization.
          </p>
        </div>

        {/* Chapters */}
        <div className="flex flex-col gap-16 md:gap-32">
          {featured.map((project, idx) => (
            <article
              key={project.id}
              className="spotlight-chapter grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-12"
            >
              {/* Visual Simulation Stage */}
              <div
                className={`relative overflow-hidden rounded-2xl border border-white/12 bg-black md:rounded-3xl lg:col-span-7 ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <div className="spotlight-stage relative aspect-[16/10] w-full overflow-hidden">
                  <ProjectSimCanvas
                    visualType={project.visualType}
                    accentFrom={project.accentFrom}
                    accentTo={project.accentTo}
                    bgTone={project.bgTone}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                </div>

                {/* Top-left live simulation pill */}
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[10px] text-white/85 backdrop-blur-md md:top-4 md:left-4 md:px-3.5 md:py-1.5 md:text-[11px]">
                  <span
                    className="h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: project.accentTo }}
                  />
                  <span>LIVE SIM · 0{idx + 1}</span>
                </div>

                {/* Desktop Floating Parallax Telemetry Card */}
                <div className="spotlight-float absolute right-4 bottom-4 hidden rounded-2xl border border-white/15 bg-[#16181D]/90 p-4 shadow-2xl backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-5">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="font-mono text-[10px] tracking-wider text-white/50 uppercase">{m.label}</div>
                        <div className="font-display text-lg font-semibold text-white">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Compact Telemetry Strip */}
                <div className="flex items-center justify-between border-t border-white/10 bg-[#16181D] px-4 py-2.5 sm:hidden">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-mono text-[9.5px] tracking-wider text-white/50 uppercase">{m.label}</div>
                      <div className="font-display text-sm font-semibold text-white">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editorial Copy */}
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="mb-2 flex items-center gap-3 font-mono text-[11px] text-white/55 md:mb-3 md:text-xs">
                  <span>CHAPTER 0{idx + 1}</span>
                  <span>·</span>
                  <span>{project.period}</span>
                </div>
                <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-white/80 sm:text-base">{project.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60 md:mt-4">{project.summary}</p>

                <div className="mt-5 flex flex-wrap gap-1.5 md:mt-6 md:gap-2">
                  {project.stack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 font-mono text-[10.5px] text-white/75 md:px-3 md:text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                  <MagneticButton
                    onClick={() => onSelectProject(project)}
                    className="rounded-full bg-white px-5 py-2.5 text-xs font-medium text-[#111111] md:px-6 md:py-3 md:text-sm"
                    fillClassName="bg-[#455CE9]"
                    strength={0.25}
                    textStrength={0.12}
                  >
                    <span className="inline-flex items-center gap-2 transition-colors">
                      <Layers className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      Inspect Case Study
                    </span>
                  </MagneticButton>

                  <a
                    href={project.liveUrl || project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-white/85 transition-colors hover:border-white hover:text-white md:px-5 md:py-3 md:text-sm"
                  >
                    <span>{project.liveUrl ? 'Live / Docs' : 'GitHub'}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
