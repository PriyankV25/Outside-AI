import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OUTSIDE — Get Off Screens & Into the Living World',
  description:
    'A privacy-first web app that uses Groq AI to craft personalized outdoor exploration missions based on geofencing, time, and sensory mindfulness. Zero database. Zero tracking. 100% real world.',
  keywords: [
    'screen-free',
    'outdoor exploration',
    'mindfulness walk',
    'digital detox',
    'groq api',
    'privacy-first',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
