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

  // Fetch all projects with client and status info
  const projects = await prisma.project.findMany({
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

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            Project <span className='text-primary italic'>Pipeline</span>
          </h1>
          <p className='text-muted-foreground font-semibold flex items-center gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            {projects.length} Active cases being processed
          </p>
        </div>
      </div>

      <ProjectTable
        projects={projects}
        statuses={statuses}
      />
    </div>
  );
}
