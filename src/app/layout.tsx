import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Saturn 3D Precision Manufacturing | Industrial 3D Printing & Rapid Prototyping',
  description: 'Industrial-grade 3D printing and precision rapid prototyping facility based in Bhopal, MP, India. Instant CAD quotes, engineering materials, and low-volume serial manufacturing.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink font-body selection:bg-saturn-orange selection:text-ink antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
