"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Department {
  departmentId: number
  name: string
}

interface Contract {
  userTenant: {
    userTenantId: number
  }
  position: {
    title: string
    department: {
      name: string
    }
  }
}

interface Employee {
  userTenantId: number
  firstName: string
  lastName: string
  phone: string
  profilePhoto?: string
  createdAt: string
  address: {
    country: string
    city: string
    street: string
    zip: string
  }
  user: {
    email: string
  }
  departmentName?: string
  positionTitle?: string
}

export function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const token = localStorage.getItem("token") || ""
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null
  const loggedInEmail = payload?.sub || ""

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userTenantRes, departmentRes, contractsRes] = await Promise.all([
          axios.get("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/user-tenant", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/department", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/contracts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const allUserTenants: Employee[] = userTenantRes.data
        const allContracts: Contract[] = contractsRes.data

        
        const visibleUserTenants = allUserTenants.filter(
          (e) => e.user.email !== loggedInEmail
        )

        const contractMap = new Map<number, Contract>()
        allContracts.forEach((c) => {
          contractMap.set(c.userTenant.userTenantId, c)
        })

        const enriched = visibleUserTenants.map((e) => {
          const contract = contractMap.get(e.userTenantId)
          return {
            ...e,
            departmentName: contract?.position?.department?.name ?? "-",
            positionTitle: contract?.position?.title ?? "-",
          }
        })

        setEmployees(enriched)
        setDepartments(departmentRes.data)
      } catch (err) {
        toast.error("Failed to load data")
      }
    }

    fetchAllData()
  }, [token])

  const filteredEmployees = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      e.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      departmentFilter === "all" ||
      e.departmentName?.toLowerCase() === departmentFilter.toLowerCase()
    return matchesSearch && matchesDepartment
  })

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/user-tenant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEmployees((prev) => prev.filter((e) => e.userTenantId !== id))
      toast.success("Employee deleted")
    } catch (err) {
      toast.error("Failed to delete employee")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search employees..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.departmentId} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((e, i) => (
                  <TableRow key={e.userTenantId}>
                    <TableCell className="font-medium">{`EMP-${String(i + 1).padStart(3, "0")}`}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{`${e.firstName} ${e.lastName}`}</span>
                        <span className="text-xs text-muted-foreground">{e.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{e.departmentName}</TableCell>
                    <TableCell>{e.positionTitle}</TableCell>
                    <TableCell>{new Date(e.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(e.userTenantId)}>
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
      <ToastContainer />
    </Card>
    
  )
}
