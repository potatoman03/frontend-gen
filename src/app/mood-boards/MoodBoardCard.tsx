'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import type { MoodBoardOption } from '@/lib/template-config';

type MoodBoardCardProps = {
  option: MoodBoardOption;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (id: string) => void;
};

const RADIUS_MAP: Record<string, string> = {
  sharp: '0px',
  subtle: '6px',
  rounded: '12px',
  pill: '9999px'
};

const MOTION_LABELS: Record<string, string> = {
  minimal: 'Minimal motion',
  moderate: 'Moderate motion',
  expressive: 'Expressive motion'
};

export function MoodBoardCard({ option, isSelected, isDimmed, onSelect }: MoodBoardCardProps) {
  const { designLanguage, moodBoardImage } = option;
  const theme = designLanguage.theme;
  const hasImage = moodBoardImage.status === 'generated' && moodBoardImage.path;

  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative w-full cursor-pointer text-left"
      style={{
        opacity: isDimmed ? 0.4 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div
        className="overflow-hidden rounded-xl border-2 transition-colors duration-200"
        style={{
          background: theme.surface,
          borderColor: isSelected ? theme.accentPrimary : theme.border
        }}
      >
        {/* Selected checkmark */}
        {isSelected && (
          <div
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: theme.accentPrimary }}
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
          </div>
        )}

        {/* Mood board image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: theme.pageBackground }}>
          {hasImage ? (
            <Image
              src={moodBoardImage.path!}
              alt={`${option.label} mood board`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ color: theme.textMuted }}>
              <span className="text-sm">No image generated</span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="space-y-3 p-4">
          {/* Name + tone */}
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.text, textWrap: 'balance' }}
            >
              {option.label}
            </h3>
            <p className="mt-0.5 text-sm" style={{ color: theme.textMuted, textWrap: 'pretty' }}>
              {designLanguage.tone}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: theme.textMuted, textWrap: 'pretty' }}>
            {designLanguage.description}
          </p>

          {/* Font preview */}
          <p
            className="text-lg"
            style={{
              fontFamily: designLanguage.font.family,
              fontWeight: Math.max(...designLanguage.font.weights),
              color: theme.text,
            }}
          >
            {option.label}
          </p>

          {/* Color swatches */}
          <div className="flex gap-1.5">
            {[
              theme.pageBackground,
              theme.surface,
              theme.accentPrimary,
              theme.accentSecondary,
              theme.accentTertiary,
              theme.text
            ].map((color, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full border border-white/10"
                style={{ background: color }}
                title={color}
              />
            ))}
          </div>

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-1.5">
            <Pill label={designLanguage.font.family} theme={theme} />
            <Pill label={MOTION_LABELS[designLanguage.motionIntensity] ?? designLanguage.motionIntensity} theme={theme} />
            <Pill
              label={`${designLanguage.borderRadiusStyle} corners`}
              theme={theme}
              preview={
                <span
                  className="inline-block h-3 w-3 border"
                  style={{
                    borderColor: theme.accentPrimary,
                    borderRadius: RADIUS_MAP[designLanguage.borderRadiusStyle] ?? '4px'
                  }}
                />
              }
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function Pill({
  label,
  theme,
  preview
}: {
  label: string;
  theme: MoodBoardOption['designLanguage']['theme'];
  preview?: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
      style={{
        background: `${theme.accentPrimary}15`,
        color: theme.accentPrimary
      }}
    >
      {preview}
      {label}
    </span>
  );
}
