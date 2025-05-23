"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown, Calendar, Download, FileText, Search } from 'lucide-react'
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"

interface PayrollRecord {
  payrollId: number
  payPeriodStart: string
  payPeriodEnd: string
  baseSalary: number
  bonuses: number
  deductions: number
  netPay: number
  paymentDate: string
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

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [years, setYears] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const token = localStorage.getItem("token")
        const payload = token ? parseJwt(token) : null
        const userTenantId = payload?.user_tenant_id

        if (!token || !userTenantId) {
          throw new Error("Authentication token not found")
        }

        const response = await axios.get(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/tenant/payroll/filter?userTenant.userTenantId=${userTenantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const allRecords = response.data
        setPayrollRecords(allRecords)
        const yearsAvailable = Array.from(new Set(allRecords.map((r: PayrollRecord) => new Date(r.payPeriodStart).getFullYear().toString())))
        setYears(yearsAvailable.sort((a, b) => parseInt(b) - parseInt(a)))
        setSelectedYear(yearsAvailable[0])
      } catch (error) {
        console.error("Error fetching payroll records:", error)
        toast.error("Failed to load payroll records")
      } finally {
        setLoading(false)
      }
    }

    fetchPayroll()
  }, [])

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()
  const handleDownloadPayslip = (record: PayrollRecord) => toast.info(`Downloading payslip for ${record.payPeriodStart} - ${record.payPeriodEnd}...`)
  const handleViewDetails = (record: PayrollRecord) => setSelectedRecord(record)

  const filteredRecords = payrollRecords.filter((record) =>
    new Date(record.payPeriodStart).getFullYear().toString() === selectedYear &&
    record.payPeriodStart.includes(searchTerm)
  )

  const totalGross = filteredRecords.reduce((sum, r) => sum + r.baseSalary + r.bonuses, 0)
  const totalNet = filteredRecords.reduce((sum, r) => sum + r.netPay, 0)
  const totalDeductions = filteredRecords.reduce((sum, r) => sum + r.deductions, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">Payroll History</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year to Date Earnings</CardTitle>
            <CardDescription>Total gross pay in {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalGross)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year to Date Net Pay</CardTitle>
            <CardDescription>Total net income received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalNet)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year to Date Deductions</CardTitle>
            <CardDescription>Total deducted amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalDeductions)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Payroll Records</CardTitle>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="year" className="sr-only">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year" className="w-[120px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search period..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table">
            <TabsList className="mb-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedRecord}>Payment Details</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Pay Date</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.payrollId}>
                        <TableCell>{formatDate(record.payPeriodStart)} – {formatDate(record.payPeriodEnd)}</TableCell>
                        <TableCell>{formatDate(record.paymentDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(record.baseSalary + record.bonuses)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(record.netPay)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(record)}>
                              <FileText className="h-4 w-4 mr-2" /> Details
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadPayslip(record)}>
                              <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>


<TabsContent value="details">
  {selectedRecord && (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Payment Details</h3>
          <p className="text-sm text-muted-foreground">
            Period: {formatDate(selectedRecord.payPeriodStart)} – {formatDate(selectedRecord.payPeriodEnd)} • Paid on {formatDate(selectedRecord.paymentDate)}
          </p>
        </div>
        <Button variant="outline" onClick={() => handleDownloadPayslip(selectedRecord)}>
          <Download className="h-4 w-4 mr-2" /> Download Payslip
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Earnings</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Salary</span>
              <span className="font-medium">{formatCurrency(selectedRecord.baseSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bonuses</span>
              <span className="font-medium">{formatCurrency(selectedRecord.bonuses)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total Gross</span>
              <span>{formatCurrency(selectedRecord.baseSalary + selectedRecord.bonuses)}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Deductions</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Deductions</span>
              <span className="font-medium">{formatCurrency(selectedRecord.deductions)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Net Pay</span>
              <span>{formatCurrency(selectedRecord.netPay)}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="bg-muted p-4 rounded-md">
        <p className="text-sm text-muted-foreground">
          <strong>Paid via:</strong> Bank Transfer<br />
          <strong>Transaction Reference:</strong> TRX-{selectedRecord.payrollId.toString().padStart(5, "0")}<br />
          <strong>Issued:</strong> {formatDate(selectedRecord.createdAt)}
        </p>
      </div>
    </div>
  )}
</TabsContent>


          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}