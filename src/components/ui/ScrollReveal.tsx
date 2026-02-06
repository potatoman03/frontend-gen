'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

import { fadeInUp } from '@/lib/animation-presets';
import { cn } from '@/lib/utils';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
  variants?: Variants;
  delay?: number;
};

export function ScrollReveal({
  children,
  className,
  once = true,
  amount = 0.25,
  variants = fadeInUp,
  delay = 0
}: ScrollRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
