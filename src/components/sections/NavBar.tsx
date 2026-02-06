import type { TemplateConfig } from '@/lib/template-config';

type NavBarProps = {
  template: TemplateConfig;
};

export function NavBar({ template }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--page-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="inline-flex items-center gap-3">
          <span className="text-xl font-extralight tracking-[0.25em] uppercase text-[var(--text)]">{template.brandName}</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {template.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#cta"
          className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition hover:bg-white/10"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
