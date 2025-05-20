"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, Download, Eye, MoreHorizontal, UserCheck, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Applicant {
  applicationId: number
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  experience: string
  status: string
  timeOfApplication: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500">New</Badge>
    case "reviewing":
      return <Badge className="bg-purple-500">Reviewing</Badge>
    case "shortlisted":
      return <Badge className="bg-green-500">Shortlisted</Badge>
    case "interviewing":
      return <Badge className="bg-yellow-500">Interviewing</Badge>
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

export function ApplicantsTable({ jobId }: { jobId: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        const response = await fetch(`/api/v1/tenant/application?jobListingId=${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setApplicants(data)
      } catch (error) {
        console.error("Error fetching applicants:", error)
      }
    }

    if (jobId) {
      fetchApplicants()
    }
  }, [jobId])

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <Input
              placeholder="Search applicants..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">No applicants found.</TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.applicationId}>
                      <TableCell className="font-medium">{applicant.applicationId}</TableCell>
                      <TableCell>{applicant.applicantName}</TableCell>
                      <TableCell>{applicant.applicantEmail}</TableCell>
                      <TableCell>{applicant.experience}</TableCell>
                      <TableCell>{new Date(applicant.timeOfApplication).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedApplicant(applicant)
                                setViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>Review the applicant's information.</DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="mt-4 space-y-4">
              <div>
                <Label>Full Name</Label>
                <div className="rounded-md border p-2">{selectedApplicant.applicantName}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="rounded-md border p-2">{selectedApplicant.applicantEmail}</div>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="rounded-md border p-2">{selectedApplicant.applicantPhone}</div>
              </div>
              <div>
                <Label>Experience</Label>
                <div className="rounded-md border p-2">{selectedApplicant.experience}</div>
              </div>
              <div>
                <Label>Application Date</Label>
                <div className="rounded-md border p-2">{new Date(selectedApplicant.timeOfApplication).toLocaleString()}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
