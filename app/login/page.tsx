'use client';

import { useState, Suspense } from 'react';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {message && (
        <div className='rounded-xl bg-blue-500/10 p-4 text-sm text-blue-600 border border-blue-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300'>
          {message}
        </div>
      )}
      {error && (
        <div className='rounded-xl bg-red-500/10 p-4 text-sm text-red-600 border border-red-500/20 backdrop-blur-sm animate-in fade-in shake duration-300'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label
            htmlFor='email'
            className='text-sm font-semibold tracking-wide text-foreground/70 ml-1'
          >
            Email Address
          </Label>
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10' />
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='name@company.com'
              className='pl-12 h-13 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg'
              required
            />
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between ml-1'>
            <Label
              htmlFor='password'
              title='Password'
              className='text-sm font-semibold tracking-wide text-foreground/70'
            >
              Password
            </Label>
            <Link
              href='#'
              className='text-xs font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest'
            >
              Forgot?
            </Link>
          </div>
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10' />
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              className='pl-12 h-13 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg'
              required
            />
          </div>
        </div>
      </div>

      <Button
        type='submit'
        className='w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-white flex gap-2 group'
        disabled={loading}
      >
        {loading ? (
          <span className='flex items-center gap-2'>
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
            Authenticating...
          </span>
        ) : (
          <>
            Log In
            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
          </>
        )}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className='min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background'>
      {/* Decorative Side - Desktop Only */}
      <div className='hidden lg:flex relative items-center justify-center bg-primary overflow-hidden border-r border-white/10'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-transparent' />
          <div
            className='absolute inset-0 opacity-20'
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          ></div>
        </div>

        <div className='relative z-10 max-w-xl p-12 text-white'>
          <div className='flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left-4 duration-700'>
            <div className='h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl'>
              <ShieldCheck className='h-7 w-7 text-white' />
            </div>
            <h1 className='text-3xl font-black tracking-tighter uppercase italic'>
              BAFA CRM
            </h1>
          </div>

          <h2 className='text-6xl font-black leading-tight mb-6 animate-in fade-in slide-in-from-left-6 duration-1000 delay-100'>
            Securely Manage Your{' '}
            <span className='text-blue-200'>Compliance</span>
          </h2>
          <p className='text-xl text-blue-50/80 font-medium leading-relaxed max-w-md animate-in fade-in slide-in-from-left-8 duration-1000 delay-200'>
            The all-in-one platform for professional consultants and funding
            advisors to streamline BAFA-funded projects.
          </p>

          <div className='mt-16 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500'>
            <div>
              <p className='text-4xl font-black mb-1'>99.9%</p>
              <p className='text-blue-100/60 font-bold uppercase tracking-wider text-xs'>
                Uptime Guaranteed
              </p>
            </div>
            <div>
              <p className='text-4xl font-black mb-1'>ISO</p>
              <p className='text-blue-100/60 font-bold uppercase tracking-wider text-xs'>
                Certified Security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Side */}
      <div className='flex items-center justify-center p-8 bg-background relative overflow-hidden'>
        {/* Mobile decorative blobs */}
        <div className='absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl lg:hidden' />
        <div className='absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl lg:hidden' />

        <div className='w-full max-w-md relative z-10'>
          <div className='mb-10 text-center lg:text-left'>
            <div className='flex items-center gap-2 mb-4 justify-center lg:justify-start lg:hidden'>
              <ShieldCheck className='h-8 w-8 text-primary' />
              <h1 className='text-2xl font-black tracking-tighter uppercase italic'>
                BAFA CRM
              </h1>
            </div>
            <h3 className='text-4xl font-black tracking-tight text-foreground mb-3'>
              Welcome back
            </h3>
            <p className='text-muted-foreground font-medium text-lg'>
              Enter your details to access your workspace.
            </p>
          </div>

          <Suspense
            fallback={
              <div className='h-[400px] flex items-center justify-center font-bold text-muted-foreground'>
                Loading workspace...
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          <p className='mt-10 text-center text-muted-foreground font-medium'>
            Don't have an account?{' '}
            <Link
              href='/signup'
              className='text-primary font-black hover:underline underline-offset-4 decoration-2'
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
