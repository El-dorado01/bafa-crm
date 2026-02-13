'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Database as DatabaseIcon } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  const isPrismaError =
    error.message.includes('P1001') ||
    error.message.includes("Can't reach database") ||
    error.message.includes('timeout');

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-in fade-in duration-500'>
      <div className='relative mb-8'>
        <div className='h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xl shadow-red-500/10'>
          {isPrismaError ? (
            <DatabaseIcon className='h-12 w-12' />
          ) : (
            <AlertCircle className='h-12 w-12' />
          )}
        </div>
        <div className='absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-neutral-800 border-4 border-red-50 flex items-center justify-center animate-pulse'>
          <RefreshCw className='h-4 w-4 text-red-500' />
        </div>
      </div>

      <h2 className='text-3xl font-black tracking-tight text-foreground mb-3'>
        {isPrismaError ? 'Database Connection Lost' : 'Something Went Wrong'}
      </h2>

      <p className='text-muted-foreground font-medium max-w-md mb-8 leading-relaxed'>
        {isPrismaError
          ? "We're having trouble reaching the database at the moment. This is usually temporary and likely due to a short service interruption. Please wait a moment and try again."
          : error.message ||
            'An unexpected error occurred while loading your dashboard. Our technical team has been notified.'}
      </p>

      <div className='flex flex-col sm:flex-row items-center gap-4'>
        <Button
          onClick={() => reset()}
          size='lg'
          className='rounded-xl font-black px-10 h-14 bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all gap-2'
        >
          <RefreshCw className='h-5 w-5' />
          Try Again
        </Button>
        <Button
          variant='outline'
          onClick={() => (window.location.href = '/dashboard')}
          className='rounded-xl font-bold px-8 h-14 border-border/40 hover:bg-muted transition-all'
        >
          Return to Dashboard
        </Button>
      </div>

      {error.digest && (
        <p className='mt-12 text-[10px] font-mono text-muted-foreground/30 font-bold uppercase tracking-widest'>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
