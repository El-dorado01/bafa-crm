import { Badge } from '@/components/ui/badge';
import { Search, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function DashboardHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await prisma.profile.findUnique({
        where: { id: user.id },
      })
    : null;

  return (
    <header className='sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-8 py-5'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <div className='space-y-0.5'>
          <h2 className='text-2xl font-black tracking-tight font-sans'>
            Welcome back,{' '}
            <span className='text-primary italic font-black'>
              {profile?.full_name?.split(' ')[0] || 'User'}
            </span>
          </h2>
          <div className='flex items-center gap-3 text-muted-foreground font-semibold text-sm'>
            <span>
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className='h-1 w-1 rounded-full bg-muted-foreground/30' />
            <Badge
              variant='outline'
              className='h-5 py-0 px-2 rounded-md font-black uppercase text-[10px] tracking-widest bg-muted border-primary/20 text-primary'
            >
              {profile?.role || 'Member'}
            </Badge>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <button className='h-11 w-11 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center hover:bg-muted transition-colors relative'>
            <Search className='h-5 w-5 text-muted-foreground' />
          </button>
          <button className='h-11 w-11 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center hover:bg-muted transition-colors relative'>
            <Bell className='h-5 w-5 text-muted-foreground' />
            <span className='absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background' />
          </button>
          <div className='h-11 w-11 rounded-2xl bg-linear-to-br from-primary to-blue-600 p-[2px] shadow-lg shadow-primary/20'>
            <div className='h-full w-full rounded-[14px] bg-background flex items-center justify-center overflow-hidden'>
              <div className='h-full w-full bg-primary/10 flex items-center justify-center text-primary font-black'>
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
