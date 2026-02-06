'use client';

import { useScroll, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

type ScrollPinnedRevealProps = {
  pinHeight?: number;
  children: (progress: MotionValue<number>) => ReactNode;
  className?: string;
};

export function ScrollPinnedReveal({
  pinHeight = 3,
  children,
  className
}: ScrollPinnedRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={ref} className={cn(className)} style={{ height: `${pinHeight * 100}dvh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
