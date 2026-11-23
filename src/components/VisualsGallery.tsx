import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, GripVertical, Maximize2, RotateCcw, X } from 'lucide-react';

interface GalleryPhoto {
  id: string;
  src: string;
  label: string;
  date: string;
}

const INITIAL_PHOTOS: GalleryPhoto[] = [
  { id: 'shot-01', src: '/gallery/shot-01.jpg', label: 'Night Frame 01', date: 'Jan 2025' },
  { id: 'shot-02', src: '/gallery/shot-02.jpg', label: 'Dawn Horizon', date: 'May 2025' },
  { id: 'shot-03', src: '/gallery/shot-03.jpg', label: 'Early Light', date: 'Oct 2025' },
  { id: 'shot-04', src: '/gallery/shot-04.jpg', label: 'Morning Sky', date: 'Oct 2025' },
  { id: 'shot-05', src: '/gallery/shot-05.jpg', label: 'Midday Nature', date: 'Dec 2025' },
  { id: 'shot-06', src: '/gallery/shot-06.jpg', label: 'Golden Hour', date: 'May 2026' },
  { id: 'shot-07', src: '/gallery/shot-07.jpg', label: 'Afternoon Clouds', date: 'May 2026' },
  { id: 'shot-08', src: '/gallery/shot-08.jpg', label: 'Open Landscape', date: 'May 2026' },
  { id: 'shot-09', src: '/gallery/shot-09.jpg', label: 'Canopy Light', date: 'May 2026' },
  { id: 'shot-10', src: '/gallery/shot-10.jpg', label: 'Monsoon Drift', date: 'Jul 2026' },
  { id: 'shot-11', src: '/gallery/shot-11.jpg', label: 'Sunlit Flora', date: 'Oct 2026' },
  { id: 'shot-12', src: '/gallery/shot-12.jpg', label: 'Dusk Silhouette', date: 'Oct 2026' },
  { id: 'shot-13', src: '/gallery/shot-13.jpg', label: 'Pre-Dawn Quiet', date: 'Oct 2026' },
  { id: 'shot-14', src: '/gallery/shot-14.jpg', label: 'Evening Glow', date: 'Oct 2026' },
  { id: 'shot-15', src: '/gallery/shot-15.jpg', label: 'After Hours', date: 'Oct 2026' },
  { id: 'shot-16', src: '/gallery/shot-16.jpg', label: 'Late Afternoon', date: 'Oct 2026' },
];

const STORAGE_KEY = 'debjit_gallery_order_v1';

export function VisualsGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        const map = new Map(INITIAL_PHOTOS.map((p) => [p.id, p]));
        const ordered = ids.map((id) => map.get(id)).filter((p): p is GalleryPhoto => Boolean(p));
        if (ordered.length === INITIAL_PHOTOS.length) return ordered;
      }
    } catch {
      // ignore localStorage errors
    }
    return INITIAL_PHOTOS;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [isCustomOrder, setIsCustomOrder] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    const isDefault = photos.every((p, idx) => p.id === INITIAL_PHOTOS[idx].id);
    setIsCustomOrder(!isDefault);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos.map((p) => p.id)));
    } catch {
      // ignore
    }
  }, [photos]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, photos.length]);

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setPhotos((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((p) => p.id === draggedId);
      const toIdx = next.findIndex((p) => p.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDraggedId(null);
    setDragOverId(null);
  };

  const resetOrder = () => {
    setPhotos(INITIAL_PHOTOS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <section id="visuals" className="relative bg-[#0F1117] px-4 py-20 text-white md:px-10 md:py-28">
      <div className="mx-auto max-w-[1380px]">
        {/* Header (howsillyistoosilly.lol inspired) */}
        <div className="mx-auto mb-10 flex max-w-6xl flex-col justify-between gap-5 px-1 md:mb-12 md:flex-row md:items-end">
          <div>
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'var(--accent-hex, #60A5FA)' }}>
                05 / Visuals · Photography
              </span>
              <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/65">
                {photos.length} frames
              </span>
            </div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
              Through My Lens
              <span style={{ color: 'var(--accent-hex, #455CE9)' }}>.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] text-white/65">
              <GripVertical className="h-3.5 w-3.5 text-white/45" />
              <span>Drag to rearrange · Tap to expand</span>
            </span>

            {isCustomOrder && (
              <button
                type="button"
                onClick={resetOrder}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 font-mono text-[11px] text-white/85 transition-colors hover:bg-white/15"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset order</span>
              </button>
            )}
          </div>
        </div>

        {/* Full-bleed Responsive CSS Masonry (4 cols desktop, 2 cols phone) */}
        <div className="columns-2 gap-3 sm:columns-3 md:gap-4 lg:columns-4">
          {photos.map((photo, idx) => {
            const isDragging = draggedId === photo.id;
            const isOver = dragOverId === photo.id && draggedId !== photo.id;

            return (
              <figure
                key={photo.id}
                draggable
                onDragStart={() => setDraggedId(photo.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverId !== photo.id) setDragOverId(photo.id);
                }}
                onDragLeave={() => {
                  if (dragOverId === photo.id) setDragOverId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(photo.id);
                }}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDragOverId(null);
                }}
                onClick={() => setLightboxIdx(idx)}
                className={`group relative mb-3 break-inside-avoid cursor-grab overflow-hidden rounded-xl border bg-[#161822] transition-all duration-300 active:cursor-grabbing md:mb-4 ${
                  isDragging
                    ? 'scale-95 opacity-45'
                    : isOver
                      ? 'scale-[1.02] border-[#455CE9] ring-2 ring-[#455CE9]/50'
                      : 'border-white/10 hover:z-10 hover:scale-[1.025] hover:border-white/30 hover:shadow-2xl'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Subtle hover overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="pointer-events-none absolute right-2.5 bottom-2.5 left-2.5 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-black/60 px-2.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-md">
                    {photo.date}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </span>
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={photos[lightboxIdx].label}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] max-w-5xl flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close photo"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={photos[lightboxIdx].src}
              alt={photos[lightboxIdx].label}
              className="max-h-[80vh] max-w-full rounded-2xl border border-white/15 object-contain shadow-2xl"
            />

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)}
                aria-label="Previous photo"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#455CE9]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="font-mono text-xs text-white/75">
                {lightboxIdx + 1} / {photos.length} · {photos[lightboxIdx].date}
              </span>

              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)}
                aria-label="Next photo"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#455CE9]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
