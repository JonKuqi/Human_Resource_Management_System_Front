"use client"

import { useState } from "react"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data
const evaluations = [
  {
    id: "EVAL-001",
    employee: {
      id: "EMP-001",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    evaluator: {
      id: "EMP-004",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    period: "Q1 2025",
    createdAt: "Apr 15, 2025",
    status: "completed",
    score: 4.2,
  },
  {
    id: "EVAL-002",
    employee: {
      id: "EMP-002",
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    evaluator: {
      id: "EMP-004",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    period: "Q1 2025",
    createdAt: "Apr 16, 2025",
    status: "completed",
    score: 4.5,
  },
  {
    id: "EVAL-003",
    employee: {
      id: "EMP-003",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    evaluator: {
      id: "EMP-004",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    period: "Q1 2025",
    createdAt: "Apr 17, 2025",
    status: "in-progress",
    score: null,
  },
  {
    id: "EVAL-004",
    employee: {
      id: "EMP-005",
      name: "David Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DW",
    },
    evaluator: {
      id: "EMP-004",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
    },
    period: "Q1 2025",
    createdAt: "Apr 18, 2025",
    status: "pending",
    score: null,
  },
]

export function PerformanceEvaluationList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.period.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || evaluation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search evaluations..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                <TableHead>Evaluator</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No evaluations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={evaluation.employee.avatar || "/placeholder.svg"}
                            alt={evaluation.employee.name}
                          />
                          <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                            {evaluation.employee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{evaluation.employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={evaluation.evaluator.avatar || "/placeholder.svg"}
                            alt={evaluation.evaluator.name}
                          />
                          <AvatarFallback className="bg-hr-dark-blue text-hr-lightest-gray text-xs">
                            {evaluation.evaluator.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{evaluation.evaluator.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{evaluation.period}</TableCell>
                    <TableCell>{evaluation.createdAt}</TableCell>
                    <TableCell>
                      <Badge
                        variant={evaluation.status === "completed" ? "default" : "outline"}
                        className={
                          evaluation.status === "completed"
                            ? "bg-green-500"
                            : evaluation.status === "in-progress"
                              ? "border-blue-500 text-blue-500"
                              : "border-yellow-500 text-yellow-500"
                        }
                      >
                        {evaluation.status === "completed"
                          ? "Completed"
                          : evaluation.status === "in-progress"
                            ? "In Progress"
                            : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {evaluation.score !== null ? (
                        <div className="flex items-center">
                          <span className="font-medium">{evaluation.score}</span>
                          <span className="text-xs text-muted-foreground">/5</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/performance/${evaluation.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/performance/${evaluation.id}/edit`}>
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
  )
}
