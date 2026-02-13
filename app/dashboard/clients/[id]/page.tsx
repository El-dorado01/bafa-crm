import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  History,
} from 'lucide-react';
import { ProjectTable } from '@/components/projects/project-table';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    redirect('/login');
  }

  // Fetch current user from DB to get the role
  const dbUser = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { role: true, id: true },
  });

  const isConsultant = dbUser?.role === 'CONSULTANT';

  // Fetch client with profile and projects
  const client = await prisma.user.findUnique({
    where: { id, role: 'CLIENT' },
    include: {
      profile: true,
      clientProjects: {
        include: {
          caseStatus: true,
          client: {
            select: { name: true, email: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  // Security check: If Consultant, must be assigned to at least one of this client's projects
  if (isConsultant) {
    const isAssigned = client.clientProjects.some(
      (p) => p.consultantId === currentUser.id,
    );
    if (!isAssigned) {
      redirect('/dashboard/clients');
    }
  }

  // Fetch all statuses for the project table
  const statuses = await prisma.caseStatus.findMany({
    orderBy: { order: 'asc' },
  });

  const projectCount = client.clientProjects.length;

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='flex items-center gap-6'>
          <Avatar className='h-24 w-24 border-4 border-white shadow-xl'>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`}
              alt={client.name || ''}
            />
            <AvatarFallback className='bg-primary/10 text-primary font-black text-2xl'>
              {client.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <h1 className='text-4xl font-black tracking-tight text-foreground'>
              {client.name}
            </h1>
            <div className='flex items-center gap-4 text-muted-foreground font-bold'>
              <div className='flex items-center gap-1.5'>
                <Mail className='h-4 w-4' />
                {client.email}
              </div>
              {client.profile?.companyName && (
                <div className='flex items-center gap-1.5'>
                  <Building2 className='h-4 w-4' />
                  {client.profile.companyName}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex gap-4'>
          <Badge
            variant='outline'
            className='h-10 px-4 rounded-xl border-border/40 font-black gap-2 bg-white/50 backdrop-blur-sm'
          >
            <Briefcase className='h-4 w-4 text-primary' />
            {projectCount} Projects
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <Card className='lg:col-span-1 glass-card border-none shadow-sm'>
          <CardHeader>
            <CardTitle className='font-black'>Company Profile</CardTitle>
            <CardDescription className='font-medium'>
              Technical and legal details of the client.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='mt-1 bg-primary/5 p-2 rounded-lg'>
                  <Building2 className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='text-xs font-black uppercase text-muted-foreground'>
                    Legal Form
                  </p>
                  <p className='font-bold'>
                    {client.profile?.legalForm || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-1 bg-primary/5 p-2 rounded-lg'>
                  <MapPin className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='text-xs font-black uppercase text-muted-foreground'>
                    Address
                  </p>
                  <p className='font-bold text-sm'>
                    {client.profile?.address || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-1 bg-primary/5 p-2 rounded-lg'>
                  <Calendar className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='text-xs font-black uppercase text-muted-foreground'>
                    Founding Date
                  </p>
                  <p className='font-bold'>
                    {client.profile?.foundingDate
                      ? new Date(
                          client.profile.foundingDate,
                        ).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-1 bg-primary/5 p-2 rounded-lg'>
                  <Briefcase className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='text-xs font-black uppercase text-muted-foreground'>
                    Industry
                  </p>
                  <p className='font-bold'>
                    {client.profile?.industry || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='lg:col-span-2 space-y-4'>
          <ProjectTable
            projects={client.clientProjects as any}
            statuses={statuses}
            role={dbUser?.role}
          />
        </div>
      </div>
    </div>
  );
}
