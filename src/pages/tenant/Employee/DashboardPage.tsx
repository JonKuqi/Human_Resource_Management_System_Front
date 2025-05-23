"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Download, FileText, MessageSquare, Star, Wallet } from 'lucide-react'
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-toastify"

interface Notification {
  id: string
  title: string
  description: string
  date: string
  read: boolean
}

interface LeaveBalance {
  type: string
  used: number
  total: number
  color: string
}

export default function DashboardPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Leave Request Approved",
        description: "Your leave request for June 10-15 has been approved.",
        date: "2 hours ago",
        read: false,
      },
      {
        id: "2",
        title: "New Evaluation Assigned",
        description: "You have been assigned to evaluate Michael Chen.",
        date: "Yesterday",
        read: false,
      },
      {
        id: "3",
        title: "Payslip Available",
        description: "Your payslip for May 2025 is now available.",
        date: "3 days ago",
        read: true,
      },
    ]
    setNotifications(mockNotifications)

    // Simulate fetching leave balances
    const mockLeaveBalances: LeaveBalance[] = [
      { type: "Annual Leave", used: 5, total: 20, color: "bg-blue-500" },
      { type: "Sick Leave", used: 2, total: 10, color: "bg-red-500" },
      { type: "Personal Leave", used: 1, total: 5, color: "bg-green-500" },
    ]
    setLeaveBalances(mockLeaveBalances)

    // Simulate fetching upcoming events
    const mockEvents = [
      {
        id: "1",
        title: "Team Meeting",
        date: "Today, 2:00 PM",
        type: "meeting",
      },
      {
        id: "2",
        title: "Project Deadline",
        date: "Tomorrow, 5:00 PM",
        type: "deadline",
      },
      {
        id: "3",
        title: "Performance Review",
        date: "June 15, 10:00 AM",
        type: "review",
      },
    ]
    setUpcomingEvents(mockEvents)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    )
    toast.success("All notifications marked as read")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-employee-darker-blue">Employee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Welcome Back, John!</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="John Doe" />
                <AvatarFallback className="bg-employee-dark-blue text-employee-lightest-gray">JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-muted-foreground">Software Developer • Engineering Department</p>
                <p className="text-sm text-muted-foreground mt-1">Employee ID: EMP-2023-001</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-8 w-8 text-employee-dark-blue mb-2" />
                  <h3 className="font-medium">Working Hours</h3>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 text-employee-dark-blue mb-2" />
                  <h3 className="font-medium">Next Holiday</h3>
                  <p className="text-sm text-muted-foreground">June 19, 2025</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Wallet className="h-8 w-8 text-employee-dark-blue mb-2" />
                  <h3 className="font-medium">Next Payday</h3>
                  <p className="text-sm text-muted-foreground">June 15, 2025</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Leave Balances</CardTitle>
            <CardDescription>Your available leave days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveBalances.map((leave) => (
              <div key={leave.type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{leave.type}</span>
                  <span className="font-medium">
                    {leave.used} / {leave.total} days
                  </span>
                </div>
                <Progress
                  value={(leave.used / leave.total) * 100}
                  className={`h-2 ${leave.color}`}
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/tenant/employee/leave-request">
                <Calendar className="mr-2 h-4 w-4" />
                Request Leave
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              {notifications.some((n) => !n.read) && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No notifications at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-3 rounded-lg ${
                      !notification.read ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tenant/employee/leave-request">
                <Calendar className="mr-2 h-4 w-4" />
                Request Leave
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tenant/employee/contract">
                <FileText className="mr-2 h-4 w-4" />
                View Contract
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tenant/employee/payroll">
                <Download className="mr-2 h-4 w-4" />
                Download Latest Payslip
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tenant/employee/evaluation">
                <Star className="mr-2 h-4 w-4" />
                Complete Evaluations
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tenant/employee/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Team Chat
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your schedule for the next few days</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No upcoming events at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="rounded-full bg-muted p-2">
                        {event.type === "meeting" ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : event.type === "deadline" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}