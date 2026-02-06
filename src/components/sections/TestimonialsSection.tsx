'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import type { TemplateConfig } from '@/lib/template-config';

type TestimonialsSectionProps = {
  template: TemplateConfig;
};

export function TestimonialsSection({ template }: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0);
  const items = template.testimonials.items;

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  const current = items[index];

  return (
    <section id="testimonials" className="py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <p className="mb-12 text-xs uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            {template.testimonials.title}
          </p>
        </ScrollReveal>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.2, 0.65, 0.2, 1] }}
            >
              <p className="text-2xl font-light leading-relaxed text-balance text-[var(--text)] md:text-4xl">
                &ldquo;{current.quote}&rdquo;
              </p>
              <p className="mt-8 text-sm font-semibold text-[var(--accent-secondary)]">
                {current.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                {current.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
