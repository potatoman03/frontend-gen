'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type AnimatedTextProps = {
  text: string;
  mode?: 'word' | 'letter';
  className?: string;
  delay?: number;
};

export function AnimatedText({ text, mode = 'word', className, delay = 0 }: AnimatedTextProps) {
  const tokens = mode === 'letter' ? Array.from(text) : text.split(' ');

  return (
    <span className={cn('inline-flex flex-wrap', className)}>
      {tokens.map((token, index) => {
        const displayValue = mode === 'word' ? `${token}\u00A0` : token;

        return (
          <motion.span
            key={`${token}-${index}`}
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: delay + index * (mode === 'word' ? 0.04 : 0.015),
              duration: 0.45,
              ease: [0.2, 0.65, 0.2, 1]
            }}
          >
            {displayValue}
          </motion.span>
        );
      })}
    </span>
  );
}
