// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/admin/SplashScreen';

export default function HomePage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Vérifier si le splash a déjà été vu
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
      router.push('/auth/login');
    }

    // Écouter l'événement de complétion du splash
    const handleSplashComplete = () => {
      setShowSplash(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
      router.push('/auth/login');
    };

    window.addEventListener('splashComplete', handleSplashComplete);
    
    return () => {
      window.removeEventListener('splashComplete', handleSplashComplete);
    };
  }, [router]);

  if (showSplash) {
    return <SplashScreen duration={10000} />;
  }

  return null;
}