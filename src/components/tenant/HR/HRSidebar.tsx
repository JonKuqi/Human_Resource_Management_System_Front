"use client"

import { Briefcase, Calendar, Home, LogOut, Settings, Users, Star, FileCheck } from "lucide-react"
import { Link } from "react-router-dom";
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/src/components/tenant/HR/ModeToggle";

export function HRSidebar() {
  const pathname = usePathname()

const isActive = (path: string) => {
  if (!pathname) return false;
  return pathname === path || pathname.startsWith(`${path}/`);
};


  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16 border-2 border-hr-lightest-gray">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="HR Manager" />
            <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray">HR</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-hr-lightest-gray">Sarah Johnson</h3>
            <p className="text-sm text-hr-lighter-gray">HR Manager</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/hr/dashboard")}>
              <Link to="/tenant/hr/dashboard">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/hr/jobs")}>
              <Link to="/tenant/hr/jobs">
                <Briefcase className="h-5 w-5" />
                <span>Job Listings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/hr/employees")}>
              <Link to="/tenant/hr/employees">
                <Users className="h-5 w-5" />
                <span>Employees</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/hr/performance")}>
              <Link to="/tenant/hr/performance">
                <Star className="h-5 w-5" />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/hr/leave-requests")}>
              <Link to="/tenant/hr/leave-requests">
                <Calendar className="h-5 w-5" />
                <span>Leave Requests</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/hr/contracts")}>
              <Link to="/tenant/hr/contracts">
                <FileCheck className="h-5 w-5" />
                <span>Contracts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-hr-lighter-gray hover:text-hr-lightest-gray">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <ModeToggle />
          <Button variant="ghost" size="icon" className="text-hr-lighter-gray hover:text-hr-lightest-gray">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
