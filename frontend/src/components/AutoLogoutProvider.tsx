// components/AutoLogoutProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  timeout?: number; // default to 5 minutes
}

const AutoLogoutProvider = ({ children, timeout = 30 * 60 * 1000 }: Props) => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    // Clear tokens or session data
    localStorage.clear();
    // Redirect to login
    router.push('/auth/login');
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeout);
  };

  const events = ['mousemove', 'keydown', 'click', 'scroll'];

  useEffect(() => {
    resetTimer();

    const handleActivity = () => resetTimer();
    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return <>{children}</>;
};

export default AutoLogoutProvider;
