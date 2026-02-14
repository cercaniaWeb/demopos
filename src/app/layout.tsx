import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import RootInitializer from '@/components/templates/RootInitializer';
import NotificationToast from '@/components/notifications/NotificationToast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AURA',
  description: 'Sistema de Punto de Venta Inteligente',
  icons: {
    icon: '/iconoapp.png',
    apple: '/iconoapp.png',
  },
  manifest: '/manifest.json',
};

import ThemeProvider from '@/components/providers/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">

      <body className={inter.className}>
        <RootInitializer>
          <ThemeProvider>
            {children}
            <NotificationToast />
          </ThemeProvider>
        </RootInitializer>
        <Analytics />
      </body>
    </html >
  );
}