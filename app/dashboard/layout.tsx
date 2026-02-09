import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className='min-h-screen bg-background flex w-full font-sans'>
        <AppSidebar />
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
