'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

import { cn } from '@/lib/utils';

type CounterAnimationProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function CounterAnimation({ value, prefix, suffix, className }: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
