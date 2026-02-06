import heroGradient from '@/assets/placeholders/hero-gradient.svg';
import walletIcon from '@/assets/placeholders/icon-wallet.svg';
import shieldIcon from '@/assets/placeholders/icon-shield.svg';
import rocketIcon from '@/assets/placeholders/icon-rocket.svg';
import logoNova from '@/assets/placeholders/logo-nova.svg';
import type { AssetManifest, TemplateConfig } from '@/lib/template-config';

export const placeholderAssetSources = {
  logo: logoNova.src,
  heroImage: heroGradient.src,
  featureIcons: {
    wallet: walletIcon.src,
    shield: shieldIcon.src,
    rocket: rocketIcon.src
  },
  portfolioImages: [heroGradient.src, heroGradient.src, heroGradient.src],
  scrollSequenceImages: [heroGradient.src, heroGradient.src, heroGradient.src]
};

export const defaultTemplateConfig: TemplateConfig = {
  brandName: 'BRAND',
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#cta' }
  ],
  hero: {
    eyebrow: 'Welcome to the future',
    headline: 'Something extraordinary is coming.',
    subheadline: 'A brief description of the product or service that captures attention and communicates value in a single sentence.',
    primaryCta: 'Get Started',
    secondaryCta: 'Learn More'
  },
  features: {
    title: 'Features',
    subtitle: 'What makes this different.',
    items: [
      {
        id: 'wallet',
        title: 'Feature One',
        description: 'A short description of the first key feature and why it matters to the user.'
      },
      {
        id: 'shield',
        title: 'Feature Two',
        description: 'A short description of the second key feature and why it matters to the user.'
      },
      {
        id: 'rocket',
        title: 'Feature Three',
        description: 'A short description of the third key feature and why it matters to the user.'
      }
    ]
  },
  showcase: {
    title: 'Showcase',
    subtitle: 'See what we have built.',
    stats: [
      { label: 'Metric One', value: '1000' },
      { label: 'Metric Two', value: '50' },
      { label: 'Metric Three', value: '99' }
    ],
    cards: [
      { title: 'Project Alpha', description: 'A brief description of the first showcase item.' },
      { title: 'Project Beta', description: 'A brief description of the second showcase item.' },
      { title: 'Project Gamma', description: 'A brief description of the third showcase item.' }
    ]
  },
  testimonials: {
    title: 'What people say',
    items: [
      { quote: 'A testimonial quote from a satisfied user or partner.', name: 'Person One', role: 'Role, Company' },
      { quote: 'Another testimonial quote highlighting a different aspect.', name: 'Person Two', role: 'Role, Company' },
      { quote: 'A third testimonial to provide social proof and credibility.', name: 'Person Three', role: 'Role, Company' }
    ]
  },
  portfolio: {
    title: 'Portfolio',
    subtitle: 'Selected work.',
    items: [
      { title: 'Project Alpha', description: 'A brief description of the first project.', imageIndex: 0 },
      { title: 'Project Beta', description: 'A brief description of the second project.', imageIndex: 1 },
      { title: 'Project Gamma', description: 'A brief description of the third project.', imageIndex: 2 }
    ]
  },
  cta: {
    title: 'Ready to begin?',
    subtitle: 'Join us and be part of something meaningful.',
    buttonText: 'Get Started'
  },
  footer: {
    text: 'BRAND. All rights reserved.',
    links: [
      { label: 'Features', href: '#' },
      { label: 'About', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Contact', href: '#' }
    ]
  },
  theme: {
    pageBackground: '#0a0a0a',
    surface: '#141414',
    text: '#f0f0f0',
    textMuted: '#737373',
    accentPrimary: '#e0e0e0',
    accentSecondary: '#a0a0a0',
    accentTertiary: '#505050',
    border: '#222222'
  }
};

export const placeholderManifest: AssetManifest = {
  brief: 'Default placeholder generation',
  generatedAt: new Date(0).toISOString(),
  assets: {
    logo: {
      path: placeholderAssetSources.logo,
      provider: 'local',
      status: 'placeholder'
    },
    heroImage: {
      path: placeholderAssetSources.heroImage,
      provider: 'local',
      status: 'placeholder'
    },
    featureIcons: {
      wallet: {
        path: placeholderAssetSources.featureIcons.wallet,
        provider: 'local',
        status: 'placeholder'
      },
      shield: {
        path: placeholderAssetSources.featureIcons.shield,
        provider: 'local',
        status: 'placeholder'
      },
      rocket: {
        path: placeholderAssetSources.featureIcons.rocket,
        provider: 'local',
        status: 'placeholder'
      }
    },
    portfolioImages: [
      { path: heroGradient.src, provider: 'local', status: 'placeholder' },
      { path: heroGradient.src, provider: 'local', status: 'placeholder' },
      { path: heroGradient.src, provider: 'local', status: 'placeholder' },
    ],
    scrollSequenceImages: [
      { path: heroGradient.src, provider: 'local', status: 'placeholder' },
      { path: heroGradient.src, provider: 'local', status: 'placeholder' },
      { path: heroGradient.src, provider: 'local', status: 'placeholder' },
    ],
    heroVideo: {
      path: null,
      provider: 'local',
      status: 'placeholder'
    },
    showcaseVideo: {
      path: null,
      provider: 'local',
      status: 'placeholder'
    }
  }
};
