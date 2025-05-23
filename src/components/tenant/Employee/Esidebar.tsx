"use client"

import { Bell, Calendar, FileText, Home, LogOut, MessageSquare, Settings, Star, Wallet } from 'lucide-react'
import { Link } from "react-router-dom"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"

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
import { ModeToggle } from "@/src/components/tenant/HR/ModeToggle"
import { Badge } from "@/components/ui/badge"
import { NotificationPopover } from "@/src/components/tenant/Employee/Notificationpopover"

export function EmployeeSidebar() {
  const pathname = usePathname()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [userInfo, setUserInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    position: "Software Developer"
  })

  const isActive = (path: string) => {
    if (!pathname) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Fetch user info and notification counts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        
        // In a real app, you would fetch this data from your API
        // const response = await axios.get("http://localhost:8081/api/v1/tenant/user-info", {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
        // setUserInfo(response.data)
        
        // Mock unread messages and notifications
        setUnreadMessages(3)
        setUnreadNotifications(5)
      } catch (error) {
        console.error("Error fetching user info:", error)
      }
    }
    
    fetchUserInfo()
  }, [])

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16 border-2 border-employee-lightest-gray">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Employee" />
            <AvatarFallback className="bg-employee-dark-blue text-employee-lightest-gray">
              {userInfo.firstName?.[0]}{userInfo.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-employee-lightest-gray">
              {userInfo.firstName} {userInfo.lastName}
            </h3>
            <p className="text-sm text-employee-lighter-gray">{userInfo.position}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/dashboard")}>
              <Link to="/tenant/employee/dashboard">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/leave-request")}>
              <Link to="/tenant/employee/leave-request">
                <Calendar className="h-5 w-5" />
                <span>Leave Requests</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/contract")}>
              <Link to="/tenant/employee/contract">
                <FileText className="h-5 w-5" />
                <span>My Contract</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/evaluation")}>
              <Link to="/tenant/employee/evaluation">
                <Star className="h-5 w-5" />
                <span>Evaluations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/payroll")}>
              <Link to="/tenant/employee/payroll">
                <Wallet className="h-5 w-5" />
                <span>Payroll History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/chat")}>
              <Link to="/tenant/employee/chat">
                <MessageSquare className="h-5 w-5" />
                <span>Team Chat</span>
                {unreadMessages > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/tenant/employee/notifications")}>
              <Link to="/tenant/employee/notifications">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-employee-lighter-gray hover:text-employee-lightest-gray">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <ModeToggle />
          <NotificationPopover />
          <Button variant="ghost" size="icon" className="text-employee-lighter-gray hover:text-employee-lightest-gray">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}