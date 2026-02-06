'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Suspense } from 'react';

import { cn } from '@/lib/utils';

type ThreeDElementProps = {
  modelPath: string;
  fallbackImage: string;
  autoRotate?: boolean;
  scrollLinked?: boolean;
  className?: string;
};

const ThreeDScene = dynamic(() => import('./ThreeDScene'), { ssr: false });

function Fallback({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn('relative h-full w-full', className)}>
      <Image src={src} alt="" fill unoptimized className="object-contain" />
    </div>
  );
}

export function ThreeDElement({
  modelPath,
  fallbackImage,
  autoRotate = true,
  scrollLinked = false,
  className
}: ThreeDElementProps) {
  if (typeof window === 'undefined') {
    return <Fallback src={fallbackImage} className={className} />;
  }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <Suspense fallback={<Fallback src={fallbackImage} />}>
        <ThreeDScene
          modelPath={modelPath}
          fallbackImage={fallbackImage}
          autoRotate={autoRotate}
          scrollLinked={scrollLinked}
        />
      </Suspense>
    </div>
  );
}
