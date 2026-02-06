'use client';

import { ScrollLinkedProgress } from '@/components/ui/ScrollLinkedProgress';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { slideInLeft, slideInRight } from '@/lib/animation-presets';
import type { TemplateConfig } from '@/lib/template-config';

type FeaturesSectionProps = {
  template: TemplateConfig;
};

export function FeaturesSection({ template }: FeaturesSectionProps) {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-6 py-24">
      <ScrollReveal>
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-[var(--text)] md:text-5xl">
          {template.features.title}
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-[var(--text-muted)]">
          {template.features.subtitle}
        </p>
      </ScrollReveal>

      <div className="mt-16">
        {template.features.items.map((feature, index) => (
          <div key={feature.id}>
            <div className="flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:gap-16">
              <ScrollReveal variants={slideInLeft} className="shrink-0">
                <span className="text-8xl font-extralight text-[var(--accent-primary)]/15 md:text-9xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </ScrollReveal>

              <ScrollReveal variants={slideInRight}>
                <h3 className="text-balance text-2xl font-light text-[var(--text)] md:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                  {feature.description}
                </p>
              </ScrollReveal>
            </div>

            {index < template.features.items.length - 1 && (
              <ScrollLinkedProgress />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
