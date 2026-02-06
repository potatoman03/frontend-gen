'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type GradientBlobProps = {
  className?: string;
  colorA?: string;
  colorB?: string;
  duration?: number;
};

export function GradientBlob({
  className,
  colorA = 'var(--accent-primary)',
  colorB = 'var(--accent-tertiary)',
  duration = 18
}: GradientBlobProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute rounded-full blur-3xl', className)}>
      <motion.div
        className="h-full w-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${colorA}, ${colorB})`
        }}
        animate={{
          scale: [1, 1.16, 0.94, 1],
          rotate: [0, 60, 120, 180],
          x: [0, 20, -18, 0],
          y: [0, -18, 10, 0]
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
      />
    </div>
  );
}
