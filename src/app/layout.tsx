import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ENXO — Official Merch Store',
  description: 'Official merchandise store for Enxo. Limited drops. No restocks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black antialiased">
        {children}
      </body>
    </html>
  );
}
