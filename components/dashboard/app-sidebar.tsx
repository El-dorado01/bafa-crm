'use client';

import {
  LayoutDashboard,
  Files,
  Users,
  MessageSquare,
  LogOut,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/login/actions';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Briefcase, label: 'Projects', href: '/dashboard/projects' },
  { icon: Users, label: 'Clients', href: '/dashboard/clients' },
  { icon: Files, label: 'Documents', href: '/dashboard/documents' },
  {
    icon: MessageSquare,
    label: 'Communication',
    href: '/dashboard/communication',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <Sidebar variant='inset'>
      <SidebarHeader className='px-8 pb-4 pt-8 md:py-4'>
        <div className='flex items-center gap-3 overflow-hidden mb-10 md:mb-0'>
          <div className='h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20 shrink-0'>
            <CheckCircle2 className='h-6 w-6 text-white' />
          </div>
          <h1 className='text-xl font-black tracking-tighter uppercase text-gradient'>
            BAFA CRM
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className='px-4 md:px-0'>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-1.5'>
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-6 rounded-xl transition-all duration-300 group',
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90 hover:text-white'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Link href={link.href}>
                        <link.icon
                          className={cn(
                            'h-5 w-5 transition-transform group-hover:scale-110',
                            isActive ? 'text-white' : 'text-primary',
                          )}
                        />
                        <span className='font-medium text-base'>
                          {link.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='py-6 px-4 md:px-2 mt-auto space-y-4'>
        {/* <div className='p-4 rounded-2xl bg-linear-to-br from-primary/10 to-blue-500/5 border border-primary/10'>
          <p className='text-xs font-black uppercase tracking-widest text-primary mb-2'>
            Platform Status
          </p>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse' />
            <p className='text-sm font-bold'>Systems Operational</p>
          </div>
        </div> */}

        <Button
          variant={'destructive'}
          size={'lg'}
          onClick={() => logout()}
          className='w-full py-6 font-bold group cursor-pointer'
        >
          <LogOut className='h-5 w-5 group-hover:-translate-x-1 transition-transform' />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
