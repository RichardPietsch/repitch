import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repitch',
  description: 'Anonymous pitch feedback setup'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
