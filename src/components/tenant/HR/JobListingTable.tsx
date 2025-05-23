"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"



interface JobListing {
  jobListingId: number
  jobTitle: string
  location: string
  employmentType: string
  createdAt: string
  validUntil: string
  tenant: {
    tenantId: string
    name: string
  }
}

interface DecodedToken {
  tenantId: string
  [key: string]: any
}

export function JobListingsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)

  const handleDelete = async (jobId: number) => {
  const confirmed = window.confirm("Are you sure you want to delete this job listing?");
  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/job-listing/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setJobListings((prev) => prev.filter((j) => j.jobListingId !== jobId));
    } else {
      const err = await res.text();
      console.error("Delete failed:", err);
      alert("Failed to delete job.");
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    alert("Something went wrong.");
  }
};

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        const decoded = jwtDecode<DecodedToken>(token)
        console.log("Decoded token:", decoded)
        const schema = decoded.tenant
        const tenantResponse = await fetch(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/tenant/filter?schemaName=${schema}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

const tenantData = await tenantResponse.json()
console.log("tenantData: ",tenantData)
const tenantId = tenantData[0].tenantId

        console.log("Tenant id:", tenantId)

        console.log("Decoded id:", tenantId)

        const res = await fetch(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/job-listing/filter?tenant.id=${tenantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        setJobListings(data)
      } catch (err) {
        console.error("Error fetching job listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobListings()
  }, [])

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())

    const isExpired = new Date(job.validUntil) < new Date()
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !isExpired) ||
      (statusFilter === "expired" && isExpired)

    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <Input
            placeholder="Search jobs..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Job Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No job listings found.</TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => {
                  const isExpired = new Date(job.validUntil) < new Date()
                  return (
                    <TableRow key={job.jobListingId}>
                      <TableCell className="font-medium">{job.jobListingId}</TableCell>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.employmentType}</TableCell>
                      <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(job.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={isExpired ? "secondary" : "default"}
                          className={isExpired ? "bg-gray-500" : "bg-green-500"}
                        >
                          {isExpired ? "Expired" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              {/* <Link href={`/tenant/HR/job/${job.jobListingId}`}> */}
                              <Link to={`/tenant/hr/job-applicants/${job.jobListingId}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Applicants
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/jobs/${job.jobListingId}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(job.jobListingId)}
                                      >
                                <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
