"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format, addDays, differenceInBusinessDays } from "date-fns"
import Link from "next/link"
import { useEffect } from "react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z
  .object({
    employeeId: z.string({
      required_error: "Please select an employee.",
    }),
    leaveType: z.string({
      required_error: "Please select a leave type.",
    }),
    startDate: z.date({
      required_error: "Please select a start date.",
    }),
    endDate: z.date({
      required_error: "Please select an end date.",
    }),
    halfDay: z.string().optional(),
    reason: z.string().min(5, {
      message: "Reason must be at least 5 characters.",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

// Sample employees data (mund ta zëvendësosh me API dinamik nëse ke)
const employees = [
  { id: "EMP-001", name: "Alex Johnson" },
  { id: "EMP-002", name: "Sarah Williams" },
  { id: "EMP-003", name: "Michael Brown" },
  { id: "EMP-005", name: "David Wilson" },
  { id: "EMP-006", name: "Jessica Miller" },
]

export function LeaveRequestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      reason: "",
      halfDay: "none",
    },
  })

  const startDate = form.watch("startDate")
  const endDate = form.watch("endDate")

  // Calculate business days between dates and adjust endDate if needed
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInBusinessDays(endDate, startDate) + 1
      if (days <= 0) {
        form.setValue("endDate", startDate)
      }
    }
  }, [startDate, endDate, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        userTenant: {
          userTenantId: parseInt(values.employeeId.replace("EMP-", ""), 10),
        },
        leaveType: values.leaveType,
        startDate: values.startDate.toISOString().split("T")[0], // në format yyyy-MM-dd
        endDate: values.endDate.toISOString().split("T")[0],
        reason: values.reason,
        halfDay: values.halfDay,
      }

      const res = await axios.post("http://localhost:8081/api/v1/tenant/leave-request/", payload)

      // Kontrollo për përgjigje të suksesshme
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to submit leave request")
      }

      alert("Leave request submitted successfully!")

      // Pas dërgimit të suksesshëm, resetimi i formës
      form.reset({
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        reason: "",
        halfDay: "none",
      })
      // Opsionale: rifresko listën e kërkesave në UI nëse ke
    } catch (error) {
      alert(`Error: ${(error as Error).message}`)
    }
  }

  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle>Leave Request Form</CardTitle>
        <CardDescription>Submit a new leave request for approval.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annual leave">Annual Leave</SelectItem>
                      <SelectItem value="sick leave">Sick Leave</SelectItem>
                      <SelectItem value="personal leave">Personal Leave</SelectItem>
                      <SelectItem value="maternity leave">Maternity Leave</SelectItem>
                      <SelectItem value="paternity leave">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid leave">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
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
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
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
                          disabled={(date) => date < startDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="halfDay"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Half Day Option</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">Full day(s)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="first-half" />
                        </FormControl>
                        <FormLabel className="font-normal">First day - morning only</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="last-half" />
                        </FormControl>
                        <FormLabel className="font-normal">Last day - afternoon only</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Leave</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a reason for your leave request"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This information will be visible to HR and your manager.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/leave">Cancel</Link>
            </Button>
            <Button type="submit">Submit Request</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
