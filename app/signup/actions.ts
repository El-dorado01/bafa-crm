'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const companyName = formData.get('company_name') as string;
  const role = formData.get('role') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await prisma.profile.create({
        data: {
          id: data.user.id,
          email,
          full_name: fullName,
          company_name: companyName,
          role: role as any,
        },
      });
    } catch (e: any) {
      console.error('Error creating profile:', e);
      return { error: 'Failed to create user profile.' };
    }
  }

  redirect('/login?message=Check your email to confirm your account');
}
