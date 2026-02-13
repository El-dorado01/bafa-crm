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
  } catch (error: any) {
    console.error('Failed to update document status:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Database update failed';
    return { success: false, error: message };
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
  } catch (error: any) {
    console.error('Failed to request document:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Failed to create document request';
    return { success: false, error: message };
  }
}

export async function uploadDocument(
  projectId: string,
  typeId: string,
  fileName: string,
  filePath: string,
  userId: string,
) {
  try {
    const uploadedState = await prisma.documentState.findUnique({
      where: { name: 'Uploaded' },
    });

    if (!uploadedState) {
      return { success: false, error: 'Uploaded state not found' };
    }

    // Check if a document of this type already exists for this project
    const existingDoc = await prisma.document.findFirst({
      where: {
        projectId,
        typeId,
      },
    });

    if (existingDoc) {
      // Update existing record regardless of previous state
      await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          stateId: uploadedState.id,
          uploadedById: userId,
          fileName,
          filePath,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new record
      await prisma.document.create({
        data: {
          projectId,
          typeId,
          stateId: uploadedState.id,
          uploadedById: userId,
          fileName,
          filePath,
        },
      });
    }

    revalidatePath('/dashboard/documents');
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to upload document:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Failed to record document upload';
    return { success: false, error: message };
  }
}

export async function fulfillDocumentRequest(
  documentId: string,
  fileName: string,
  filePath: string,
) {
  try {
    const uploadedState = await prisma.documentState.findUnique({
      where: { name: 'Uploaded' },
    });

    if (!uploadedState) {
      return { success: false, error: 'Uploaded state not found' };
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        stateId: uploadedState.id,
        fileName,
        filePath,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/documents');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to fulfill document request:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Failed to upload document';
    return { success: false, error: message };
  }
}
