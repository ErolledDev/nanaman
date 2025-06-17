import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEO Redirection System',
  description: 'A powerful SEO redirection and content management system',
  keywords: 'SEO, redirection, content management, blog, website',
  authors: [{ name: 'thisisio' }],
  creator: 'thisisio',
  publisher: 'thisisio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'thisisio',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}