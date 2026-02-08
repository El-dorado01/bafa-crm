import type { Metadata } from 'next';
import { Habibi, Shadows_Into_Light } from 'next/font/google';
import './globals.css';

const habibi = Habibi({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-habibi',
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shadows-into-light',
});

export const metadata: Metadata = {
  title: 'BAFA CRM - Project Management Platform',
  description: 'BAFA-funded consulting project management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={shadowsIntoLight.variable}
    >
      <body className='antialiased'>{children}</body>
    </html>
  );
}
