"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { jwtDecode } from "jwt-decode"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface EvaluationForm {
  id: number
  fromUserTenantId: number
  toUserTenantId: number
  createdAt: string
}

interface DecodedToken {
  user_tenant_id: number
  sub: string // email
}

interface UserTenant {
  userTenantId: number
  user: {
    email: string
  }
}

export function PerformanceEvaluationList() {
  const [evaluations, setEvaluations] = useState<EvaluationForm[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userTenantEmailMap, setUserTenantEmailMap] = useState<Record<number, string>>({})

  const token = localStorage.getItem("token") || ""

  useEffect(() => {
    async function fetchEvaluations() {
      setLoading(true)
      try {
        if (!token) throw new Error("No token found")

        const decoded: DecodedToken = jwtDecode(token)
        setUserEmail(decoded.sub)

        const res = await fetch("http://localhost:8081/api/v1/tenant/evaluation-forms", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch evaluations")

        const data: EvaluationForm[] = await res.json()
        setEvaluations(data)

        
        const ids = Array.from(
          new Set(data.flatMap((e) => [e.fromUserTenantId, e.toUserTenantId]))
        )

        const emailMap: Record<number, string> = {}
        await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(
                `http://localhost:8081/api/v1/tenant/user-tenant/filter?userTenantId=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              )
              const json: UserTenant[] = await res.json()
              if (json[0]?.user?.email) {
                emailMap[id] = json[0].user.email
              }
            } catch {}
          })
        )
        setUserTenantEmailMap(emailMap)
      } catch (error) {
        console.error(error)
        toast.error("Failed to load evaluations")
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluations()
  }, [token])

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const employeeEmail = userTenantEmailMap[evaluation.toUserTenantId]?.toLowerCase() || ""
    return employeeEmail.includes(searchTerm.toLowerCase())
  })

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this evaluation?")) return

    try {
      const res = await fetch(`http://localhost:8081/api/v1/tenant/evaluation-forms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to delete evaluation")

      setEvaluations((prev) => prev.filter((e) => e.id !== id))
      toast.success("Evaluation deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete evaluation")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search evaluations..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Employee Email</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No evaluations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{evaluation.id}</TableCell>
                    <TableCell>{userTenantEmailMap[evaluation.toUserTenantId] || "-"}</TableCell>
                    <TableCell>{userTenantEmailMap[evaluation.fromUserTenantId] || "-"}</TableCell>
                    <TableCell>{new Date(evaluation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDelete(evaluation.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

        <ToastContainer />
      </CardContent>
    </Card>
  )
}
