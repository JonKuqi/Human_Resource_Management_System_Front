"use client"

import { useState, useEffect } from "react"
import { Download, Info } from 'lucide-react'
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"

interface Contract {
  contractId: number
  userTenant: { userTenantId: number }
  position: {
    title: string
  }
  contractType: string
  startDate: string
  endDate: string | null
  salary: number
  terms: string
  createdAt: string
}

interface DecodedToken {
  user_tenant_id: number
  role: string
}

function parseJwt(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export default function ContractPage() {
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContract()
  }, [])

  const fetchContract = async () => {
    try {
      const token = localStorage.getItem("token")
      const payload = token ? parseJwt(token) : null
      const userTenantId = payload?.user_tenant_id

      if (!token || !userTenantId) {
        throw new Error("Authentication token not found")
      }

      const response = await axios.get(`http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/contracts/filter?userTenant.userTenantId=${userTenantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = response.data
      if (data && data.length > 0) {
        setContract(data[0])
      } else {
        setContract(null)
      }
    } catch (error) {
      console.error("Error fetching contract:", error)
      toast.error("Failed to load contract details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const downloadContract = () => {
    if (!contract) return
    toast.info("Downloading contract document...")
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">My Contract</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">My Contract</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Contract Found</CardTitle>
            <CardDescription>
              You don't have an active contract in the system. Please contact HR for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">My Contract</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Employment Contract</CardTitle>
              <CardDescription>Contract ID: {contract.contractId}</CardDescription>
            </div>
            <Button variant="outline" onClick={downloadContract}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
              <p className="text-lg font-medium">{contract.position?.title || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contract Type</h3>
              <p className="text-lg font-medium">{contract.contractType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
              <p className="text-lg font-medium">{formatDate(contract.startDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
              <p className="text-lg font-medium">
                {contract.endDate ? formatDate(contract.endDate) : "Permanent"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Created On</h3>
              <p className="text-lg font-medium">{formatDate(contract.createdAt)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Compensation</h3>
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Annual Salary:</span>
                <span className="text-xl font-bold">{formatCurrency(contract.salary)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Terms and Conditions</h3>
            <div className="bg-muted p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-sans">{contract.terms}</pre>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <p className="text-sm text-blue-700">
              If you have any questions about your contract, please contact the HR department.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}