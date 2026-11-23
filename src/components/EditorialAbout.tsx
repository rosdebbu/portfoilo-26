import { ArrowUpRight, FileText } from 'lucide-react';
import { ACHIEVEMENTS, PROFILE, SKILLS_GROUPS } from '../data/portfolioData';

export function EditorialAbout() {
  return (
    <section id="about" className="relative bg-[#13151E] px-5 py-20 text-white md:px-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-[#60A5FA] uppercase">
              05 / Research &amp; Craft
            </p>
            <h2 className="font-display text-4xl font-medium tracking-[-0.03em] text-white sm:text-5xl">
              Built on rigor,
              <br />
              <span className="text-white/60">shipped with craft.</span>
            </h2>

            {/* Portrait Card */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/12 bg-[#0D0F16]">
              <img
                src={PROFILE.photo}
                alt={PROFILE.name}
                className="aspect-[4/3] w-full object-cover object-[center_22%] grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
              />
              <div className="flex items-center justify-between px-4 py-3 text-xs text-white/65">
                <span className="font-medium text-white">{PROFILE.university}</span>
                <span className="font-mono text-[#60A5FA]">CGPA {PROFILE.cgpa}</span>
              </div>
            </div>

            <a
              href={PROFILE.resumePdf}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:border-[#455CE9] hover:bg-[#455CE9]"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Download Full Resume PDF</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Right Column: Achievements + Technical Matrix */}
          <div className="flex flex-col gap-12 md:col-span-7">
            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.18em] text-white/50 uppercase">
                Recognition &amp; Research
              </h3>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {ACHIEVEMENTS.map((item) => (
                  <div key={item.title} className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12">
                    <span className="font-mono text-xs text-[#60A5FA] sm:col-span-2">{item.year}</span>
                    <div className="sm:col-span-10">
                      <div className="font-display text-lg font-medium text-white">{item.title}</div>
                      <p className="mt-1 text-sm text-white/60">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 font-mono text-xs tracking-[0.18em] text-white/50 uppercase">
                Technical Stack
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {SKILLS_GROUPS.map((group) => (
                  <div key={group.label} className="rounded-2xl border border-white/10 bg-[#0D0F16] p-5">
                    <div className="mb-3 font-display text-sm font-semibold text-white">{group.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/80"
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
