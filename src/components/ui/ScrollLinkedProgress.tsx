'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { cn } from '@/lib/utils';

type ScrollLinkedProgressProps = {
  className?: string;
  color?: string;
};

export function ScrollLinkedProgress({
  className,
  color = 'var(--accent-primary)'
}: ScrollLinkedProgressProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const scaleX = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <motion.div
        className="h-0.5 w-full"
        style={{
          scaleX,
          transformOrigin: 'left',
          backgroundColor: color
        }}
      />
    </div>
  );
}
