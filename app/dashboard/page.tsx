import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Files,
  Plus,
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
  return (
    <div className='space-y-10'>
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
                <p className='text-3xl font-black tracking-tight'>{stat.val}</p>
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
                  No high-priority projects are currently requiring attention.
                  Take this time to audit your archives.
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
  );
}
