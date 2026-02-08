import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { logout } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  return (
    <div className='min-h-screen bg-gray-50 p-8 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <header className='flex justify-between items-center'>
          <div>
            <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
              Dashboard
            </h1>
            <p className='text-muted-foreground mt-2'>
              Welcome back to your BAFA CRM workspace.
            </p>
          </div>
          <form action={logout}>
            <Button
              variant='outline'
              className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold'
            >
              Sign Out
            </Button>
          </form>
        </header>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card className='shadow-md border-2 border-gray-100'>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  Full Name
                </p>
                <p className='text-lg font-medium'>
                  {profile?.full_name || 'N/A'}
                </p>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  Email
                </p>
                <p className='text-lg font-medium'>{profile?.email}</p>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                  Role
                </p>
                <Badge className='mt-1 capitalize text-sm px-3 py-1 font-bold bg-primary text-white'>
                  {profile?.role || 'user'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-md border-2 border-gray-100 flex flex-col justify-center items-center p-8 text-center bg-white'>
            <CardTitle className='text-3xl font-black text-primary mb-2'>
              BAFA CRM
            </CardTitle>
            <p className='text-muted-foreground font-medium'>
              Domain-specific compliance platform
            </p>
            <div className='mt-6 w-full h-1 bg-gray-100 rounded-full overflow-hidden'>
              <div className='w-1/3 h-full bg-primary animate-pulse'></div>
            </div>
          </Card>
        </div>

        <section className='bg-white p-8 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[300px] text-center shadow-inner'>
          <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
          </div>
          <h3 className='text-xl font-bold text-gray-900'>
            No active projects yet
          </h3>
          <p className='text-gray-500 max-w-sm mt-2 font-medium'>
            Once projects are assigned to you, they will appear here for
            management and compliance tracking.
          </p>
        </section>
      </div>
    </div>
  );
}
