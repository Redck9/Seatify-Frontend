import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { AppSidebar } from "@/app/components/SideBar/app-sidebar"
// import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {

  /* const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  }; */
  
  return (
    <SidebarProvider>
      <AppSidebar /* isOpen={isSidebarOpen} onToggle={toggleSidebar} *//>
      {/* <SidebarTrigger
        className={`fixed z-50 transition-all duration-300 ${
          !isSidebarOpen ? "translate-x-64" : ""
        }`}
        onClick={toggleSidebar}
      /> */}
      <SidebarTrigger/>
      <main className="flex flex-col items-center justify-center w-full min-h-screen">
        {children}
      </main>
    </SidebarProvider>
  )
}
