"use client"

import { useState } from "react"
import { ArrowUpDown, Download, Eye, MoreHorizontal, UserCheck, UserX } from "lucide-react"

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Sample data
const applicants = [
  {
    id: "APP-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    appliedDate: "May 10, 2025",
    experience: "5 years",
    status: "new",
  },
  {
    id: "APP-002",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 234-5678",
    appliedDate: "May 9, 2025",
    experience: "3 years",
    status: "reviewing",
  },
  {
    id: "APP-003",
    name: "Michael Williams",
    email: "michael.williams@example.com",
    phone: "+1 (555) 345-6789",
    appliedDate: "May 8, 2025",
    experience: "7 years",
    status: "shortlisted",
  },
  {
    id: "APP-004",
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    phone: "+1 (555) 456-7890",
    appliedDate: "May 7, 2025",
    experience: "4 years",
    status: "interviewing",
  },
  {
    id: "APP-005",
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "+1 (555) 567-8901",
    appliedDate: "May 6, 2025",
    experience: "6 years",
    status: "rejected",
  },
  {
    id: "APP-006",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 678-9012",
    appliedDate: "May 5, 2025",
    experience: "2 years",
    status: "new",
  },
]

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
  const [selectedApplicant, setSelectedApplicant] = useState<(typeof applicants)[0] | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search applicants..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
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
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No applicants found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.id}</TableCell>
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.experience}</TableCell>
                      <TableCell>{applicant.appliedDate}</TableCell>
                      <TableCell>{getStatusBadge(applicant.status)}</TableCell>
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
                                setSelectedApplicant(applicant)
                                setViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download CV</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                              <span>Shortlist</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4 text-red-500" />
                              <span>Reject</span>
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>
              Review the applicant's information and manage their application status.
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="mt-4">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={selectedApplicant.name} />
                  <AvatarFallback className="text-lg">
                    {selectedApplicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedApplicant.name}</h3>
                  <p className="text-muted-foreground">{selectedApplicant.email}</p>
                  <p className="text-muted-foreground">{selectedApplicant.phone}</p>
                  <div className="mt-2">{getStatusBadge(selectedApplicant.status)}</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                  <Button size="sm">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Change Status
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="profile" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="application">Application</TabsTrigger>
                  <TabsTrigger value="notes">HR Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>Full Name</Label>
                      <div className="rounded-md border p-2">{selectedApplicant.name}</div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="rounded-md border p-2">{selectedApplicant.email}</div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="rounded-md border p-2">{selectedApplicant.phone}</div>
                    </div>
                    <div>
                      <Label>Experience</Label>
                      <div className="rounded-md border p-2">{selectedApplicant.experience}</div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="application" className="mt-4 space-y-4">
                  <div>
                    <Label>Application Date</Label>
                    <div className="rounded-md border p-2">{selectedApplicant.appliedDate}</div>
                  </div>
                  <div>
                    <Label>Cover Letter</Label>
                    <div className="rounded-md border p-3">
                      <p>Dear Hiring Manager,</p>
                      <br />
                      <p>
                        I am writing to express my interest in the Senior Software Engineer position at your company.
                        With {selectedApplicant.experience} of experience in software development, I believe I would be
                        a valuable addition to your team.
                      </p>
                      <br />
                      <p>
                        Thank you for considering my application. I look forward to the opportunity to discuss how my
                        skills and experience align with your needs.
                      </p>
                      <br />
                      <p>
                        Sincerely,
                        <br />
                        {selectedApplicant.name}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="mt-4 space-y-4">
                  <div>
                    <Label>HR Notes</Label>
                    <Textarea
                      className="min-h-[150px]"
                      placeholder="Add notes about this candidate..."
                      defaultValue={
                        selectedApplicant.status === "shortlisted"
                          ? "Strong candidate with relevant experience. Technical skills match our requirements. Recommend proceeding to interview stage."
                          : ""
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Notes</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
