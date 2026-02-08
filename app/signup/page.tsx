'use client';

import { useState, Suspense } from 'react';
import { signup } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Link from 'next/link';
import {
  ShieldCheck,
  User,
  Building2,
  Mail,
  Lock,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

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
      {error && (
        <div className='rounded-xl bg-red-500/10 p-4 text-sm text-red-600 border border-red-500/20 backdrop-blur-sm animate-in fade-in shake duration-300'>
          {error}
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label
            htmlFor='full_name'
            className='text-sm font-semibold tracking-wide text-foreground/70 ml-1'
          >
            Full Name
          </Label>
          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10' />
            <Input
              id='full_name'
              name='full_name'
              placeholder='John Doe'
              className='pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all'
              required
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='company_name'
            className='text-sm font-semibold tracking-wide text-foreground/70 ml-1'
          >
            Company Name
          </Label>
          <div className='relative group'>
            <Building2 className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10' />
            <Input
              id='company_name'
              name='company_name'
              placeholder='Acme Inc.'
              className='pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all'
            />
          </div>
        </div>
      </div>

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
            placeholder='m@example.com'
            className='pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all'
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='password'
          title='Password'
          className='text-sm font-semibold tracking-wide text-foreground/70 ml-1'
        >
          Password
        </Label>
        <div className='relative group'>
          <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary z-10' />
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='••••••••'
            className='pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all'
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label
          htmlFor='role'
          className='text-sm font-semibold tracking-wide text-foreground/70 ml-1'
        >
          Access Role
        </Label>
        <Select
          name='role'
          required
          defaultValue='client'
        >
          <SelectTrigger
            size='lg'
            className='w-full rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-lg flex items-center'
          >
            <div className='flex items-center gap-3 flex-1'>
              <Briefcase className='h-5 w-5 text-muted-foreground' />
              <SelectValue placeholder='Select a role' />
            </div>
          </SelectTrigger>
          <SelectContent className='rounded-xl border-border shadow-2xl'>
            <SelectItem
              value='client'
              className='py-3 px-4'
            >
              Client
            </SelectItem>
            <SelectItem
              value='consultant'
              className='py-3 px-4'
            >
              Consultant
            </SelectItem>
            <SelectItem
              value='funding_advisor'
              className='py-3 px-4'
            >
              Funding Advisor
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type='submit'
        className='w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-white flex gap-2 group mt-4'
        disabled={loading}
      >
        {loading ? (
          <span className='flex items-center gap-2'>
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
            Creating account...
          </span>
        ) : (
          <>
            Start your journey
            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
          </>
        )}
      </Button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className='min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background'>
      {/* Auth Side */}
      <div className='flex items-center justify-center p-8 bg-background relative overflow-hidden'>
        <div className='absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl lg:hidden' />
        <div className='absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl lg:hidden' />

        <div className='w-full max-w-lg relative z-10'>
          <div className='mb-10 text-center lg:text-left'>
            <div className='flex items-center gap-2 mb-4 justify-center lg:justify-start lg:hidden'>
              <ShieldCheck className='h-8 w-8 text-primary' />
              <h1 className='text-2xl font-black tracking-tighter uppercase italic'>
                BAFA CRM
              </h1>
            </div>
            <h3 className='text-4xl font-black tracking-tight text-foreground mb-3 leading-tight'>
              Get started with{' '}
              <span className='text-primary italic'>Intelligence</span>
            </h3>
            <p className='text-muted-foreground font-medium text-lg'>
              Join thousands of professionals managing high-stakes compliance
              projects.
            </p>
          </div>

          <Suspense
            fallback={
              <div className='h-[500px] flex items-center justify-center font-bold text-muted-foreground animate-pulse'>
                Initializing vault...
              </div>
            }
          >
            <SignupForm />
          </Suspense>

          <p className='mt-10 text-center text-muted-foreground font-medium'>
            Already have an workspace?{' '}
            <Link
              href='/login'
              className='text-primary font-black hover:underline underline-offset-4 decoration-2'
            >
              Sign back in
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Side - Desktop Only */}
      <div className='hidden lg:flex relative items-center justify-center bg-primary overflow-hidden border-l border-white/10'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-transparent' />
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
          <div className='flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-right-4 duration-700'>
            <div className='h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl'>
              <ShieldCheck className='h-7 w-7 text-white' />
            </div>
            <h1 className='text-3xl font-black tracking-tighter uppercase italic'>
              BAFA CRM
            </h1>
          </div>

          <h2 className='text-6xl font-black leading-tight mb-6 animate-in fade-in slide-in-from-right-6 duration-1000 delay-100'>
            Designed for <span className='text-blue-200'>Excellence</span>
          </h2>
          <p className='text-xl text-blue-50/80 font-medium leading-relaxed max-w-md animate-in fade-in slide-in-from-right-8 duration-1000 delay-200'>
            Unlock professional tools to manage audits, documentation, and
            stakeholder communications with absolute precision.
          </p>

          <div className='mt-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500'>
            <div className='flex items-center gap-4 group'>
              <div className='h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-primary transition-colors'>
                <ShieldCheck className='h-5 w-5 text-blue-200' />
              </div>
              <p className='font-bold text-lg'>Bank-level Encryption</p>
            </div>
            <div className='flex items-center gap-4 group'>
              <div className='h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-primary transition-colors text-blue-200'>
                <User className='h-5 w-5' />
              </div>
              <p className='font-bold text-lg'>Multi-tier Role Permissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
