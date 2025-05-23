"use client"

import { useState, useEffect } from "react"
import { Bell, Check } from 'lucide-react'
import axios from "axios"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-toastify"

interface Notification {
  notification_id: number
  user_tenant_id: number
  title: string
  description: string
  created_at: string
  expires_at: string
  read?: boolean
}

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      // In a real app, you would fetch notifications from your API
      // const response = await axios.get("http://localhost:8081/api/v1/tenant/notifications", {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      
      // Mock notifications for demonstration
      const mockNotifications: Notification[] = [
        {
          notification_id: 1,
          user_tenant_id: 1,
          title: "Leave Request Approved",
          description: "Your leave request for June 10-15 has been approved.",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          read: false
        },
        {
          notification_id: 2,
          user_tenant_id: 1,
          title: "New Evaluation Assigned",
          description: "You have been assigned to evaluate Michael Chen.",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          read: false
        },
        {
          notification_id: 3,
          user_tenant_id: 1,
          title: "Payslip Available",
          description: "Your payslip for May 2025 is now available.",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          read: true
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      // In a real app, you would update the notification status in your API
      // await axios.put(`http://localhost:8081/api/v1/tenant/notifications/${notificationId}/read`, {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.notification_id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      // In a real app, you would update all notifications in your API
      // await axios.put("http://localhost:8081/api/v1/tenant/notifications/read-all", {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-employee-lighter-gray hover:text-employee-lightest-gray">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`flex flex-col p-4 ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-end mt-2"
                      onClick={() => markAsRead(notification.notification_id)}
                    >
                      Mark as read
                    </Button>
                  )}
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/tenant/employee/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}