'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('better-auth-token');
    const userId = localStorage.getItem('user-id');

    if (!token || !userId) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  // Check authentication status
  const token = localStorage.getItem('better-auth-token');
  const userId = localStorage.getItem('user-id');

  if (!token || !userId) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}