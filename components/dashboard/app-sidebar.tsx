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

  return (
    <aside className='w-72 border-r border-border/40 bg-card hidden md:flex flex-col z-20 h-screen sticky top-0'>
      <div className='p-8 pb-4'>
        <div className='flex items-center gap-3 mb-10 overflow-hidden'>
          <div className='h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0'>
            <CheckCircle2 className='h-6 w-6 text-white' />
          </div>
          <h1 className='text-xl font-black tracking-tighter uppercase italic text-gradient'>
            BAFA CRM
          </h1>
        </div>

        <nav className='space-y-1.5 font-medium'>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <link.icon
                  className={cn(
                    'h-5 w-5 transition-transform group-hover:scale-110',
                    isActive ? 'text-white' : 'text-primary',
                  )}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='mt-auto p-6 space-y-4'>
        <div className='p-4 rounded-2xl bg-linear-to-br from-primary/10 to-blue-500/5 border border-primary/10'>
          <p className='text-xs font-black uppercase tracking-widest text-primary mb-2'>
            Platform Status
          </p>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse' />
            <p className='text-sm font-bold'>Systems Operational</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold group'
        >
          <LogOut className='h-5 w-5 group-hover:-translate-x-1 transition-transform' />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
