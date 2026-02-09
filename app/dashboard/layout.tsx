import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background flex overflow-hidden font-sans'>
      <AppSidebar />
      <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
        <DashboardHeader />
        <main className='flex-1 overflow-y-auto relative bg-background/50 backdrop-blur-3xl p-8 max-w-7xl mx-auto w-full'>
          {children}
        </main>
      </div>
    </div>
  );
}
