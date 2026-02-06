export type ThemeConfig = {
  pageBackground: string;
  surface: string;
  text: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  border: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type FeatureItem = {
  id: 'wallet' | 'shield' | 'rocket';
  title: string;
  description: string;
};

export type ShowcaseStat = {
  label: string;
  value: string;
};

export type ShowcaseCard = {
  title: string;
  description: string;
};

export type PortfolioItem = {
  title: string;
  description: string;
  imageIndex: number;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type TemplateConfig = {
  brandName: string;
  nav: NavItem[];
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  showcase: {
    title: string;
    subtitle: string;
    stats: ShowcaseStat[];
    cards: ShowcaseCard[];
  };
  testimonials: {
    title: string;
    items: Testimonial[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    items: PortfolioItem[];
  };
  footer: {
    text: string;
    links: NavItem[];
  };
  theme: ThemeConfig;
};

export type ProviderName = 'local' | 'recraft' | 'runway';

export type AssetEntry = {
  path: string | null;
  provider: ProviderName;
  status: 'placeholder' | 'generated' | 'failed';
  prompt?: string;
  error?: string;
};

export type AssetManifest = {
  brief: string;
  generatedAt: string;
  assets: {
    logo: AssetEntry;
    heroImage: AssetEntry;
    featureIcons: {
      wallet: AssetEntry;
      shield: AssetEntry;
      rocket: AssetEntry;
    };
    portfolioImages: AssetEntry[];
    scrollSequenceImages: AssetEntry[];
    threeD?: AssetEntry;
    heroVideo: AssetEntry;
    showcaseVideo: AssetEntry;
  };
};

export type GenerationConfig = {
  brief: string;
  template: TemplateConfig;
  prompts: {
    recraft: {
      logo: string;
      heroImage: string;
      featureIcons: {
        wallet: string;
        shield: string;
        rocket: string;
      };
      portfolioImages?: string[];
      scrollSequenceImages?: string[];
    };
    runway: {
      heroVideo: string;
      showcaseVideo: string;
    };
  };
};

export type DesignLanguageSpec = {
  name: string;
  description: string;
  tone: string;
  font: {
    family: string;
    googleFontsId: string;
    weights: number[];
  };
  theme: ThemeConfig;
  motionIntensity: 'minimal' | 'moderate' | 'expressive';
  borderRadiusStyle: 'sharp' | 'subtle' | 'rounded' | 'pill';
  spacingDensity: 'compact' | 'balanced' | 'airy';
};

export type MoodBoardOption = {
  id: string;
  label: string;
  designLanguage: DesignLanguageSpec;
  moodBoardImage: {
    prompt: string;
    path: string | null;
    status: 'pending' | 'generated' | 'failed';
    error?: string;
  };
  samplePrompts: {
    recraft: {
      heroImage: string;
      logo: string;
    };
    runway: {
      heroVideo: string;
    };
  };
};

export type MoodBoardConfig = {
  brief: string;
  generatedAt: string;
  options: MoodBoardOption[];
  selectedOptionId: string | null;
};
