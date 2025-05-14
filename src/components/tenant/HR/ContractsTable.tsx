"use client"

import { useState } from "react"
import { ArrowUpDown, Download, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

// Sample data
const contracts = [
  {
    id: "CON-001",
    employee: {
      id: "EMP-001",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    position: "Senior Developer",
    department: "Engineering",
    type: "Permanent",
    startDate: "Jan 15, 2023",
    endDate: null,
    salary: "$85,000",
    status: "active",
  },
  {
    id: "CON-002",
    employee: {
      id: "EMP-002",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    position: "UI/UX Designer",
    department: "Design",
    type: "Permanent",
    startDate: "Mar 10, 2023",
    endDate: null,
    salary: "$75,000",
    status: "active",
  },
  {
    id: "CON-003",
    employee: {
      id: "EMP-003",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    position: "Marketing Specialist",
    department: "Marketing",
    type: "Fixed Term",
    startDate: "Apr 22, 2023",
    endDate: "Apr 21, 2025",
    salary: "$65,000",
    status: "active",
  },
  {
    id: "CON-004",
    employee: {
      id: "EMP-004",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    position: "HR Coordinator",
    department: "HR",
    type: "Permanent",
    startDate: "Jun 5, 2023",
    endDate: null,
    salary: "$70,000",
    status: "active",
  },
  {
    id: "CON-005",
    employee: {
      id: "EMP-005",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DW",
    },
    position: "Financial Analyst",
    department: "Finance",
    type: "Contract",
    startDate: "Aug 17, 2023",
    endDate: "Feb 16, 2025",
    salary: "$90,000",
    status: "active",
  },
  {
    id: "CON-006",
    employee: {
      id: "EMP-006",
      name: "Jessica Miller",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JM",
    },
    position: "Sales Representative",
    department: "Sales",
    type: "Probation",
    startDate: "Oct 3, 2023",
    endDate: "Jan 2, 2024",
    salary: "$60,000",
    status: "expired",
  },
]

export function ContractsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContract, setSelectedContract] = useState<(typeof contracts)[0] | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || contract.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search contracts..."
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
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="fixed term">Fixed Term</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="probation">Probation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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
                  <TableHead>Position</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No contracts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={contract.employee.avatar || "/placeholder.svg"}
                              alt={contract.employee.name}
                            />
                            <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                              {contract.employee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{contract.employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{contract.position}</TableCell>
                      <TableCell>{contract.type}</TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={contract.status === "active" ? "default" : "outline"}
                          className={contract.status === "active" ? "bg-green-500" : "border-red-500 text-red-500"}
                        >
                          {contract.status === "active" ? "Active" : "Expired"}
                        </Badge>
                      </TableCell>
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
                                setSelectedContract(contract)
                                setViewDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download Contract</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/contracts/${contract.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
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

      {/* View Contract Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>View the details of the employee contract.</DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedContract.employee.avatar || "/placeholder.svg"}
                    alt={selectedContract.employee.name}
                  />
                  <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray">
                    {selectedContract.employee.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedContract.employee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedContract.position} • {selectedContract.department}
                  </p>
                </div>
                <div className="ml-auto">{selectedContract.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract Type</Label>
                  <p className="text-sm font-medium">{selectedContract.type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedContract.status === "active" ? "default" : "outline"}
                      className={selectedContract.status === "active" ? "bg-green-500" : "border-red-500 text-red-500"}
                    >
                      {selectedContract.status === "active" ? "Active" : "Expired"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p className="text-sm font-medium">{selectedContract.startDate}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-sm font-medium">{selectedContract.endDate || "N/A"}</p>
                </div>
                <div>
                  <Label>Salary</Label>
                  <p className="text-sm font-medium">{selectedContract.salary}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-sm font-medium">{selectedContract.department}</p>
                </div>
              </div>

              <div>
                <Label>Contract Terms</Label>
                <div className="mt-2 rounded-md border p-4 text-sm">
                  <p>This employment contract is made between the Company and the Employee named above.</p>
                  <br />
                  <p>
                    The Employee agrees to perform duties as assigned by the Company in accordance with Company policies
                    and procedures.
                  </p>
                  <br />
                  <p>
                    The Employee will receive the salary stated above, paid on a monthly basis, subject to applicable
                    tax and other withholdings.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {selectedContract?.status === "active" && (
              <Button asChild>
                <Link href={`/dashboard/contracts/${selectedContract.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
