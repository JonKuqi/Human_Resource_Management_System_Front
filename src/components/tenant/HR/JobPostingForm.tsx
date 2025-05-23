"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  tenant: string
  [key: string]: any
}

interface Industry {
  industryId: number
  name: string
}

const formSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  industryId: z.string({ required_error: "Please select an industry." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  employmentType: z.string({ required_error: "Please select an employment type." }),
  salaryFrom: z.string().optional(),
  salaryTo: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  aboutUs: z.string().min(10, { message: "About us must be at least 10 characters." }),
  validUntil: z.date({ required_error: "Please select a valid until date." }),
  tags: z.array(z.string()).optional(),
})

function TagsInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("")

  const handleAddTag = () => {
    const newTag = input.trim()
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag])
    }
    setInput("")
  }

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter tag and press Add" />
        <Button type="button" onClick={handleAddTag}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <div key={tag} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
            {tag}
            <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveTag(tag)}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function JobPostingForm() {
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [industries, setIndustries] = useState<Industry[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const decoded: DecodedToken = jwtDecode(token)
    const schemaName = decoded.tenant

    const fetchTenantIdAndIndustries = async () => {
      try {
        const tenantRes = await fetch(`http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/tenant/filter?schemaName=${schemaName}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const tenantData = await tenantRes.json()
        if (tenantData.length === 0) throw new Error("Tenant not found by schema")
        setTenantId(tenantData[0].tenantId)

        const industryRes = await fetch(`http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/industry`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const industryData = await industryRes.json()
        setIndustries(industryData)
      } catch (error) {
        console.error("Error loading tenant or industry data:", error)
      }
    }

    fetchTenantIdAndIndustries()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      industryId: "",
      location: "",
      employmentType: "",
      salaryFrom: "",
      salaryTo: "",
      description: "",
      aboutUs: "",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tags: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("User is not authenticated")
      if (!tenantId) throw new Error("Tenant ID not loaded")

      const jobRes = await fetch("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/job-listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenant: { tenantId },
          jobTitle: values.jobTitle,
          industry: { industryId: Number(values.industryId) },
          location: values.location,
          employmentType: values.employmentType,
          salaryFrom: values.salaryFrom,
          salaryTo: values.salaryTo,
          description: values.description,
          aboutUs: values.aboutUs,
          validUntil: values.validUntil,
          createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"),
        }),
      })

      if (!jobRes.ok) {
        const errorText = await jobRes.text()
        console.error("Job creation failed:", errorText)
        throw new Error("Failed to create job listing")
      }

      const createdJob = await jobRes.json()
      const jobId = createdJob.jobListingId

      for (const tag of values.tags || []) {
        await fetch("http://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/job-tag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobListingId: jobId, tag }),
        })
      }

      alert("Job listing and tags created successfully!")
    } catch (error) {
      console.error(error)
      alert("An error occurred while creating the job or tags.")
    }
  }

  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>Fill out the form below to create a new job posting.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField control={form.control} name="jobTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Senior Software Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="industryId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {industries.map(ind => (
                        <SelectItem key={ind.industryId} value={ind.industryId.toString()}>
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="e.g. Remote, New York, NY" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="employmentType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="salaryFrom" render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary From</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g. 50000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="salaryTo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary To</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g. 70000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="validUntil" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Valid Until</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>The job posting will expire on this date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl><Textarea placeholder="Describe the job..." className="min-h-[150px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="aboutUs" render={({ field }) => (
              <FormItem>
                <FormLabel>About the Company</FormLabel>
                <FormControl><Textarea placeholder="Tell candidates about your company..." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tags" render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl><TagsInput value={field.value || []} onChange={field.onChange} /></FormControl>
                <FormDescription>Enter relevant keywords like "React", "Remote", etc.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/jobs">Cancel</Link>
            </Button>
            <Button type="submit">Create Job Posting</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
