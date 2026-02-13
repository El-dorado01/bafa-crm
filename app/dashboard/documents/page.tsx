import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { DocumentTable } from '@/components/documents/document-table';
import { RequestDocumentModal } from '@/components/documents/request-document-modal';
import { UploadCenter } from '@/components/documents/upload-center';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser && user.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true },
    });
  }

  if (!dbUser) {
    redirect('/login');
  }

  const isClient = dbUser?.role === 'CLIENT';

  // Fetch documents with role-based filtering
  const documents = await prisma.document.findMany({
    where: isClient ? { project: { clientId: user.id } } : {},
    include: {
      project: {
        select: {
          name: true,
        },
      },
      type: {
        select: {
          name: true,
        },
      },
      state: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Split documents for client prioritization
  const actionRequiredDocs = documents.filter(
    (doc) =>
      doc.state.name === 'Requested' ||
      doc.state.name === 'Correction Required',
  );

  // Always fetch document types for the Upload Center / Request Modal
  const documentTypes = await prisma.documentType.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Fetch projects based on role
  const projects = await prisma.project.findMany({
    where: isClient ? { clientId: user.id } : {},
    select: {
      id: true,
      name: true,
      clientId: true,
    },
  });

  const isConsultantOrAdvisor =
    dbUser?.role === 'CONSULTANT' || dbUser?.role === 'FUNDING_ADVISOR';

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            {isClient ? 'Your Document' : 'Document'}{' '}
            <span className='text-primary italic'>Hub</span>
          </h1>
          <p className='text-muted-foreground font-semibold flex items-center gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            {isClient
              ? `You have ${actionRequiredDocs.length} pending actions across ${documents.length} files`
              : `${documents.length} Files recorded in the database`}
          </p>
        </div>
        {isConsultantOrAdvisor && (
          <RequestDocumentModal
            projects={projects}
            documentTypes={documentTypes}
          />
        )}
      </div>

      {isClient && (
        <UploadCenter
          documentTypes={documentTypes}
          existingDocuments={documents as any}
          projects={projects}
          userId={user.id}
        />
      )}

      {isClient && actionRequiredDocs.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-xl font-black tracking-tight flex items-center gap-2 text-amber-600'>
            <span className='h-2 w-2 rounded-full bg-amber-500 animate-pulse' />
            Action Required
          </h2>
          <DocumentTable
            documents={actionRequiredDocs as any}
            role={dbUser?.role}
          />
        </div>
      )}

      <div className='space-y-4'>
        {isClient && (
          <h2 className='text-xl font-black tracking-tight'>
            All Documentation
          </h2>
        )}
        <DocumentTable
          documents={documents as any}
          role={dbUser?.role}
        />
      </div>
    </div>
  );
}
