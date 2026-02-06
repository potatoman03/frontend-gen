'use client';

import Lottie from 'lottie-react';

import { cn } from '@/lib/utils';

type LottiePlayerProps = {
  animationData?: Record<string, unknown>;
  className?: string;
  loop?: boolean;
};

export function LottiePlayer({ animationData, className, loop = true }: LottiePlayerProps) {
  const hasRenderableData = Boolean(
    animationData &&
      Array.isArray(animationData.layers) &&
      (animationData.layers as unknown[]).length > 0
  );

  if (!hasRenderableData) {
    return (
      <div className={cn('relative h-14 w-14', className)} aria-hidden>
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-primary)]" />
        <span className="absolute left-1/2 top-1/2 h-12 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 animate-[pulse_1.6s_ease-in-out_infinite]" />
      </div>
    );
  }

  return (
    <div className={cn('h-14 w-14', className)}>
      <Lottie animationData={animationData} loop={loop} />
    </div>
  );
}
