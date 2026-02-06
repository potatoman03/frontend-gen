import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/components/providers/MotionProvider';

import './globals.css';

const primaryFont = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  variable: '--font-primary'
});

export const metadata: Metadata = {
  title: 'Landing Page',
  description: 'Generated landing page'
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={primaryFont.variable}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
