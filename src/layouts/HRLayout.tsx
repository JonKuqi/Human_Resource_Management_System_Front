"use client";

import { ReactNode } from "react";
import { HRSidebar } from "../components/tenant/HR/HRSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const HRLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#F4F6F6]">
        <div className="w-64 bg-white shadow-lg">
          <HRSidebar />
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HRLayout;
