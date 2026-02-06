import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { scaleReveal } from '@/lib/animation-presets';
import type { TemplateConfig } from '@/lib/template-config';

type CTASectionProps = {
  template: TemplateConfig;
};

export function CTASection({ template }: CTASectionProps) {
  return (
    <section id="cta" className="py-32">
      <ScrollReveal variants={scaleReveal} className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-5xl font-extralight text-balance text-[var(--text)] md:text-7xl">
          {template.cta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-[var(--text-muted)]">
          {template.cta.subtitle}
        </p>
        <button
          type="button"
          className="mt-12 rounded-full bg-[var(--accent-primary)] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-[var(--page-bg)] transition hover:brightness-110"
        >
          {template.cta.buttonText}
        </button>
      </ScrollReveal>
    </section>
  );
}
