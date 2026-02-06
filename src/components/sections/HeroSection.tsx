'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

import { ScrollPinnedReveal } from '@/components/ui/ScrollPinnedReveal';
import { VideoBackground } from '@/components/ui/VideoBackground';
import type { TemplateConfig } from '@/lib/template-config';

type HeroSectionProps = {
  template: TemplateConfig;
  heroImageSrc: string;
  heroVideoSrc: string | null;
};

export function HeroSection({ template, heroImageSrc, heroVideoSrc }: HeroSectionProps) {
  return (
    <ScrollPinnedReveal pinHeight={3}>
      {(progress) => (
        <HeroContent
          template={template}
          heroImageSrc={heroImageSrc}
          heroVideoSrc={heroVideoSrc}
          progress={progress}
        />
      )}
    </ScrollPinnedReveal>
  );
}

function HeroContent({
  template,
  heroImageSrc,
  heroVideoSrc,
  progress
}: HeroSectionProps & { progress: MotionValue<number> }) {
  const eyebrowOpacity = useTransform(progress, [0, 0.15, 0.3], [0, 1, 1]);
  const headlineOpacity = useTransform(progress, [0.2, 0.45, 0.6], [0, 1, 1]);
  const headlineScale = useTransform(progress, [0.2, 0.45], [0.95, 1]);
  const subOpacity = useTransform(progress, [0.5, 0.75, 1.0], [0, 1, 1]);
  const subY = useTransform(progress, [0.5, 0.75], [40, 0]);

  return (
    <section id="top" className="relative isolate h-[100dvh] overflow-hidden">
      <VideoBackground videoSrc={heroVideoSrc} fallbackImageSrc={heroImageSrc} overlayOpacity={0} />

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--page-bg)] via-[var(--page-bg)]/50 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-24">
        <div className="max-w-3xl">
          <motion.div
            style={{ opacity: eyebrowOpacity }}
            className="mb-5 inline-block rounded-full border border-[var(--border)] bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]"
          >
            {template.hero.eyebrow}
          </motion.div>

          <motion.h1
            style={{ opacity: headlineOpacity, scale: headlineScale }}
            className="max-w-4xl text-balance text-6xl font-extralight tracking-wide text-[var(--text)] md:text-8xl"
          >
            {template.hero.headline}
          </motion.h1>

          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--text-muted)] md:text-lg"
          >
            {template.hero.subheadline}
          </motion.p>

          <motion.div
            style={{ opacity: subOpacity, y: subY }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#cta"
              className="rounded-full bg-[var(--accent-primary)] px-7 py-3 text-sm font-semibold text-[var(--page-bg)] transition hover:brightness-110"
            >
              {template.hero.primaryCta}
            </a>
            <a
              href="#showcase"
              className="rounded-full border border-[var(--border)] bg-white/7 px-7 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white/12"
            >
              {template.hero.secondaryCta}
            </a>
          </motion.div>
        </div>

        <div className="mt-auto flex justify-center pt-14">
          <div className="flex animate-bounce flex-col items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-60">
              <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}
