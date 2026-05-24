// src/app/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import SplashScreen from '@/components/admin/SplashScreen';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Vérifier si le splash a déjà été vu
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }

    // Écouter l'événement de complétion du splash
    const handleSplashComplete = () => {
      setShowSplash(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    };

    window.addEventListener('splashComplete', handleSplashComplete);
    
    return () => {
      window.removeEventListener('splashComplete', handleSplashComplete);
    };
  }, []);

  return (
    <html lang="fr">
      <body className={inter.className}>
        {showSplash && <SplashScreen duration={10000} />}
        {!showSplash && children}
      </body>
    </html>
  );
}