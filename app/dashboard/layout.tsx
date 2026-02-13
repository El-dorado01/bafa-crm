import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser && user.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true },
      });
    }
  }

  return (
    <SidebarProvider>
      <div className='min-h-screen bg-background flex w-full font-sans'>
        <AppSidebar role={dbUser?.role || 'CLIENT'} />
        <SidebarInset className='flex-1 flex flex-col min-h-screen overflow-hidden'>
          <DashboardHeader />
          <main className='flex-1 overflow-y-auto relative bg-white backdrop-blur-3xl p-8 max-w-7xl mx-auto w-full'>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
