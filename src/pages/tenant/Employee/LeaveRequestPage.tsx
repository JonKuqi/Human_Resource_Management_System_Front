"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from "date-fns"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeaveRequest {
  leaveRequestId: number
  userTenant: { userTenantId: number }
  leaveText: string
  startDate: string
  endDate: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  reason: string
  createdAt: string
}

interface DecodedToken {
  role: string
  user_tenant_id: number
}

function parseJwt(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export default function LeaveRequestPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("new")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leaveText, setLeaveText] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState("")
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const token = localStorage.getItem("token")
  const payload = token ? parseJwt(token) : null
  const userTenantId = payload?.user_tenant_id

  useEffect(() => {
    if (activeTab === "history") {
      fetchLeaveRequests()
    }
  }, [activeTab])

  const fetchLeaveRequests = async () => {
    setIsLoading(true)
    try {
      if (!token || !userTenantId) throw new Error("Authentication token not found")
      const response = await axios.get(`http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/leave-request/filter?userTenant.userTenantId=${userTenantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeaveRequests(response.data)
    } catch (error) {
      console.error("Error fetching leave requests:", error)
      toast.error("Failed to load leave request history")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return null
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const days = calculateDays()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leaveText || !startDate || !endDate || !reason || !userTenantId) {
      toast.error("Please fill in all required fields")
      return
    }
    if (startDate > endDate) {
      toast.error("End date cannot be before start date")
      return
    }

    setIsSubmitting(true)
    try {
      const leaveRequest = {
        leaveText: leaveText,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: reason,
        status: "PENDING",
        userTenant: {
          userTenantId: userTenantId
        }
      }

      await axios.post("http://localhost:8081/api/v1/tenant/leave-request/", leaveRequest, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success("Leave request submitted successfully")
      setLeaveText("")
      setStartDate(undefined)
      setEndDate(undefined)
      setReason("")
      setActiveTab("history")
    } catch (error) {
      console.error("Error submitting leave request:", error)
      toast.error("Failed to submit leave request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <Badge className="bg-yellow-500 capitalize">Pending</Badge>
      case "approved": return <Badge className="bg-green-500 capitalize">Approved</Badge>
      case "rejected": return <Badge variant="outline" className="text-red-500 border-red-500 capitalize">Rejected</Badge>
      default: return <Badge className="capitalize">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">Leave Requests</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="new">New Request</TabsTrigger>
          <TabsTrigger value="history">Request History</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Leave Request</CardTitle>
              <CardDescription>Fill out the form below to submit a new leave request. All fields are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="leave-type">Leave Type</Label>
                  <Select value={leaveText} onValueChange={setLeaveText} required>
                    <SelectTrigger id="leave-type">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                      <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                      <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                      <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" id="start-date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" id="end-date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date < (startDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                {days && (
                  <div className="flex items-center p-4 bg-muted rounded-md">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      Duration: <strong>{days} day{days !== 1 ? "s" : ""}</strong>
                    </span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-dark-blue-gray hover:bg-dark-blue-hover text-white"type="submit" disabled={isSubmitting || !leaveText || !startDate || !endDate || !reason}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
       <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Leave Request History</CardTitle>
              <CardDescription>
                View the status and details of your previous leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading leave requests...</p>
                </div>
              ) : leaveRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <h3 className="text-lg font-medium">No leave requests found</h3>
                  <p className="text-muted-foreground">
                    You haven't submitted any leave requests yet.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow key={request.leaveRequestId}>
                          <TableCell className="font-medium">{request.leaveRequestId}</TableCell>
                          <TableCell>{request.leaveText}</TableCell>
                          <TableCell>{formatDate(request.startDate)}</TableCell>
                          <TableCell>{formatDate(request.endDate)}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={request.reason}>
                            {request.reason}
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
