import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Imperium Gate — Ultra Luxury Real Estate',
  description: 'Dubai reimagined. Luxury, Architecture, Legacy.',
  // تحسينات SEO ووسوم Open Graph وTwitter
  openGraph: {
    title: 'Imperium Gate — Ultra Luxury Real Estate',
    description: 'Dubai reimagined. Luxury, Architecture, Legacy.',
    url: 'https://imperium-gate.com',
    siteName: 'Imperium Gate',
    images: [
      {
        url: 'https://imperium-gate.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Imperium Gate - Luxury Real Estate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imperium Gate — Ultra Luxury Real Estate',
    description: 'Dubai reimagined. Luxury, Architecture, Legacy.',
    images: ['https://imperium-gate.com/og-image.jpg'],
    creator: '@imperiumgate',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">{/* إضافة خاصية dir لتحسين التوافق */}
      {/* تحسينات عامة للأداء وSEO */}
      <body className={inter.className}>
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
          {children}
        </div>
      </body>
    </html>
  );
}
