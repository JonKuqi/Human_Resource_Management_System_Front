"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Search, Trash2 } from 'lucide-react'
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
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
        },
        {
          notification_id: 4,
          user_tenant_id: 1,
          title: "Contract Updated",
          description: "Your employment contract has been updated. Please review the changes.",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          read: true
        },
        {
          notification_id: 5,
          user_tenant_id: 1,
          title: "Team Meeting Reminder",
          description: "Reminder: Team meeting tomorrow at 10:00 AM.",
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
          expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          read: true
        }
      ]
      
      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
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
      
      toast.success("Notification marked as read")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
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
      toast.error("Failed to mark all notifications as read")
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      // In a real app, you would delete the notification in your API
      // await axios.delete(`http://localhost:8081/api/v1/tenant/notifications/${notificationId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      
      // Update local state
      setNotifications(notifications.filter(notification => 
        notification.notification_id !== notificationId
      ))
      
      toast.success("Notification deleted")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter notifications based on filter and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && !notification.read) || 
      (filter === "read" && notification.read)
    
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">Notifications</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                Stay updated with important information and alerts
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notifications..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
              {notifications.some(n => !n.read) && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications found</h3>
              <p className="text-muted-foreground">
                {filter !== "all" 
                  ? `You don't have any ${filter} notifications.` 
                  : searchTerm 
                    ? "No notifications match your search." 
                    : "You don't have any notifications at this time."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`rounded-lg border p-4 ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.notification_id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.notification_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}