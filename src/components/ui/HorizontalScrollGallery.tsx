'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

type GalleryItem = {
  image: string;
  title: string;
  description: string;
};

type HorizontalScrollGalleryProps = {
  items: GalleryItem[];
  className?: string;
};

export function HorizontalScrollGallery({ items, className }: HorizontalScrollGalleryProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${((items.length - 1) * 100) / items.length}%`]
  );

  return (
    <div ref={ref} className={cn('h-[300dvh]', className)}>
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <motion.div className="flex" style={{ x }}>
          {items.map((item) => (
            <div
              key={item.title}
              className="relative min-w-[80vw] md:min-w-[70vw] h-[100dvh] flex-shrink-0"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white text-balance md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-lg text-base text-white/80 text-pretty">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
