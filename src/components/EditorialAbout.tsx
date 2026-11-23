import { ArrowUpRight, FileText } from 'lucide-react';
import { ACHIEVEMENTS, PROFILE, SKILLS_GROUPS } from '../data/portfolioData';

export function EditorialAbout() {
  return (
    <section id="about" className="relative bg-white px-6 pt-12 pb-28 text-[#111111] md:px-16 md:pb-36">
      <div className="mx-auto max-w-6xl">
        {/* Resident-inspired clean editorial header */}
        <div className="grid grid-cols-1 gap-12 border-t border-[#E5E7EB] pt-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-[#666666] uppercase">
              05 / Research &amp; Craft
            </p>
            <h2 className="font-display text-4xl font-medium tracking-[-0.03em] text-[#111111] sm:text-5xl">
              Built on rigor,
              <br />
              shipped with craft.
            </h2>

            {/* Monochrome Editorial Portrait Card (Resident style) */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#EAEAEA] bg-[#F7F7F7]">
              <img
                src={PROFILE.photo}
                alt={PROFILE.name}
                className="aspect-[4/3] w-full object-cover object-[center_22%] grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
              />
              <div className="flex items-center justify-between px-4 py-3 text-xs text-[#555555]">
                <span className="font-medium text-[#111111]">{PROFILE.university}</span>
                <span className="font-mono">CGPA {PROFILE.cgpa}</span>
              </div>
            </div>

            <a
              href={PROFILE.resumePdf}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#111111] px-5 py-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Download Full Resume PDF</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Right Column: Achievements + Technical Matrix */}
          <div className="flex flex-col gap-12 md:col-span-7">
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.18em] text-[#666666] uppercase">
                Recognition &amp; Research
              </h3>
              <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                {ACHIEVEMENTS.map((item) => (
                  <div key={item.title} className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12">
                    <span className="font-mono text-xs text-[#888888] sm:col-span-2">{item.year}</span>
                    <div className="sm:col-span-10">
                      <div className="font-display text-lg font-medium text-[#111111]">{item.title}</div>
                      <p className="mt-1 text-sm text-[#555555]">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.18em] text-[#666666] uppercase">
                Technical Stack
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {SKILLS_GROUPS.map((group) => (
                  <div key={group.label} className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-5">
                    <div className="mb-3 font-display text-sm font-semibold text-[#111111]">{group.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-white px-2.5 py-1 font-mono text-[11px] text-[#374151] ring-1 ring-[#E5E7EB]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
