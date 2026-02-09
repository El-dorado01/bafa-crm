import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
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
      className={hankenGrotesk.variable}
    >
      <body className='antialiased'>{children}</body>
    </html>
  );
}
