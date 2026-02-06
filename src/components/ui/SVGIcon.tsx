import Image from 'next/image';

import { cn } from '@/lib/utils';

type SVGIconProps = {
  src: string;
  alt: string;
  className?: string;
  size?: number;
  priority?: boolean;
};

export function SVGIcon({ src, alt, className, size = 64, priority = false }: SVGIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn('h-auto w-auto max-w-full', className)}
    />
  );
}
