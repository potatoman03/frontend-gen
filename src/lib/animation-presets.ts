import type { Variants } from 'framer-motion';

const baseTransition = {
  duration: 0.65,
  ease: [0.2, 0.65, 0.2, 1]
} as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: baseTransition }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: baseTransition }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: baseTransition }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: baseTransition }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: baseTransition }
};

export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren
    }
  }
});

export const shimmer: Variants = {
  hidden: { backgroundPosition: '200% 0%' },
  visible: {
    backgroundPosition: '-200% 0%',
    transition: {
      duration: 2.4,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'linear'
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.2, 1] } }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.2, 1] } }
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.2, 0.65, 0.2, 1] } }
};
