"use client"

import { useState } from "react"
import { ArrowUpDown, Check, Eye, MoreHorizontal, X } from "lucide-react"

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

// Sample data
const leaveRequests = [
  {
    id: "LR-001",
    employee: {
      id: "EMP-001",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    type: "Annual Leave",
    startDate: "May 20, 2025",
    endDate: "May 25, 2025",
    duration: "5 days",
    reason: "Family vacation",
    status: "pending",
  },
  {
    id: "LR-002",
    employee: {
      id: "EMP-002",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    type: "Sick Leave",
    startDate: "May 15, 2025",
    endDate: "May 16, 2025",
    duration: "2 days",
    reason: "Doctor's appointment",
    status: "approved",
  },
  {
    id: "LR-003",
    employee: {
      id: "EMP-003",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    type: "Personal Leave",
    startDate: "May 18, 2025",
    endDate: "May 18, 2025",
    duration: "1 day",
    reason: "Personal matters",
    status: "pending",
  },
  {
    id: "LR-004",
    employee: {
      id: "EMP-005",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DW",
    },
    type: "Annual Leave",
    startDate: "Jun 1, 2025",
    endDate: "Jun 10, 2025",
    duration: "10 days",
    reason: "Summer vacation",
    status: "pending",
  },
  {
    id: "LR-005",
    employee: {
      id: "EMP-006",
      name: "Jessica Miller",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JM",
    },
    type: "Sick Leave",
    startDate: "May 12, 2025",
    endDate: "May 13, 2025",
    duration: "2 days",
    reason: "Not feeling well",
    status: "rejected",
  },
]

export function LeaveRequestsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<(typeof leaveRequests)[0] | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type.toLowerCase().includes(typeFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Rejected
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleApprove = () => {
    console.log("Approved request:", selectedRequest?.id, "Comment:", approvalComment)
    setApproveDialogOpen(false)
    setApprovalComment("")
    // Here you would typically update the status in your API
  }

  const handleReject = () => {
    console.log("Rejected request:", selectedRequest?.id, "Reason:", rejectionReason)
    setRejectDialogOpen(false)
    setRejectionReason("")
    // Here you would typically update the status in your API
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
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
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
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={request.employee.avatar || "/placeholder.svg"}
                              alt={request.employee.name}
                            />
                            <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                              {request.employee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{request.employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.duration}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">From: {request.startDate}</span>
                          <span className="text-xs text-muted-foreground">To: {request.endDate}</span>
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
                            {request.status === "pending" && (
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
                    src={selectedRequest.employee.avatar || "/placeholder.svg"}
                    alt={selectedRequest.employee.name}
                  />
                  <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray">
                    {selectedRequest.employee.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRequest.employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
                </div>
                <div className="ml-auto">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Leave Type</Label>
                  <p className="text-sm">{selectedRequest.type}</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="text-sm">{selectedRequest.duration}</p>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p className="text-sm">{selectedRequest.startDate}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-sm">{selectedRequest.endDate}</p>
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
            {selectedRequest?.status === "pending" && (
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
                  <h3 className="font-medium">{selectedRequest.employee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.type} • {selectedRequest.duration}
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
                  <h3 className="font-medium">{selectedRequest.employee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.type} • {selectedRequest.duration}
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
