"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Check, Eye, MoreHorizontal, X } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Employee {
  id: string
  name: string
  avatar?: string
  initials: string
}

interface User {
  username: string;
  // Mund të shtoni fusha të tjera si `firstName`, `lastName`, etj.
}

interface UserTenant {
  userTenantId: number;
  username: string;       // Ka edhe username në userTenant
  firstName: string;      // Nga backend vjen firstName këtu
  lastName: string;       // Po ashtu lastName
  avatar?: string;
  user: User;
}


interface LeaveRequest {
  leaveRequestId: number;
  userTenant: UserTenant; // Tani `userTenant` ka një fushë `user`
  leaveText: string;
  startDate: string; // ISO string expected from backend
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  duration: string;
}


export function LeaveRequestsTable() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  // Fetch leave requests from backend
  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  // Funksioni për të marrë të dhënat nga backend
  async function fetchLeaveRequests() {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Tokeni nuk ekziston!")
      }
  
      // Dërgo kërkesën me tokenin në header
      const response = await axios.get("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/leave-request/", {
        headers: {
          Authorization: `Bearer ${token}`, // Dërgo tokenin në Authorization header
        },
      })
      const data = response.data
      // Përpunojmë data për të llogaritur duration në ditë
      const enriched = data.map((lr: any) => ({
        ...lr,
        duration: getDurationInDays(lr.startDate, lr.endDate),
      }))
      setLeaveRequests(enriched)
    } catch (err) {
      console.error(err)
      // mund të shtosh notifikim gabimi këtu
    }
  }

  // Funksioni për të llogaritur ditët midis datave
  function getDurationInDays(start: string, end: string) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1 // përfshin edhe ditën e fundit
    return diffDays + (diffDays === 1 ? " day" : " days")
  }

  // Filtrimi i kërkesave
  const filteredRequests = leaveRequests.filter((request) => {
    // Kontrolloni nëse `userTenant` dhe `username` janë të pranishme para se të përdorni `toLowerCase()`
    const matchesSearch =
      (request.userTenant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.leaveRequestId.toString().toLowerCase().includes(searchTerm.toLowerCase()));
  
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || request.leaveText.toLowerCase().includes(typeFilter.toLowerCase());
  
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Funksioni për të marrë badge për statusin
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-500 capitalize">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500 capitalize">Approved</Badge>
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500 capitalize">
            Rejected
          </Badge>
        )
      default:
        return <Badge className="capitalize">{status}</Badge>
    }
  }

  // Funksioni për të përditësuar statusin e kërkesës
  async function updateLeaveRequestStatus(id: number, status: string) {
    const leaveRequest = leaveRequests.find((lr) => lr.leaveRequestId === id)
    if (!leaveRequest) return
  
    const { duration, ...rest } = leaveRequest
    const updatedLeaveRequest = { ...rest, status }
  
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Tokeni nuk ekziston!")
  
      // Përditëso statusin
      const res = await axios.put(
        `http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/leave-request/${id}`,
        updatedLeaveRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const updatedLR = res.data
  
      // Dërgo POST për krijimin e notification-it
      if (status === "APPROVED" || status === "REJECTED") {
        const notificationPayload = {
          title: status === "APPROVED" ? "Leave Request Approved" : "Leave Request Rejected",
          description: `Your leave request from ${updatedLR.startDate} to ${updatedLR.endDate} was ${status.toLowerCase()}.`,
          userTenant: updatedLR.userTenant,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 ditë
        };
        
        await axios.post(
          "http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/notification",
          notificationPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
  
      // Përditëso listën në frontend
      setLeaveRequests((prev) => prev.map((lr) => (lr.leaveRequestId === id ? updatedLR : lr)))
      setApprovalComment("")
      setRejectionReason("")
    } catch (err) {
      console.error(err)
      // Shto notifikim gabimi në UI nëse dëshiron
    }
  }
  

  // Funksioni për të aprovuar kërkesën
  function handleApprove() {
    if (selectedRequest) {
      updateLeaveRequestStatus(selectedRequest.leaveRequestId, "APPROVED")
      setApproveDialogOpen(false)
      setSelectedRequest(null)
    }
  }

  // Funksioni për të refuzuar kërkesën
  function handleReject() {
    if (selectedRequest) {
      updateLeaveRequestStatus(selectedRequest.leaveRequestId, "REJECTED")
      setRejectDialogOpen(false)
      setSelectedRequest(null)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search requests..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="annual leave">Annual Leave</SelectItem>
                  <SelectItem value="sick leave">Sick Leave</SelectItem>
                  <SelectItem value="personal leave">Personal Leave</SelectItem>
                  <SelectItem value="maternity leave">Maternity Leave</SelectItem>
                  <SelectItem value="paternity leave">Paternity Leave</SelectItem>
                  <SelectItem value="unpaid leave">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Employee
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No leave requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.leaveRequestId}>
                      <TableCell className="font-medium">{request.leaveRequestId}</TableCell>
                      <TableCell>
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={request.userTenant.avatar || "/placeholder.svg"}
        alt={`${request.userTenant.firstName} ${request.userTenant.lastName}`}
      />
      <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
        {request.userTenant.firstName?.[0].toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
    <span>{request.userTenant.firstName} {request.userTenant.lastName}</span>
  </div>
</TableCell>
                      <TableCell className="capitalize">{request.leaveText}</TableCell>
                      <TableCell>{request.duration}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>From: {new Date(request.startDate).toLocaleDateString()}</span>
                          <span>To: {new Date(request.endDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(request)
                                setViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {request.status.toLowerCase() === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setApproveDialogOpen(true)
                                  }}
                                >
                                  <Check className="mr-2 h-4 w-4 text-green-500" />
                                  <span>Approve</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setRejectDialogOpen(true)
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4 text-red-500" />
                                  <span>Reject</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>View the details of the leave request.</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedRequest.userTenant.avatar || "/placeholder.svg"}
                    alt={selectedRequest.userTenant.firstName}
                  />
                  <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray">
                    {selectedRequest.userTenant.firstName.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRequest.userTenant.firstName}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedRequest.leaveRequestId}</p>
                </div>
                <div className="ml-auto">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Leave Type</Label>
                  <p className="text-sm capitalize">{selectedRequest.leaveText}</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="text-sm">{selectedRequest.duration}</p>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p className="text-sm">{new Date(selectedRequest.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-sm">{new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <Label>Reason</Label>
                <p className="text-sm">{selectedRequest.reason}</p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRequest?.status.toLowerCase() === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    setViewDialogOpen(false)
                    setRejectDialogOpen(true)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    setViewDialogOpen(false)
                    setApproveDialogOpen(true)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>Are you sure you want to approve this leave request?</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium">{selectedRequest.userTenant.firstName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.leaveText} • {selectedRequest.duration}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="approval-comment">Comment (Optional)</Label>
                <Textarea
                  id="approval-comment"
                  placeholder="Add any comments about this approval"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this leave request.</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium">{selectedRequest.userTenant.firstName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.leaveText} • {selectedRequest.duration}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Provide a reason for rejecting this request"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
