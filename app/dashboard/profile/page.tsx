import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Building, AlertCircle } from 'lucide-react';
import { CompanyProfileForm } from '@/components/profile/company-profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  });

  // Fallback to email if ID mismatch (common with seeds)
  if (!dbUser && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { profile: true },
    });
  }

  if (!dbUser) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4'>
        <div className='h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
          <AlertCircle className='h-8 w-8' />
        </div>
        <h2 className='text-2xl font-black'>Account Not Synced</h2>
        <p className='text-muted-foreground max-w-md'>
          Your authentication account is valid, but we couldn't find your
          profile in our records. Please contact support to sync your accounts.
        </p>
      </div>
    );
  }

  // Handle Client-only view (though sidebar handles it, extra safety)
  if (dbUser.role !== 'CLIENT') {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4'>
        <div className='h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
          <Building className='h-8 w-8' />
        </div>
        <h2 className='text-2xl font-black'>Advisor Profile Center</h2>
        <p className='text-muted-foreground max-w-md'>
          Internal profile management for advisors and consultants is handled
          via administrative settings. This page is currently reserved for
          Client company management.
        </p>
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700 pb-12'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            Company <span className='text-primary italic'>Profile</span>
          </h1>
          <p className='text-muted-foreground font-semibold flex items-center gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            Maintain your company details for BAFA compliance and funding
            records
          </p>
        </div>
      </div>

      <CompanyProfileForm dbUser={dbUser as any} />
    </div>
  );
}
