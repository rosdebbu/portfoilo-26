import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Bookmark, Code2, ExternalLink, LayoutGrid, List, X } from 'lucide-react';
import { PROJECTS, type ProjectCategory, type ProjectItem } from '../data/portfolioData';
import { ProjectSimCanvas } from './ProjectSimCanvas';

const CATEGORIES: ProjectCategory[] = ['All', 'AI & Agents', '3D & Simulation', 'Full-Stack', 'Research & IoT'];

interface WorkArchiveProps {
  selectedProject: ProjectItem | null;
  onSelectProject: (project: ProjectItem | null) => void;
}

export function WorkArchive({ selectedProject, onSelectProject }: WorkArchiveProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  // Dennis Snellenberg cursor-tracking preview modal refs
  const modalRef = useRef<HTMLDivElement>(null);
  const cursorPillRef = useRef<HTMLDivElement>(null);

  const filteredProjects =
    activeCategory === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (viewMode !== 'list') return;
    const modal = modalRef.current;
    const pill = cursorPillRef.current;
    if (!modal || !pill) return;

    const xMoveModal = gsap.quickTo(modal, 'left', { duration: 0.55, ease: 'power3' });
    const yMoveModal = gsap.quickTo(modal, 'top', { duration: 0.55, ease: 'power3' });
    const xMovePill = gsap.quickTo(pill, 'left', { duration: 0.32, ease: 'power3' });
    const yMovePill = gsap.quickTo(pill, 'top', { duration: 0.32, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      xMoveModal(e.clientX);
      yMoveModal(e.clientY);
      xMovePill(e.clientX);
      yMovePill(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [viewMode]);

  // Escape key closes detail modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSelectProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSelectProject]);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="work" className="relative bg-white px-6 py-24 text-[#111111] md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header + recent.design Rough Notation accent + View Toggle */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-[#666666] uppercase">
                04 / Selected Work
              </span>
              <span className="relative inline-flex items-center px-2 py-0.5 font-mono text-[11px] font-medium text-[#E11D48]">
                interactive
                <svg
                  className="pointer-events-none absolute -inset-x-1 -inset-y-0.5 h-[calc(100%+4px)] w-[calc(100%+8px)]"
                  viewBox="0 0 110 30"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M6 18 C 12 4, 98 2, 104 14 C 108 25, 18 28, 7 20"
                    stroke="#E11D48"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="rough-path"
                  />
                </svg>
              </span>
            </div>
            <h2 className="font-display text-4xl font-medium tracking-[-0.03em] text-[#111111] sm:text-5xl">
              Recent Work &amp; Archive
            </h2>
          </div>

          {/* Toggle between Dennis Snellenberg List View and recent.design Grid View */}
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-[#F3F3F3] p-1">
            <button
              type="button"
              onClick={() => {
                setViewMode('list');
                setHoveredIndex(null);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-[#111111] text-white shadow-sm' : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List Preview</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('grid');
                setHoveredIndex(null);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                viewMode === 'grid' ? 'bg-[#111111] text-white shadow-sm' : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Gallery Grid</span>
            </button>
          </div>
        </div>

        {/* Sticky Filter Bar with recent.design scroll-fade-mask */}
        <div className="sticky top-0 z-30 -mx-2 mb-10 bg-white/90 px-2 py-3 backdrop-blur-md">
          <div className="scroll-fade-mask flex items-center gap-2 overflow-x-auto pr-18 md:pr-10">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setHoveredIndex(null);
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F3F3F3] text-[#555555] hover:bg-[#E5E7EB] hover:text-[#111111]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== VIEW 1: DENNIS SNELLENBERG LIST VIEW (Desktop rows + Mobile live preview tiles) ===== */}
        {viewMode === 'list' ? (
          <div className="border-t border-[#E5E7EB]">
            {filteredProjects.map((project, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onSelectProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectProject(project);
                  }}
                  className="group flex cursor-pointer flex-col justify-between gap-4 border-b border-[#E5E7EB] py-7 transition-colors duration-300 md:flex-row md:items-center md:px-4 md:py-11"
                >
                  {/* Mobile-only inline live simulation preview (Dennis .work-tiles style for touch screens) */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#111215] md:hidden">
                    <ProjectSimCanvas
                      visualType={project.visualType}
                      accentFrom={project.accentFrom}
                      accentTo={project.accentTo}
                      bgTone={project.bgTone}
                    />
                    <span className="absolute right-3 bottom-3 rounded-full bg-[#455CE9] px-3 py-1 text-[11px] font-medium text-white shadow-md">
                      View ↗
                    </span>
                  </div>

                  <div className="transition-all duration-300 md:group-hover:translate-x-2">
                    <h3
                      className={`font-display text-2xl font-medium tracking-tight transition-opacity duration-300 sm:text-4xl md:text-5xl ${
                        hoveredIndex !== null && !isHovered ? 'md:opacity-35' : 'opacity-100'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#666666] md:hidden">{project.tagline}</p>
                  </div>

                  <div className="flex items-center justify-between gap-8 transition-all duration-300 md:justify-end md:group-hover:-translate-x-2">
                    <span className="text-xs font-medium text-[#555555] md:text-sm">{project.discipline}</span>
                    <span className="font-mono text-xs text-[#888888]">{project.year}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ===== VIEW 2: RECENT.DESIGN AUTO-ANIMATING CARD GRID ===== */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const isSaved = !!savedIds[project.id];
              return (
                <article
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Animated simulation preview stage */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111215]">
                    <ProjectSimCanvas
                      visualType={project.visualType}
                      accentFrom={project.accentFrom}
                      accentTo={project.accentTo}
                      bgTone={project.bgTone}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                    {/* Hover Save Button (recent.design) */}
                    <button
                      type="button"
                      onClick={(e) => toggleSave(e, project.id)}
                      aria-label="Bookmark project"
                      className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
                        isSaved
                          ? 'bg-[#455CE9] text-white opacity-100'
                          : 'bg-black/55 text-white opacity-0 group-hover:opacity-100 hover:bg-black'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    {/* Outbound Link Pill (bottom-right) */}
                    <a
                      href={project.liveUrl || project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Open ${project.title}`}
                      className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-md transition-transform duration-300 hover:scale-110"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>

                    <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] text-white/90 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Card Footer */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-lg font-semibold text-[#111111]">{project.title}</h3>
                        <span className="font-mono text-[11px] text-[#777777]">{project.year}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#666666]">{project.tagline}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-[#F3F3F3] px-2 py-0.5 font-mono text-[10px] text-[#555555]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== DENNIS SNELLENBERG CURSOR-TRACKING FLOATING STACKED PREVIEW (Desktop List View) ===== */}
      {viewMode === 'list' && (
        <>
          <div
            ref={modalRef}
            className={`pointer-events-none fixed top-0 left-0 z-40 hidden h-[320px] w-[360px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] lg:block ${
              hoveredIndex !== null ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <div
              className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                transform: `translate3d(0, -${(hoveredIndex ?? 0) * 100}%, 0)`,
              }}
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="relative flex h-[320px] w-[360px] flex-col justify-end overflow-hidden p-5"
                  style={{ backgroundColor: project.bgTone }}
                >
                  <div className="absolute inset-0">
                    <ProjectSimCanvas
                      visualType={project.visualType}
                      accentFrom={project.accentFrom}
                      accentTo={project.accentTo}
                      bgTone={project.bgTone}
                    />
                  </div>
                  <div className="relative z-10 rounded-xl bg-black/50 px-3.5 py-2 backdrop-blur-md">
                    <div className="font-mono text-[10px] text-white/65 uppercase">{project.category}</div>
                    <div className="font-display text-sm font-medium text-white">{project.tagline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating #455CE9 "View" Cursor Pill */}
          <div
            ref={cursorPillRef}
            className={`pointer-events-none fixed top-0 left-0 z-50 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#455CE9] text-sm font-medium text-white shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] lg:flex ${
              hoveredIndex !== null ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            View
          </div>
        </>
      )}

      {/* ===== RECENT.DESIGN 3-COLUMN STYLE DETAIL MODAL ===== */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-8"
          onClick={() => onSelectProject(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[90vh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-3xl bg-white text-[#111111] shadow-2xl md:grid-cols-12 md:overflow-hidden"
          >
            {/* Left Metadata Column (recent.design aside[data-item-metadata]) */}
            <aside className="flex flex-col justify-between border-b border-[#EAEAEA] p-6 md:col-span-5 md:overflow-y-auto md:border-r md:border-b-0 md:p-8">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] tracking-wider text-[#666666] uppercase">
                      {selectedProject.category} · {selectedProject.period}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#111111]">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProject(null)}
                    aria-label="Close modal"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F3F3] text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">{selectedProject.summary}</p>

                {/* Metrics row */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[#EAEAEA] py-4">
                  {selectedProject.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-mono text-[10px] tracking-wider text-[#777777] uppercase">{m.label}</div>
                      <div className="font-display text-lg font-semibold text-[#111111]">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="mt-5">
                  <div className="mb-2 font-mono text-[10px] tracking-wider text-[#777777] uppercase">
                    Key Highlights
                  </div>
                  <ul className="space-y-2 text-xs leading-relaxed text-[#374151]">
                    {selectedProject.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#455CE9]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack tags */}
                <div className="mt-5">
                  <div className="mb-2 font-mono text-[10px] tracking-wider text-[#777777] uppercase">Tech Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-[#F3F3F3] px-3 py-1 font-mono text-[11px] text-[#333333]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-[#EAEAEA]">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#455CE9]"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>View Source</span>
                </a>
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] px-5 py-2.5 text-xs font-medium text-[#111111] transition-colors hover:border-[#111111]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
                {selectedProject.paperUrl && (
                  <a
                    href={selectedProject.paperUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] px-5 py-2.5 text-xs font-medium text-[#111111] transition-colors hover:border-[#111111]"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>Zenodo Paper</span>
                  </a>
                )}
              </div>
            </aside>

            {/* Right #EFEFEF Showcase Stage (shows on top on mobile for immediate visual impact) */}
            <div className="order-first flex flex-col items-center justify-center bg-[#EFEFEF] p-5 md:order-last md:col-span-7 md:p-10">
              <div className="w-full overflow-hidden rounded-2xl bg-[#111215] shadow-2xl ring-1 ring-black/10">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#18191D] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="font-mono text-[10px] text-white/55">{selectedProject.id}.simulation</span>
                </div>
                <div className="aspect-[16/10] w-full">
                  <ProjectSimCanvas
                    visualType={selectedProject.visualType}
                    accentFrom={selectedProject.accentFrom}
                    accentTo={selectedProject.accentTo}
                    bgTone={selectedProject.bgTone}
                  />
                </div>
              </div>
              <p className="mt-4 text-center font-mono text-[11px] text-[#666666]">
                Interactive visual simulation preview · Press ESC or click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
