'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import type { MoodBoardOption } from '@/lib/template-config';

type MoodBoardHeroSectionProps = {
  option: MoodBoardOption;
  index: number;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (id: string) => void;
};

const RADIUS_MAP: Record<string, string> = {
  sharp: '0px',
  subtle: '6px',
  rounded: '12px',
  pill: '9999px',
};

const MOTION_LABELS: Record<string, string> = {
  minimal: 'Minimal motion',
  moderate: 'Moderate motion',
  expressive: 'Expressive motion',
};

const SPACING_LABELS: Record<string, string> = {
  compact: 'Compact spacing',
  balanced: 'Balanced spacing',
  airy: 'Airy spacing',
};

export function MoodBoardHeroSection({
  option,
  index,
  isSelected,
  isDimmed,
  onSelect,
}: MoodBoardHeroSectionProps) {
  const { designLanguage, moodBoardImage } = option;
  const theme = designLanguage.theme;
  const hasImage = moodBoardImage.status === 'generated' && moodBoardImage.path;

  return (
    <section
      className="relative w-full transition-opacity duration-300"
      style={{
        background: theme.pageBackground,
        opacity: isDimmed ? 0.45 : 1,
      }}
    >
      {/* Option number label */}
      <div
        className="absolute left-6 top-6 z-10 flex h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold uppercase tracking-widest"
        style={{
          background: `${theme.accentPrimary}18`,
          color: theme.accentPrimary,
        }}
      >
        Option {index + 1}
      </div>

      {/* Selected badge */}
      {isSelected && (
        <div
          className="absolute right-6 top-6 z-10 flex h-8 items-center gap-2 rounded-full px-4 text-sm font-medium"
          style={{
            background: theme.accentPrimary,
            color: theme.pageBackground,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7.5L5.5 10.5L11.5 3.5"
              stroke={theme.pageBackground}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Selected
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2" style={{ minHeight: '80dvh' }}>
        {/* Left: Hero image / placeholder */}
        <div className="relative flex items-center justify-center overflow-hidden p-8 lg:p-12">
          <div
            className="relative aspect-[4/3] w-full max-w-xl overflow-hidden"
            style={{
              borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '8px',
              border: `1px solid ${theme.border}`,
            }}
          >
            {hasImage ? (
              <Image
                src={moodBoardImage.path!}
                alt={`${option.label} mood board`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center gap-3"
                style={{ background: theme.surface }}
              >
                {/* Placeholder visual — color grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    theme.accentPrimary,
                    theme.accentSecondary,
                    theme.accentTertiary,
                    theme.surface,
                    theme.text,
                    theme.textMuted,
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded"
                      style={{
                        background: color,
                        borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '4px',
                        border: `1px solid ${theme.border}`,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: theme.textMuted }}>
                  Mood board image will appear here after generation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Content & explanation */}
        <div className="flex flex-col justify-center gap-8 p-8 lg:p-12">
          {/* Title & tone */}
          <div>
            <h2
              className="text-4xl font-bold tracking-tight lg:text-5xl"
              style={{ color: theme.text, textWrap: 'balance' }}
            >
              {option.label}
            </h2>
            <p
              className="mt-2 text-lg font-medium"
              style={{ color: theme.accentPrimary }}
            >
              {designLanguage.tone}
            </p>
          </div>

          {/* Description */}
          <p
            className="max-w-lg text-base leading-relaxed lg:text-lg"
            style={{ color: theme.textMuted, textWrap: 'pretty' }}
          >
            {designLanguage.description}
          </p>

          {/* Design specs grid */}
          <div className="grid grid-cols-2 gap-4">
            <SpecCard
              label="Typography"
              value={designLanguage.font.family}
              detail={`Weights: ${designLanguage.font.weights.join(', ')}`}
              theme={theme}
              preview={
                <span
                  className="text-sm font-semibold"
                  style={{
                    fontFamily: designLanguage.font.family,
                    fontWeight: Math.max(...designLanguage.font.weights),
                    color: theme.text,
                  }}
                >
                  {designLanguage.font.family}
                </span>
              }
              customDetail={
                <span className="flex flex-wrap gap-1 mt-0.5">
                  {designLanguage.font.weights.map((w) => (
                    <span
                      key={w}
                      className="text-xs"
                      style={{
                        fontFamily: designLanguage.font.family,
                        fontWeight: w,
                        color: theme.textMuted,
                      }}
                    >
                      {w <= 300 ? 'Light' : w <= 400 ? 'Regular' : w <= 500 ? 'Medium' : w <= 600 ? 'Semibold' : 'Bold'}
                      {designLanguage.font.weights.indexOf(w) < designLanguage.font.weights.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </span>
              }
            />
            <SpecCard
              label="Motion"
              value={MOTION_LABELS[designLanguage.motionIntensity] ?? designLanguage.motionIntensity}
              detail="Animation intensity"
              theme={theme}
            />
            <SpecCard
              label="Corners"
              value={`${designLanguage.borderRadiusStyle.charAt(0).toUpperCase()}${designLanguage.borderRadiusStyle.slice(1)}`}
              detail={RADIUS_MAP[designLanguage.borderRadiusStyle] ?? 'default'}
              theme={theme}
              preview={
                <span
                  className="inline-block h-4 w-4 border-2"
                  style={{
                    borderColor: theme.accentPrimary,
                    borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '4px',
                  }}
                />
              }
            />
            <SpecCard
              label="Density"
              value={SPACING_LABELS[designLanguage.spacingDensity] ?? designLanguage.spacingDensity}
              detail="Layout spacing"
              theme={theme}
            />
          </div>

          {/* Color palette */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Color Palette
            </p>
            <div className="flex gap-2">
              {[
                { color: theme.pageBackground, name: 'Background' },
                { color: theme.surface, name: 'Surface' },
                { color: theme.accentPrimary, name: 'Primary' },
                { color: theme.accentSecondary, name: 'Secondary' },
                { color: theme.accentTertiary, name: 'Tertiary' },
                { color: theme.text, name: 'Text' },
              ].map((swatch, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="h-8 w-8 border"
                    style={{
                      background: swatch.color,
                      borderColor: theme.border,
                      borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '4px',
                    }}
                    title={`${swatch.name}: ${swatch.color}`}
                  />
                  <span className="text-[10px]" style={{ color: theme.textMuted }}>
                    {swatch.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography preview */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Typography
            </p>
            <div
              className="space-y-5 rounded-lg p-5"
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Headline sample */}
              <h3
                className="text-4xl lg:text-5xl"
                style={{
                  fontFamily: designLanguage.font.family,
                  fontWeight: Math.max(...designLanguage.font.weights),
                  color: theme.text,
                  textWrap: 'balance',
                }}
              >
                The quick brown fox
              </h3>

              {/* Body text sample */}
              <p
                className="max-w-lg text-base lg:text-lg"
                style={{
                  fontFamily: designLanguage.font.family,
                  fontWeight: Math.min(...designLanguage.font.weights),
                  color: theme.textMuted,
                  textWrap: 'pretty',
                  lineHeight: 1.65,
                }}
              >
                Typography is the craft of endowing human language with a durable visual form. It shapes the way we read, the way we feel, and the way we understand.
              </p>

              {/* Weight showcase */}
              <div className="flex flex-wrap gap-4">
                {designLanguage.font.weights.map((w) => (
                  <div key={w} className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.textMuted }}>
                      {w}
                    </span>
                    <span
                      className="text-base"
                      style={{
                        fontFamily: designLanguage.font.family,
                        fontWeight: w,
                        color: theme.text,
                      }}
                    >
                      {designLanguage.font.family}
                    </span>
                  </div>
                ))}
              </div>

              {/* Letter-spacing preview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    Tight
                  </span>
                  <p
                    className="mt-1 text-xl"
                    style={{
                      fontFamily: designLanguage.font.family,
                      fontWeight: Math.max(...designLanguage.font.weights),
                      letterSpacing: '-0.02em',
                      color: theme.text,
                    }}
                  >
                    Elegance
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.textMuted }}>
                    Wide
                  </span>
                  <p
                    className="mt-1 text-xl"
                    style={{
                      fontFamily: designLanguage.font.family,
                      fontWeight: Math.max(...designLanguage.font.weights),
                      letterSpacing: '0.08em',
                      color: theme.text,
                    }}
                  >
                    Elegance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Preview */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Page Preview
            </p>
            <div
              className="overflow-hidden rounded-lg border"
              style={{
                background: theme.pageBackground,
                borderColor: theme.border,
                borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '8px',
              }}
            >
              {/* Mini hero */}
              <div
                className="relative flex flex-col items-center justify-center px-6 py-10 text-center"
                style={{ background: theme.surface }}
              >
                {/* Wordmark */}
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{
                    color: theme.accentPrimary,
                    fontFamily: designLanguage.font.family,
                  }}
                >
                  Brand
                </p>
                {/* Headline */}
                <h3
                  className="mt-4 text-2xl font-light tracking-tight lg:text-3xl"
                  style={{
                    color: theme.text,
                    fontFamily: designLanguage.font.family,
                    fontWeight: Math.min(...designLanguage.font.weights),
                    textWrap: 'balance',
                  }}
                >
                  Design that speaks
                </h3>
                {/* Subheadline */}
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: theme.textMuted,
                    fontFamily: designLanguage.font.family,
                    textWrap: 'pretty',
                  }}
                >
                  Crafted with precision and care
                </p>
                {/* CTA button */}
                <button
                  className="mt-5 px-5 py-2 text-xs font-semibold"
                  style={{
                    background: theme.accentPrimary,
                    color: theme.pageBackground,
                    borderRadius: designLanguage.borderRadiusStyle === 'pill' ? '9999px' :
                                  designLanguage.borderRadiusStyle === 'rounded' ? '8px' :
                                  designLanguage.borderRadiusStyle === 'subtle' ? '4px' : '0px',
                    fontFamily: designLanguage.font.family,
                  }}
                >
                  Get Started
                </button>
              </div>
              {/* Mini content area */}
              <div className="grid grid-cols-3 gap-2 p-4">
                {[theme.accentPrimary, theme.accentSecondary, theme.accentTertiary].map((color, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded"
                    style={{
                      background: `${color}20`,
                      borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '4px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sample prompts preview */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Asset Generation Preview
            </p>
            <div className="space-y-2">
              <PromptPreview label="Hero Image" prompt={option.samplePrompts.recraft.heroImage} theme={theme} />
              <PromptPreview label="Hero Video" prompt={option.samplePrompts.runway.heroVideo} theme={theme} />
              <PromptPreview label="Logo" prompt={option.samplePrompts.recraft.logo} theme={theme} />
            </div>
          </div>

          {/* Select button */}
          <div>
            <motion.button
              onClick={() => onSelect(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold transition-colors"
              style={{
                background: isSelected ? theme.accentPrimary : 'transparent',
                color: isSelected ? theme.pageBackground : theme.accentPrimary,
                border: `2px solid ${theme.accentPrimary}`,
                borderRadius: designLanguage.borderRadiusStyle === 'pill' ? '9999px' : '8px',
              }}
            >
              {isSelected ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      stroke={theme.pageBackground}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Selected
                </>
              ) : (
                'Choose This Direction'
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div style={{ borderBottom: `1px solid ${theme.border}` }} />
      </div>
    </section>
  );
}

function SpecCard({
  label,
  value,
  detail,
  theme,
  preview,
  customDetail,
}: {
  label: string;
  value: string;
  detail: string;
  theme: MoodBoardOption['designLanguage']['theme'];
  preview?: React.ReactNode;
  customDetail?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: `${theme.accentPrimary}08`,
        border: `1px solid ${theme.border}`,
      }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {preview ?? (
          <span className="text-sm font-semibold" style={{ color: theme.text }}>
            {value}
          </span>
        )}
      </div>
      {customDetail ?? (
        <p className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
          {detail}
        </p>
      )}
    </div>
  );
}

function PromptPreview({
  label,
  prompt,
  theme,
}: {
  label: string;
  prompt: string;
  theme: MoodBoardOption['designLanguage']['theme'];
}) {
  return (
    <div
      className="rounded-md px-3 py-2"
      style={{
        background: `${theme.accentPrimary}08`,
        border: `1px solid ${theme.border}`,
      }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.accentPrimary }}>
        {label}
      </span>
      <p className="mt-0.5 text-xs leading-relaxed" style={{ color: theme.textMuted, textWrap: 'pretty' }}>
        {prompt}
      </p>
    </div>
  );
}
