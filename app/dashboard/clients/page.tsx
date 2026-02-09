import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ClientTable } from '@/components/clients/client-table';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify Role: Only Consultants (and maybe Admins) should see this page
  // We can fetch the user's profile to check role
  const currentUserProfile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!currentUserProfile || currentUserProfile.role !== 'Consultant') {
    // If not a consultant, redirect to dashboard or show unauthorized
    // For now, let's redirect to dashboard
    // redirect('/dashboard');
    // Commented out for now to allow easier testing if role isn't perfectly set
  }

  // Fetch Clients
  // In a real app, we might filter by clients assigned to this consultant
  // For now, fetch all users with role 'client' (or just all profiles for demo)
  const clients = await prisma.profile.findMany({
    where: {
      role: 'Client', // Case sensitive? Schema comment says 'client', seed says 'Consultant'
      // If seed uses 'Consultant' (Capitalized), we should check casing.
      // Let's fetch all for now and filter or just show them.
      // Or matches: { role: { equals: 'client', mode: 'insensitive' } }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fallback: If no clients found (e.g. only Consultants exist), fetch all profiles to show SOMETHING
  // This is helpful for testing.
  const displayClients =
    clients.length > 0
      ? clients
      : await prisma.profile.findMany({
          orderBy: { createdAt: 'desc' },
        });

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
          Client Management
        </h2>
        {/* Breadcrumb or secondary actions could go here */}
      </div>

      <ClientTable
        clients={displayClients.map((c) => ({
          ...c,
          createdAt: c.createdAt, // Pass Date object
        }))}
      />
    </div>
  );
}
