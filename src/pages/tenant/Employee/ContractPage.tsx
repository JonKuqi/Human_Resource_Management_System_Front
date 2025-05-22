"use client"

import { useState, useEffect } from "react"
import { Download, FileText, Info } from 'lucide-react'
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"

interface Contract {
  contract_id: number
  user_tenant_id: number
  position_id: number
  contract_type: string
  start_date: string
  end_date: string | null
  salary: number
  terms: string
  created_at: string
  position?: {
    title: string
    department: string
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
      
      if (!token) {
        throw new Error("Authentication token not found")
      }
      
      // In a real app, you would fetch contract from your API
      // const response = await axios.get("http://localhost:8081/api/v1/tenant/contract/employee", {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // })
      
      // Mock contract for demonstration
      const mockContract: Contract = {
        contract_id: 1,
        user_tenant_id: 1,
        position_id: 2,
        contract_type: "Permanent",
        start_date: "2023-01-15",
        end_date: null,
        salary: 75000,
        terms: `
          1. Working Hours: 40 hours per week, Monday to Friday, 9:00 AM to 5:00 PM.
          2. Probation Period: 3 months from the start date.
          3. Notice Period: 1 month written notice required for termination by either party.
          4. Benefits:
             - Health insurance
             - 401(k) retirement plan with 4% employer match
             - 20 days annual leave
             - 10 days sick leave
          5. Confidentiality: Employee agrees to maintain confidentiality of company information.
        `,
        created_at: "2023-01-10T10:30:00Z",
        position: {
          title: "Software Developer",
          department: "Engineering"
        }
      }
      
      setContract(mockContract)
    } catch (error) {
      console.error("Error fetching contract:", error)
      toast.error("Failed to load contract details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const downloadContract = () => {
    if (!contract) return
    
    // In a real app, this would download the actual document
    toast.info("Downloading contract document...")
    // window.open(contract.documentUrl, '_blank')
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
              <CardDescription>Contract ID: {contract.contract_id}</CardDescription>
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
              <p className="text-lg font-medium">{contract.position?.title || "Software Developer"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Department</h3>
              <p className="text-lg font-medium">{contract.position?.department || "Engineering"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contract Type</h3>
              <p className="text-lg font-medium">{contract.contract_type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
              <p className="text-lg font-medium">{formatDate(contract.start_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
              <p className="text-lg font-medium">
                {contract.end_date ? formatDate(contract.end_date) : "Permanent"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Created On</h3>
              <p className="text-lg font-medium">{formatDate(contract.created_at)}</p>
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