import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { ClientTable } from '@/components/clients/client-table';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all clients with their profiles and project counts
  const clients = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
    },
    include: {
      profile: true,
      _count: {
        select: { clientProjects: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match the expected Client interface in the component
  const transformedClients: any[] = clients.map((client) => ({
    id: client.id,
    name: client.name || 'Unknown',
    email: client.email,
    companyName: client.profile?.companyName || null,
    projectCount: client._count.clientProjects,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  }));

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            Client <span className='text-primary italic'>Directory</span>
          </h1>
          <p className='text-muted-foreground font-semibold flex items-center gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            {transformedClients.length} Clients identified in the system
          </p>
        </div>
      </div>

      <ClientTable clients={transformedClients as any} />
    </div>
  );
}
