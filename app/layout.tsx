
import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Project Ledger Pro | Akij Venture Ltd',
  description: 'Corporate Project Management and Audit System',
};

// @google/genai: Fixed "Cannot find namespace 'React'" error by importing React
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
