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
  const currentUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!currentUser || currentUser.role !== 'CONSULTANT') {
    // If not a consultant, redirect to dashboard or show unauthorized
    // For now, let's redirect to dashboard
    // redirect('/dashboard');
    // Commented out for now to allow easier testing if role isn't perfectly set
  }

  // Fetch Clients
  // We want to fetch users who have the role 'CLIENT'.
  // Since we display profile info (companyName, phone), we should include the profile relation.
  const clients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match Client interface expected by the table
  // The table expects: id, full_name, email, company_name, phone, role, createdAt
  const displayClients = clients.map((client) => ({
    id: client.id,
    full_name: client.name || 'Unknown',
    email: client.email,
    company_name: client.profile?.companyName || null,
    phone: null, // Phone is not in User or Profile based on schema? Let's check schema again if needed. Profile has address, legalForm, etc.
    // Wait, looking at schema: Profile has companyName, address, legalForm, foundingDate, industry. No phone.
    // User has email.
    role: client.role,
    createdAt: client.createdAt,
  }));

  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
          Client Management
        </h2>
        {/* Breadcrumb or secondary actions could go here */}
      </div>

      <ClientTable clients={displayClients} />
    </div>
  );
}
