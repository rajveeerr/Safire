import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="dark:bg-dot-[#d9cfff]/[0.2] bg-dot-black/[0.2]">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-screen overflow-y-auto">
            <SidebarTrigger />
            {children}
            <Toaster />
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
