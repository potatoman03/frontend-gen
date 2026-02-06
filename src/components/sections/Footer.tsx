'use client';

import { ScrollLinkedProgress } from '@/components/ui/ScrollLinkedProgress';
import type { TemplateConfig } from '@/lib/template-config';

type FooterProps = {
  template: TemplateConfig;
};

export function Footer({ template }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[rgba(5,8,20,0.65)]">
      <ScrollLinkedProgress />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-[var(--text-muted)]">{template.footer.text}</p>
        <div className="flex flex-wrap items-center gap-5">
          {template.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
