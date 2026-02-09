import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { DocumentTable } from '@/components/documents/document-table';
import { RequestDocumentModal } from '@/components/documents/request-document-modal';
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

  // Fetch all documents with their project and status info
  const documents = await prisma.document.findMany({
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

  // Fetch projects and document types for the request modal
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      clientId: true,
    },
  });

  const documentTypes = await prisma.documentType.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className='flex-1 space-y-8 animate-in fade-in duration-700'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>
            Document <span className='text-primary italic'>Manager</span>
          </h1>
          <p className='text-muted-foreground font-semibold flex items-center gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-primary' />
            {documents.length} Files recorded in the database
          </p>
        </div>
        <RequestDocumentModal
          projects={projects}
          documentTypes={documentTypes}
        />
      </div>

      <DocumentTable documents={documents} />
    </div>
  );
}
