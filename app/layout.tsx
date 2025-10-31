import '@/styles/globals.css';

import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';

import { Providers } from './providers';

import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl p-6 pb-0 flex-grow overflow-hidden">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                className="flex items-center gap-1 text-current"
                href={process.env.AUTHOR_PROFILE!}
                target="_blank"
                title={`Go to ${process.env.AUTHOR_NAME!}'s profile`}
              >
                <p className="flex items-center justify-center text-default-500 text-sm gap-1">
                  <Icon height={16} icon="mdi:copyright" width={16} />
                  {new Date().getFullYear()}
                  <span className="text-primary font-semibold hover:text-primary-500 transition-colors">
                    {process.env.AUTHOR_NAME!}
                  </span>
                </p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
