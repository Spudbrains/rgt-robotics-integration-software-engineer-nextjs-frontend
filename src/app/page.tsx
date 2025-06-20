'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Use a flag to prevent navigation if component unmounts
    let isMounted = true;
    
    const redirect = () => {
      if (isMounted) {
        router.push('/books');
      }
    };

    // Small delay to show loading state
    const timer = setTimeout(redirect, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to bookstore...</p>
      </div>
    </div>
  );
}
