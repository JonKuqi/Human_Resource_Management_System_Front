import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobListings() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-dark-blue-gray mb-6">Job Listings Management</h1>

      <Tabs defaultValue="post" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="post">Post New Job</TabsTrigger>
          <TabsTrigger value="manage">Manage Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>Create Job Listing</CardTitle>
              <CardDescription>Fill out the form below to create a new job listing for your company.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="e.g. Senior Software Engineer" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g. New York, NY or Remote" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment-type">Employment Type</Label>
                    <Select>
                      <SelectTrigger id="employment-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary-from">Salary Range (From)</Label>
                    <Input id="salary-from" type="number" placeholder="Minimum salary" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary-to">Salary Range (To)</Label>
                    <Input id="salary-to" type="number" placeholder="Maximum salary" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valid-until">Valid Until</Label>
                    <Input id="valid-until" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="e.g. javascript, react, remote" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the job responsibilities, requirements, and qualifications..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-us">About the Company</Label>
                  <Textarea
                    id="about-us"
                    placeholder="Provide information about your company..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto bg-dark-blue-gray hover:bg-very-dark-blue-gray">
                  Publish Job Listing
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Your Job Listings</CardTitle>
              <CardDescription>View and manage all your active job listings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sample job listings - in a real app, these would be fetched from the backend */}
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark-blue-gray">Senior Frontend Developer</h3>
                      <p className="text-gray-600">Technology • Full-time • New York, NY</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      Posted on: <span className="font-medium">May 1, 2023</span> • Valid until:{" "}
                      <span className="font-medium">June 30, 2023</span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">12 applicants</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      View Applicants
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Listing
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Close Listing
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark-blue-gray">Product Manager</h3>
                      <p className="text-gray-600">Technology • Full-time • Remote</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      Posted on: <span className="font-medium">April 15, 2023</span> • Valid until:{" "}
                      <span className="font-medium">June 15, 2023</span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">8 applicants</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      View Applicants
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Listing
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Close Listing
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
