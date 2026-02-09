'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateDocumentStatus(
  documentId: string,
  statusName: string,
) {
  try {
    const status = await prisma.documentState.findUnique({
      where: { name: statusName },
    });

    if (!status) {
      return { success: false, error: 'Invalid status' };
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { stateId: status.id },
    });

    revalidatePath('/dashboard/documents');
    return { success: true };
  } catch (error) {
    console.error('Failed to update document status:', error);
    return { success: false, error: 'Database update failed' };
  }
}

export async function requestDocument(
  projectId: string,
  typeId: string,
  userId: string,
) {
  try {
    // Get the 'Requested' state ID
    const requestedState = await prisma.documentState.findUnique({
      where: { name: 'Requested' },
    });

    if (!requestedState) {
      return { success: false, error: 'Requested state not found' };
    }

    await prisma.document.create({
      data: {
        projectId,
        typeId,
        stateId: requestedState.id,
        uploadedById: userId, // In a real scenario, this might be null until uploaded
        fileName: 'Pending upload...',
        filePath: '', // Empty until uploaded
      },
    });

    revalidatePath('/dashboard/documents');
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to request document:', error);
    return { success: false, error: 'Failed to create document request' };
  }
}
