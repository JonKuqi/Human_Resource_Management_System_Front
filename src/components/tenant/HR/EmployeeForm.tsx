"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"



const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  gender: z.string(),
  department: z.string(),
  position: z.string().min(2),
  joinDate: z.date(),
  salary: z.string().min(1),
  contractType: z.string(),
  contractEnd: z.date().optional(),
  country: z.string().min(2),
  city: z.string().min(2),
  street: z.string().min(2),
  zip: z.string().min(2),
})

interface Department {
  departmentId: number
  name: string
}

export function EmployeeForm({ onSuccess }: { onSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState("personal")
  const [departments, setDepartments] = useState<Department[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      joinDate: new Date(),
      salary: "",
      country: "",
      city: "",
      street: "",
      zip: "",
      gender: "",
      department: "",
      contractType: "",
      contractEnd: undefined,
    },
  })

  const API = axios.create({
    baseURL: "http://localhost:8081/api/v1",
    withCredentials: true,
  })

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/tenant/department")
        setDepartments(res.data)
      } catch (err) {
        toast.error("Failed to fetch departments")
      }
    }
    fetchDepartments()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

        const API = axios.create({
    baseURL: "http://localhost:8081/api/v1",
    withCredentials: true,
  })

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
      const response=await API.post("/tenant/user-tenant/employees", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        departmentName: values.department,
        positionTitle: values.position,
        contractType: values.contractType,
        salary: values.salary,
        contractEndDate: values.contractEnd
          ? values.contractEnd.toISOString().split("T")[0]
          : null,
        country: values.country,
        city: values.city,
        street: values.street,
        zip: values.zip,
      
      })
      
      toast.success("Employee added successfully!")
      

      
      form.reset();
  } catch (error: any) {
    const message = error?.response?.data?.message ?? "Unknown error";

    if (message.includes("Maximum user limit reached")) {
      if (message.includes("FREE")) {
        if (window.confirm("You've reached the limit for FREE plan. Would you like to upgrade to BASIC or PRO?")) {
          window.location.href = "/tenant/subscription";
        }
      } else if (message.includes("BASIC")) {
        if (window.confirm("You've reached the limit for BASIC plan. Would you like to upgrade to PRO?")) {
          window.location.href = "/tenant/subscription";
        }
      } else if (message.includes("PRO")) {
        toast.error("You've reached the maximum allowed users for the PRO plan. Contact support to extend your limit.");
      } else {
        toast.error(message);
      }
    } else {
      toast.error("Failed to save employee.");
      toast.error("You should choose the payment plan first!")
    }
  }
}


  return (
    <Card className="border-hr-light-gray">
      <CardHeader>
        <CardTitle>Employee Information</CardTitle>
        <CardDescription>Add a new employee to your organization.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="employment">Employment Details</TabsTrigger>
              <TabsTrigger value="contract">Contract Information</TabsTrigger>
            </TabsList>

            {/* PERSONAL INFO */}
            <TabsContent value="personal" className="mt-4">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* First Name */}
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder="John" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Last Name */}
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Email */}
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Phone */}
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input placeholder="+383.." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Gender */}
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </TabsContent>

            {/* EMPLOYMENT */}
            <TabsContent value="employment" className="mt-4">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Department */}
                  <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(dep => (
                            <SelectItem key={dep.departmentId} value={dep.name}>
                              {dep.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Position */}
                  <FormField control={form.control} name="position" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Country */}
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="Kosovo" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* City */}
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="Prishtina" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Street */}
                  <FormField control={form.control} name="street" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl><Input placeholder="Main street" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* ZIP */}
                  <FormField control={form.control} name="zip" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl><Input placeholder="10000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Join Date */}
                  <FormField control={form.control} name="joinDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Join Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-full pl-3 text-left font-normal">
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </TabsContent>

            {/* CONTRACT */}
            <TabsContent value="contract" className="mt-4">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField control={form.control} name="contractType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="probation">Probation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="salary" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl><Input placeholder="700" type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contractEnd" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Contract End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-full pl-3 text-left font-normal">
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className={`bg-[#1C2833] text-white hover:bg-[#273746] px-4 py-2 rounded-md transition ${!form.formState.isValid ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Save Employee
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
      <ToastContainer />
    </Card>
    
  )
}
