'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateCompanyProfile(formData: {
  userId: string;
  name?: string;
  companyName?: string;
  address?: string;
  legalForm?: string;
  industry?: string;
  foundingDate?: Date;
}) {
  try {
    const { userId, name, ...profileData } = formData;

    // Update User name if provided
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // Upsert Profile
    await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });

    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update company profile:', error);
    const message =
      error.message?.includes('P1001') || error.message?.includes('reached')
        ? 'Database server is unreachable. Please try again in 1 minute.'
        : 'Database update failed';
    return { success: false, error: message };
  }
}
