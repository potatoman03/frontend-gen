import type { CSSProperties } from 'react';

import { CTASection } from '@/components/sections/CTASection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { Footer } from '@/components/sections/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { NavBar } from '@/components/sections/NavBar';
import { ShowcaseSection } from '@/components/sections/ShowcaseSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { resolveAssetPath } from '@/lib/asset-resolver';
import { assetManifest } from '@/lib/asset-manifest';
import { defaultTemplateConfig, placeholderAssetSources } from '@/lib/placeholder-assets';

const template = defaultTemplateConfig;

const themeVars: CSSProperties = {
  '--page-bg': template.theme.pageBackground,
  '--surface': template.theme.surface,
  '--text': template.theme.text,
  '--text-muted': template.theme.textMuted,
  '--accent-primary': template.theme.accentPrimary,
  '--accent-secondary': template.theme.accentSecondary,
  '--accent-tertiary': template.theme.accentTertiary,
  '--border': template.theme.border
} as CSSProperties;

export default function LandingPage() {
  const heroImageSrc =
    resolveAssetPath(assetManifest.assets.heroImage, placeholderAssetSources.heroImage) ??
    placeholderAssetSources.heroImage;

  const heroVideoSrc = resolveAssetPath(assetManifest.assets.heroVideo, null);

  const portfolioImageSources = assetManifest.assets.portfolioImages.map((entry, i) =>
    resolveAssetPath(entry, placeholderAssetSources.portfolioImages[i] ?? placeholderAssetSources.heroImage) ??
    placeholderAssetSources.heroImage
  );

  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text)]" style={themeVars}>
      <NavBar template={template} />
      <HeroSection template={template} heroImageSrc={heroImageSrc} heroVideoSrc={heroVideoSrc} />
      <FeaturesSection template={template} />
      <ShowcaseSection template={template} portfolioImageSources={portfolioImageSources} heroImageSrc={heroImageSrc} />
      <TestimonialsSection template={template} />
      <CTASection template={template} />
      <Footer template={template} />
    </main>
  );
}
