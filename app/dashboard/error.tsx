'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/ui/error-display';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Dashboard error caught by boundary:', error);
  }, [error]);

  return (
    <div className='flex-1 min-h-[calc(100vh-10rem)] flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-[2rem] border border-border/10 shadow-inner m-4 md:m-8'>
      <ErrorDisplay
        error={error}
        reset={reset}
      />
    </div>
  );
}
