import '@/styles/globals.css';
import 'react-photo-view/dist/react-photo-view.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import ClientProvider from './client-provider';

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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          'min-h-screen text-foreground bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <ClientProvider
          themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
        >
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
              {children}
            </main>
          </div>
        </ClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
