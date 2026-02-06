'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { MoodBoardOption } from '@/lib/template-config';

import { MoodBoardHeroSection } from './MoodBoardHeroSection';

type MoodBoardGalleryProps = {
  options: MoodBoardOption[];
  initialSelectedId: string | null;
};

export function MoodBoardGallery({ options, initialSelectedId }: MoodBoardGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [isPending, setIsPending] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(initialSelectedId !== null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    for (const option of options) {
      const { font } = option.designLanguage;
      const url = `https://fonts.googleapis.com/css2?family=${font.googleFontsId}:wght@${font.weights.join(';')}&display=swap`;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      links.push(link);
    }
    return () => {
      for (const link of links) {
        link.remove();
      }
    };
  }, [options]);

  async function handleSelect(optionId: string) {
    if (isPending) return;

    setSelectedId(optionId);
    setIsPending(true);

    try {
      const res = await fetch('/api/mood-boards/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Selection failed:', data.error);
        setIsPending(false);
        return;
      }

      setIsConfirmed(true);
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Selection failed:', err);
    } finally {
      setIsPending(false);
    }
  }

  function handleChangeSelection() {
    setIsConfirmed(false);
    setSelectedId(null);
  }

  const selectedOption = options.find((o) => o.id === selectedId);

  return (
    <div ref={topRef}>
      {/* Sticky nav dots */}
      <nav className="sticky top-0 z-20 flex items-center justify-center gap-3 bg-[#0a0a0a]/80 px-4 py-3 backdrop-blur-sm">
        {options.map((option, i) => (
          <a
            key={option.id}
            href={`#mood-${option.id}`}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: selectedId === option.id ? option.designLanguage.theme.accentPrimary : 'rgba(255,255,255,0.06)',
              color: selectedId === option.id ? option.designLanguage.theme.pageBackground : 'rgba(255,255,255,0.5)',
            }}
          >
            <span className="font-bold">{i + 1}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </a>
        ))}
      </nav>

      {/* Confirmation banner */}
      <AnimatePresence>
        {isConfirmed && selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="sticky top-12 z-20 mx-auto mt-4 flex max-w-4xl items-center justify-between rounded-xl border px-5 py-4"
            style={{
              background: `${selectedOption.designLanguage.theme.pageBackground}ee`,
              borderColor: `${selectedOption.designLanguage.theme.accentPrimary}30`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: selectedOption.designLanguage.theme.accentPrimary }}
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7.5L5.5 10.5L11.5 3.5"
                    stroke={selectedOption.designLanguage.theme.pageBackground}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white/90">
                  <strong>{selectedOption.label}</strong> selected
                </p>
                <p className="text-sm text-white/50">
                  Saved to mood-board-options.json. Continue in the CLI to generate assets.
                </p>
              </div>
            </div>
            <button
              onClick={handleChangeSelection}
              className="shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white/90"
            >
              Change Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full hero sections */}
      <div className="mt-6 space-y-0">
        {options.map((option, i) => (
          <div key={option.id} id={`mood-${option.id}`} className="scroll-mt-14">
            <MoodBoardHeroSection
              option={option}
              index={i}
              isSelected={selectedId === option.id}
              isDimmed={isConfirmed && selectedId !== option.id}
              onSelect={handleSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
