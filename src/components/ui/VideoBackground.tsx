'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

type VideoBackgroundProps = {
  videoSrc: string | null;
  fallbackImageSrc?: string | null;
  className?: string;
  overlayClassName?: string;
  overlayOpacity?: number;
};

export function VideoBackground({
  videoSrc,
  fallbackImageSrc,
  className,
  overlayClassName,
  overlayOpacity = 0.45
}: VideoBackgroundProps) {
  const hasVideo = useMemo(() => Boolean(videoSrc), [videoSrc]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <AnimatePresence mode="wait">
        {hasVideo && videoSrc ? (
          <motion.video
            key={videoSrc}
            className="h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            playsInline
            muted
            loop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        ) : (
          <motion.div
            key={fallbackImageSrc ?? 'fallback'}
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {fallbackImageSrc ? (
              <Image src={fallbackImageSrc} alt="" fill unoptimized className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(50,200,255,0.35),transparent_52%),radial-gradient(circle_at_80%_80%,rgba(35,227,168,0.3),transparent_45%),#060a18]" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn('absolute inset-0 bg-[#050814]', overlayClassName)}
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
