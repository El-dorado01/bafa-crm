import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { logout } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Files,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: Briefcase, label: 'Projects', active: false },
    { icon: Files, label: 'Documents', active: false },
    { icon: MessageSquare, label: 'Communication', active: false },
    { icon: Users, label: 'Stakeholders', active: false },
  ];

  return (
    <div className='min-h-screen bg-background flex overflow-hidden'>
      {/* Premium Sidebar */}
      <aside className='w-72 border-r border-border/40 bg-card hidden md:flex flex-col z-20'>
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
            {sidebarLinks.map((link) => (
              <button
                key={link.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  link.active
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <link.icon
                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${link.active ? 'text-white' : 'text-primary'}`}
                />
                {link.label}
              </button>
            ))}
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

          <form action={logout}>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold group'>
              <LogOut className='h-5 w-5 group-hover:-translate-x-1 transition-transform' />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto relative bg-background/50 backdrop-blur-3xl'>
        {/* Superior Header */}
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

        <div className='p-8 max-w-7xl mx-auto space-y-10'>
          {/* Bento Stats */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                icon: Briefcase,
                label: 'Active Projects',
                val: '12',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: Files,
                label: 'Pending Docs',
                val: '08',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
              {
                icon: CheckCircle2,
                label: 'Completed',
                val: '154',
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
              {
                icon: TrendingUp,
                label: 'Compliance Rate',
                val: '98%',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className='border-border/40 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group bg-card'
              >
                <CardContent className='p-6 flex items-center gap-5'>
                  <div
                    className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <div>
                    <p className='text-3xl font-black tracking-tight'>
                      {stat.val}
                    </p>
                    <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider'>
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='grid gap-10 lg:grid-cols-3'>
            {/* Project List / Feed */}
            <div className='lg:col-span-2 space-y-6'>
              <div className='flex items-center justify-between pb-2'>
                <h3 className='text-2xl font-black tracking-tight underline elevation-1 decoration-primary decoration-4 underline-offset-8'>
                  Recent Projects
                </h3>
                <Button className='rounded-xl font-bold gap-2 px-5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none'>
                  <Plus className='h-5 w-5' />
                  New Project
                </Button>
              </div>

              <Card className='glass-card border-none'>
                <CardContent className='p-0'>
                  <div className='flex flex-col items-center justify-center py-24 text-center'>
                    <div className='h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6 relative'>
                      <div className='absolute inset-0 rounded-full bg-primary/5 animate-ping' />
                      <Files className='h-10 w-10 text-muted-foreground/50' />
                    </div>
                    <h4 className='text-2xl font-black text-foreground mb-2'>
                      The Desk is Calm
                    </h4>
                    <p className='text-muted-foreground font-medium max-w-sm'>
                      No high-priority projects are currently requiring
                      attention. Take this time to audit your archives.
                    </p>
                    <button className='mt-8 text-primary font-black flex items-center gap-2 hover:gap-3 transition-all'>
                      Browse Archives <ArrowRight className='h-5 w-5' />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Column */}
            <div className='space-y-10'>
              <div>
                <h3 className='text-xl font-black tracking-tight mb-5 flex items-center gap-2 text-foreground/80'>
                  <Clock className='h-5 w-5 text-primary' />
                  Recent Activity
                </h3>
                <div className='space-y-6 border-l-2 border-muted/50 ml-2.5 pl-6 py-2'>
                  {[
                    {
                      type: 'doc',
                      desc: 'New document uploaded for Acme Inc.',
                      time: '2h ago',
                    },
                    {
                      type: 'user',
                      desc: 'New consultant joined Project Apollo',
                      time: '5h ago',
                    },
                    {
                      type: 'sys',
                      desc: 'System audit completed successfully',
                      time: 'Yesterday',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className='relative'
                    >
                      <div className='absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-background border-2 border-primary ring-4 ring-primary/10' />
                      <p className='text-sm font-bold text-foreground mb-1 leading-snug'>
                        {item.desc}
                      </p>
                      <p className='text-xs font-black uppercase tracking-widest text-muted-foreground/60'>
                        {item.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className='bg-primary shadow-2xl shadow-primary/40 border-none overflow-hidden group'>
                <CardContent className='p-8 relative'>
                  <div className='absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-32 w-32 bg-white/10 rounded-full blur-2xl transition-all group-hover:scale-150 duration-700' />
                  <div className='relative z-10 text-white space-y-4'>
                    <AlertCircle className='h-10 w-10 text-blue-200' />
                    <p className='text-xl font-black leading-tight'>
                      Need help with a compliance audit?
                    </p>
                    <p className='text-blue-100/60 font-bold text-sm'>
                      Our AI assistant can analyze your documents instantly.
                    </p>
                    <Button className='w-full bg-white text-primary hover:bg-blue-50 font-black rounded-xl'>
                      Unlock AI Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
