import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'BAFA CRM - Funding Advisor Management',
  description: 'Streamlined client and project management for BAFA funding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={`${quicksand.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Toaster
          position='top-right'
          richColors
          expand
        />
        {children}
      </body>
    </html>
  );
}
