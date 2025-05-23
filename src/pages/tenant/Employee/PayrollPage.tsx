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
  id: string
  period: string
  payDate: string
  grossAmount: number
  netAmount: number
  taxAmount: number
  deductions: {
    type: string
    amount: number
  }[]
  documentUrl?: string
}

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)
  const [years, setYears] = useState<string[]>([])

  // Mock data for demonstration
  useEffect(() => {
    // Generate mock payroll records
    const currentYear = new Date().getFullYear()
    const mockYears = [currentYear.toString(), (currentYear - 1).toString()]
    setYears(mockYears)
    
    const generateMockPayroll = (year: string) => {
      const records: PayrollRecord[] = []
      
      // Generate monthly records for the selected year
      for (let month = 1; month <= 12; month++) {
        // Only generate records up to the current month for the current year
        if (year === currentYear.toString() && month > new Date().getMonth() + 1) {
          continue
        }
        
        const grossAmount = 5000 + Math.random() * 1000
        const taxAmount = grossAmount * 0.2
        const insuranceAmount = 250
        const pensionAmount = grossAmount * 0.05
        const netAmount = grossAmount - taxAmount - insuranceAmount - pensionAmount
        
        records.push({
          id: `${year}-${month.toString().padStart(2, "0")}`,
          period: `${month.toString().padStart(2, "0")}/${year}`,
          payDate: `${year}-${month.toString().padStart(2, "0")}-15`,
          grossAmount,
          netAmount,
          taxAmount,
          deductions: [
            { type: "Income Tax", amount: taxAmount },
            { type: "Health Insurance", amount: insuranceAmount },
            { type: "Pension Contribution", amount: pensionAmount },
          ],
          documentUrl: "#",
        })
      }
      
      return records
    }
    
    // Filter records based on selected year
    const filteredRecords = generateMockPayroll(selectedYear)
    setPayrollRecords(filteredRecords)
  }, [selectedYear])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDownloadPayslip = (record: PayrollRecord) => {
    // In a real app, this would download the actual document
    toast.info(`Downloading payslip for ${record.period}...`)
  }

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record)
  }

  // Filter records based on search term
  const filteredRecords = payrollRecords.filter((record) =>
    record.period.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-employee-darker-blue mb-6">Payroll History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year to Date Earnings</CardTitle>
            <CardDescription>Total earnings in {new Date().getFullYear()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                payrollRecords.reduce((sum, record) => sum + record.grossAmount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year to Date Taxes</CardTitle>
            <CardDescription>Total taxes paid in {new Date().getFullYear()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                payrollRecords.reduce((sum, record) => sum + record.taxAmount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Payslip</CardTitle>
            <CardDescription>
              {payrollRecords.length > 0
                ? `Period: ${payrollRecords[0].period}`
                : "No payslips available"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payrollRecords.length > 0 && (
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {formatCurrency(payrollRecords[0].netAmount)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPayslip(payrollRecords[0])}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Payroll Records</CardTitle>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="year" className="sr-only">
                  Year
                </Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year" className="w-[120px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search records..."
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
              <TabsTrigger value="details" disabled={!selectedRecord}>
                Payment Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center">
                          Period
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Pay Date</TableHead>
                      <TableHead className="text-right">Gross Amount</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No payroll records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {record.period}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(record.payDate)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(record.grossAmount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(record.netAmount)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(record)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPayslip(record)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
                        Period: {selectedRecord.period} • Paid on {formatDate(selectedRecord.payDate)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadPayslip(selectedRecord)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Payslip
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Earnings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Salary</span>
                          <span className="font-medium">{formatCurrency(selectedRecord.grossAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Gross Pay</span>
                          <span>{formatCurrency(selectedRecord.grossAmount)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Deductions</h4>
                      <div className="space-y-2">
                        {selectedRecord.deductions.map((deduction, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{deduction.type}</span>
                            <span className="font-medium">
                              {formatCurrency(deduction.amount)}
                            </span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total Deductions</span>
                          <span>
                            {formatCurrency(
                              selectedRecord.deductions.reduce(
                                (sum, deduction) => sum + deduction.amount,
                                0
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Net Pay</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(selectedRecord.netAmount)}
                      </span>
                    </div>
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