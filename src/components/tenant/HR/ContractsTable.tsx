"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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

interface UserTenant {
  userTenantId: number
  firstName: string
  lastName: string
  profilePhoto?: string | null
}

interface Position {
  positionId: number
  title: string
  description: string
}

interface Contract {
  contractId: number
  userTenant: UserTenant
  position: Position
  contractType: string
  startDate: string
  endDate: string | null
  salary: number
  terms: string
  createdAt: string
}

export function ContractsTable() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [editedContract, setEditedContract] = useState<Contract | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Tokeni nuk ekziston!")

      const response = await axios.get("http://localhost:8081/api/v1/tenant/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setContracts(response.data)
      setLoading(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Unknown error occurred")
      }
      setLoading(false)
    }
  }

  const deleteContract = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Tokeni nuk ekziston!")

      await axios.delete(`http://localhost:8081/api/v1/tenant/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setContracts((prev) => prev.filter((c) => c.contractId !== id))
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const saveEditedContract = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Tokeni nuk ekziston!")

      await axios.put(
        `http://localhost:8081/api/v1/tenant/contracts/${editedContract?.contractId}`,
        editedContract,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setContracts((prev) =>
        prev.map((c) => (c.contractId === editedContract?.contractId ? editedContract! : c))
      )
      setIsEditing(false)
      setSelectedContract(editedContract)
    } catch (err) {
      console.error("Save error:", err)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const filteredContracts = contracts.filter((contract) => {
    const fullName = `${contract.userTenant.firstName} ${contract.userTenant.lastName}`
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.position?.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      typeFilter === "all" || contract.contractType.toLowerCase() === typeFilter.toLowerCase()

    const isExpired = contract.endDate && new Date(contract.endDate) < new Date()
    const contractStatus = isExpired ? "expired" : "active"
    const matchesStatus = statusFilter === "all" || contractStatus === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) return <p>Loading contracts...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <Input
              placeholder="Search contracts..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <TableHead>Employee</TableHead>
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
                  filteredContracts.map((contract) => {
                    const fullName = `${contract.userTenant.firstName} ${contract.userTenant.lastName}`
                    const initials = `${contract.userTenant.firstName[0] ?? ""}${contract.userTenant.lastName[0] ?? ""}`
                    const isExpired = contract.endDate && new Date(contract.endDate) < new Date()
                    const status = isExpired ? "expired" : "active"

                    return (
                      <TableRow key={contract.contractId}>
                        <TableCell className="font-medium">{contract.contractId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={"/placeholder.svg"}
                                alt={fullName}
                              />
                              <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span>{fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{contract.position.title}</TableCell>
                        <TableCell>{contract.contractType}</TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={status === "active" ? "default" : "outline"}
                            className={status === "active" ? "bg-green-500" : "border-red-500 text-red-500"}
                          >
                            {status === "active" ? "Active" : "Expired"}
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
                              <DropdownMenuItem onClick={() => {
  setSelectedContract(contract);
  setEditedContract({ ...contract });
  setIsEditing(false);
  setViewDialogOpen(true);
}}>

                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download Contract</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/contracts/${contract.contractId}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteContract(contract.contractId)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
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
          {/* View Contract Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>View the details of the employee contract.</DialogDescription>
          </DialogHeader>

          {selectedContract && editedContract && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={"/placeholder.svg"}
                    alt={`${editedContract.userTenant.firstName} ${editedContract.userTenant.lastName}`}
                  />
                  <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray">
                    {`${editedContract.userTenant.firstName[0]}${editedContract.userTenant.lastName[0]}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {editedContract.userTenant.firstName} {editedContract.userTenant.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {editedContract.position.title}
                  </p>
                </div>
                <div className="ml-auto">{editedContract.contractId}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract Type</Label>
                  {isEditing ? (
                    <Input
                      value={editedContract.contractType}
                      onChange={(e) =>
                        setEditedContract({ ...editedContract, contractType: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{editedContract.contractType}</p>
                  )}
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    {(() => {
                      const isExpired =
                        editedContract.endDate && new Date(editedContract.endDate) < new Date()
                      const status = isExpired ? "expired" : "active"
                      return (
                        <Badge
                          variant={status === "active" ? "default" : "outline"}
                          className={status === "active" ? "bg-green-500" : "border-red-500 text-red-500"}
                        >
                          {status === "active" ? "Active" : "Expired"}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>
                <div>
                  <Label>Start Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedContract.startDate}
                      onChange={(e) =>
                        setEditedContract({ ...editedContract, startDate: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{editedContract.startDate}</p>
                  )}
                </div>
                <div>
                  <Label>End Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedContract.endDate || ""}
                      onChange={(e) =>
                        setEditedContract({ ...editedContract, endDate: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">{editedContract.endDate || "N/A"}</p>
                  )}
                </div>
                <div>
                  <Label>Salary</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedContract.salary}
                      onChange={(e) =>
                        setEditedContract({ ...editedContract, salary: Number(e.target.value) })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium">${editedContract.salary.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <Label>Position Description</Label>
                  <p className="text-sm font-medium">{editedContract.position.description}</p>
                </div>
              </div>

              <div>
                <Label>Contract Terms</Label>
                {isEditing ? (
                  <textarea
                    className="w-full rounded border p-2 text-sm"
                    rows={4}
                    value={editedContract.terms}
                    onChange={(e) =>
                      setEditedContract({ ...editedContract, terms: e.target.value })
                    }
                  />
                ) : (
                  <div className="mt-2 rounded-md border p-4 text-sm">
                    <p>{editedContract.terms}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {isEditing ? (
              <Button variant="secondary" onClick={saveEditedContract}>

                 Save
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
