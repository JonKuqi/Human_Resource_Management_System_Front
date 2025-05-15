"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z
  .object({
    employeeId: z.string({
      required_error: "Please select an employee.",
    }),
    positionId: z.string({
      required_error: "Please select a position.",
    }),
    contractType: z.string({
      required_error: "Please select a contract type.",
    }),
    startDate: z.date({
      required_error: "Please select a start date.",
    }),
    endDate: z.date().optional(),
    isPermanent: z.boolean().default(false),
    salary: z.string().min(1, {
      message: "Please enter a salary amount.",
    }),
    terms: z.string().min(10, {
      message: "Terms must be at least 10 characters.",
    }),
  })
  .refine(
    (data) => {
      // If it's not permanent, end date is required
      if (!data.isPermanent && !data.endDate) {
        return false
      }
      return true
    },
    {
      message: "End date is required for non-permanent contracts",
      path: ["endDate"],
    },
  )

// Sample employees data
const employees = [
  { id: "EMP-001", name: "Alex Johnson" },
  { id: "EMP-002", name: "Sarah Williams" },
  { id: "EMP-003", name: "Michael Brown" },
  { id: "EMP-005", name: "David Wilson" },
  { id: "EMP-006", name: "Jessica Miller" },
]

// Sample positions data
const positions = [
  { id: "POS-001", title: "Software Engineer", department: "Engineering" },
  { id: "POS-002", title: "Senior Developer", department: "Engineering" },
  { id: "POS-003", title: "UI/UX Designer", department: "Design" },
  { id: "POS-004", title: "Product Manager", department: "Product" },
  { id: "POS-005", title: "Marketing Specialist", department: "Marketing" },
  { id: "POS-006", title: "HR Coordinator", department: "HR" },
  { id: "POS-007", title: "Financial Analyst", department: "Finance" },
  { id: "POS-008", title: "Sales Representative", department: "Sales" },
]

export function ContractForm() {
  const [isPermanent, setIsPermanent] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      isPermanent: false,
      terms:
        "This employment contract is made between the Company and the Employee named above. The Employee agrees to perform duties as assigned by the Company in accordance with Company policies and procedures. The Employee will receive the salary stated above, paid on a monthly basis, subject to applicable tax and other withholdings.",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send the data to your API
    alert("Contract created successfully!")
  }

  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle>Contract Information</CardTitle>
        <CardDescription>Create a new employment contract.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="positionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.title} ({position.department})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="fixed-term">Fixed Term</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="probation">Probation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g. $75,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isPermanent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            setIsPermanent(checked as boolean)
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Permanent Contract</FormLabel>
                        <FormDescription>This contract has no end date.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {!isPermanent && (
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date <= form.getValues("startDate")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Required for non-permanent contracts.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Terms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the terms and conditions of the contract"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Specify the terms and conditions of the employment contract.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/contracts">Cancel</Link>
            </Button>
            <Button type="submit">Create Contract</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
