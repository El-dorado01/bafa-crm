import { Search, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DynamicBreadcrumbs } from './dynamic-breadcrumbs';

export async function DashboardHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
      })
    : null;

  return (
    <header className='sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border/40 px-4 md:px-8 py-4 md:py-5'>
      <div className='flex justify-between items-center max-w-7xl mx-auto gap-4'>
        <div className='flex items-center gap-2 md:gap-4'>
          <SidebarTrigger className='-ml-1' />
          <div className='h-4 w-px bg-border/60 mx-1 hidden sm:block' />
          <DynamicBreadcrumbs />
        </div>

        <div className='flex items-center gap-2 md:gap-4'>
          <button className='h-9 w-9 md:h-11 md:w-11 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center hover:bg-muted transition-colors relative'>
            <Search className='h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
          </button>
          <button className='h-9 w-9 md:h-11 md:w-11 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center hover:bg-muted transition-colors relative'>
            <Bell className='h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
            <span className='absolute top-2 right-2 md:top-2.5 md:right-2.5 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary border-2 border-background' />
          </button>
          <div className='h-9 w-9 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-linear-to-br from-primary to-blue-600 p-[2px] shadow-lg shadow-primary/20'>
            <div className='h-full w-full rounded-[7px] md:rounded-[14px] bg-background flex items-center justify-center overflow-hidden'>
              <div className='h-full w-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs md:text-base'>
                {userData?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
