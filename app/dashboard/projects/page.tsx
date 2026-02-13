import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { ProjectTable } from '@/components/projects/project-table';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch current user from DB to get the role
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, id: true },
  });

  if (!dbUser && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true, id: true },
    });
  }

  if (!dbUser) {
    redirect('/login');
  }

  const isConsultant = dbUser?.role === 'CONSULTANT';
  const isClient = dbUser?.role === 'CLIENT';

  // Fetch projects with conditional filtering
  const projects = await prisma.project.findMany({
    where: isConsultant
      ? { consultantId: dbUser.id }
      : isClient
        ? { clientId: dbUser.id }
        : {},
    include: {
      client: {
        select: {
          name: true,
          email: true,
        },
      },
      caseStatus: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch all possible statuses for the dropdown
  const statuses = await prisma.caseStatus.findMany({
    orderBy: {
      order: 'asc',
    },
  });

  const pageTitle = isConsultant
    ? 'My Assigned Cases'
    : isClient
      ? 'Your Funding Cases'
      : 'Project Pipeline';

  const pageDescription = isConsultant
    ? `You have ${projects.length} cases assigned to you`
    : isClient
      ? `You have ${projects.length} funding applications`
      : `${projects.length} Active cases being processed`;

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            {isConsultant ? 'My' : 'Project'}{' '}
            <span className='text-primary italic'>
              {isConsultant ? 'Assigned Cases' : 'Pipeline'}
            </span>
          </h1>
          <p className='text-muted-foreground font-semibold flex items-center gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            {isConsultant
              ? `You have ${projects.length} cases assigned to you`
              : `${projects.length} Active cases being processed`}
          </p>
        </div>
      </div>

      <ProjectTable
        projects={projects}
        statuses={statuses}
        role={dbUser?.role}
      />
    </div>
  );
}
