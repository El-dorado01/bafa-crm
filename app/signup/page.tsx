'use client';

import { useState } from 'react';
import { signup } from './actions';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Link from 'next/link';

export default function SignupPage() {
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
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900'>
      <Card className='w-full max-w-md shadow-lg border-2 border-gray-100'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-3xl font-bold tracking-tight text-primary'>
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details below to join the BAFA CRM.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            {error && (
              <div className='rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200'>
                {error}
              </div>
            )}
            <div className='grid gap-2'>
              <Label htmlFor='full_name'>Full Name</Label>
              <Input
                id='full_name'
                name='full_name'
                placeholder='John Doe'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='company_name'>Company Name</Label>
              <Input
                id='company_name'
                name='company_name'
                placeholder='Acme Consulting'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='m@example.com'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='role'>Role</Label>
              <Select
                name='role'
                required
                defaultValue='client'
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='client'>Client</SelectItem>
                  <SelectItem value='consultant'>Consultant</SelectItem>
                  <SelectItem value='funding_advisor'>
                    Funding Advisor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full text-lg font-semibold py-6 h-auto'
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <div className='text-center text-sm text-muted-foreground font-medium uppercase tracking-wider'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-primary hover:underline font-bold'
              >
                Log In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
