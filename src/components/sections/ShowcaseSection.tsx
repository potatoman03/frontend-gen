'use client';

import { HorizontalScrollGallery } from '@/components/ui/HorizontalScrollGallery';
import { CounterAnimation } from '@/components/ui/CounterAnimation';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { fadeInUp } from '@/lib/animation-presets';
import type { TemplateConfig } from '@/lib/template-config';

type ShowcaseSectionProps = {
  template: TemplateConfig;
  portfolioImageSources: string[];
  heroImageSrc: string;
};

export function ShowcaseSection({ template, portfolioImageSources, heroImageSrc }: ShowcaseSectionProps) {
  const galleryItems = template.portfolio.items.map((item) => ({
    image: portfolioImageSources[item.imageIndex] ?? heroImageSrc,
    title: item.title,
    description: item.description,
  }));

  return (
    <section id="showcase">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal>
          <h2 className="text-3xl font-extralight text-balance text-[var(--text)] md:text-5xl">
            {template.showcase.title}
          </h2>
        </ScrollReveal>

        <div className="mt-14 flex flex-wrap items-start gap-12 md:gap-20">
          {template.showcase.stats.map((stat, i) => (
            <ScrollReveal key={stat.label} variants={fadeInUp} delay={i * 0.1}>
              <div className="flex flex-col">
                <CounterAnimation
                  value={parseInt(stat.value, 10)}
                  className="text-4xl font-extralight text-[var(--text)] md:text-5xl"
                />
                <span className="mt-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  {stat.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <HorizontalScrollGallery items={galleryItems} />
    </section>
  );
}
