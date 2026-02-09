'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProjectStatus(projectId: string, statusId: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { caseStatusId: statusId },
    });

    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (error) {
    console.error('Failed to update project status:', error);
    return { success: false, error: 'Database update failed' };
  }
}
