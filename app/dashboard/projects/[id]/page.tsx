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
import {
  Calendar,
  User,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { DocumentTable } from '@/components/documents/document-table';
import { UploadDocumentModal } from '@/components/documents/upload-document-modal';
import { CaseTimeline } from '@/components/projects/case-timeline';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          name: true,
          email: true,
          profile: true,
        },
      },
      consultant: {
        select: {
          name: true,
          email: true,
        },
      },
      caseStatus: true,
      documents: {
        include: {
          type: true,
          state: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Security check: If Consultant, must be assigned to this project
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role === 'CONSULTANT' && project.consultantId !== user.id) {
    redirect('/dashboard/projects');
  }

  if (dbUser?.role === 'CLIENT' && project.clientId !== user.id) {
    redirect('/dashboard/projects');
  }

  const isConsultant = dbUser?.role === 'CONSULTANT';
  const isClient = dbUser?.role === 'CLIENT';

  // Fetch document types for the upload modal
  const documentTypes = await prisma.documentType.findMany({
    orderBy: { name: 'asc' },
  });

  // Fetch all statuses for the timeline
  const statuses = await prisma.caseStatus.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-muted-foreground font-bold text-sm uppercase tracking-widest'>
            <Briefcase className='h-4 w-4 text-primary' />
            Project Details
          </div>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            {project.name}
          </h1>
        </div>
        <div className='flex items-center gap-4'>
          {!isClient && (
            <UploadDocumentModal
              projectId={project.id}
              userId={user.id}
              documentTypes={documentTypes}
            />
          )}
          <Badge className='h-8 px-4 rounded-lg bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-tighter'>
            {project.caseStatus.name}
          </Badge>
        </div>
      </div>

      <Card className='glass-card border-none shadow-sm overflow-hidden'>
        <CaseTimeline
          statuses={statuses}
          currentStatusId={project.caseStatusId}
        />
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <Card className='lg:col-span-2 glass-card border-none shadow-sm'>
          <CardHeader>
            <CardTitle className='font-black'>Case Overview</CardTitle>
            <CardDescription className='font-medium'>
              Detailed information about the funding request.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <h3 className='font-bold text-sm text-muted-foreground uppercase tracking-widest mb-2'>
                Description
              </h3>
              <p className='text-foreground font-medium leading-relaxed'>
                {project.description ||
                  'No description provided for this project.'}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
              <div className='p-4 rounded-xl bg-muted/30 border border-border/40'>
                <h4 className='text-xs font-black uppercase text-muted-foreground mb-1'>
                  Registration Date
                </h4>
                <div className='flex items-center gap-2 font-bold'>
                  <Calendar className='h-4 w-4 text-primary' />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className='p-4 rounded-xl bg-muted/30 border border-border/40'>
                <h4 className='text-xs font-black uppercase text-muted-foreground mb-1'>
                  Last Updated
                </h4>
                <div className='flex items-center gap-2 font-bold'>
                  <Clock className='h-4 w-4 text-primary' />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='glass-card border-none shadow-sm'>
          <CardHeader>
            <CardTitle className='font-black'>Stakeholders</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary'>
                <User className='h-5 w-5' />
              </div>
              <div>
                <p className='text-xs font-black uppercase text-muted-foreground'>
                  Client
                </p>
                <p className='font-bold'>
                  {project.client.name || project.client.email}
                </p>
                <p className='text-xs font-medium text-muted-foreground'>
                  {project.client.profile?.companyName}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600'>
                <Briefcase className='h-5 w-5' />
              </div>
              <div>
                <p className='text-xs font-black uppercase text-muted-foreground'>
                  Consultant
                </p>
                <p className='font-bold'>
                  {project.consultant?.name || 'Unassigned'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-black tracking-tight'>
            Associated Documents
          </h2>
        </div>
        <DocumentTable documents={project.documents as any} />
      </div>
    </div>
  );
}
