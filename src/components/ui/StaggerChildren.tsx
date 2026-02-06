'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { staggerContainer } from '@/lib/animation-presets';
import { cn } from '@/lib/utils';

type StaggerChildrenProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
};

export function StaggerChildren({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}
