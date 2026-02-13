'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProject(data: {
  name: string;
  clientId: string;
  consultantId?: string | null;
  caseStatusId: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        consultantId:
          data.consultantId === 'none' ? null : data.consultantId || null,
        caseStatusId: data.caseStatusId,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
    return { success: true, project };
  } catch (error: any) {
    console.error('Failed to create project:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Database creation failed. Please check your input and try again.';
    return { success: false, error: message };
  }
}

export async function updateProjectStatus(projectId: string, statusId: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { caseStatusId: statusId },
    });

    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update project status:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Database update failed';
    return { success: false, error: message };
  }
}
