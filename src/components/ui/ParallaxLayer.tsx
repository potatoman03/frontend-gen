'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

type ParallaxLayerProps = {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
};

export function ParallaxLayer({ children, className, from = -40, to = 40 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div ref={ref} className={cn(className)} style={{ y }}>
      {children}
    </motion.div>
  );
}
