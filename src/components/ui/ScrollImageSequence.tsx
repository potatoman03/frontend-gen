'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

type ScrollImageSequenceProps = {
  images: string[];
  captions?: string[];
  className?: string;
  overlay?: boolean;
};

function SequenceImage({
  src,
  caption,
  index,
  activeIndex
}: {
  src: string;
  caption?: string;
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  const opacity = useTransform(activeIndex, (v) => 1 - Math.min(Math.abs(v - index), 1));

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <Image src={src} alt={caption ?? ''} fill unoptimized className="object-cover" />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center p-8">
          <p className="max-w-2xl text-center text-lg font-medium text-white text-pretty">
            {caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export function ScrollImageSequence({
  images,
  captions,
  className,
  overlay = false
}: ScrollImageSequenceProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, images.length - 1]);

  return (
    <div ref={ref} className={cn(className)} style={{ height: `${images.length * 100}dvh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="relative h-full w-full">
          {images.map((src, i) => (
            <SequenceImage
              key={src}
              src={src}
              caption={captions?.[i]}
              index={i}
              activeIndex={activeIndex}
            />
          ))}
          {overlay && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}
