"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User, FileText, LinkIcon } from "lucide-react"

// Mock user data
const mockUser = {
  user_general_id: 1,
  user_id: 101,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  gender: "Male",
  birth_date: "1990-01-15",
  profile_photo: null,
  cv: null,
  portfolio: "https://johndoe-portfolio.com",
}

export default function Profile() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birth_date: user.birth_date,
    portfolio: user.portfolio,
  })

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    setUser({
      ...user,
      ...formData,
    })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-dark-blue-gray mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Profile summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback className="text-2xl bg-dark-blue-gray text-white">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>
                {user.first_name} {user.last_name}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-dark-blue-gray" />
                  <span className="text-sm">{user.gender}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-dark-blue-gray" />
                  <span className="text-sm">{user.cv ? "CV Uploaded" : "No CV Uploaded"}</span>
                </div>
                {user.portfolio && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-dark-blue-gray" />
                    <a
                      href={user.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Portfolio Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-dark-blue-gray hover:bg-very-dark-blue-gray"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right column: Profile details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {isEditing ? "Update your personal information below" : "View and manage your personal information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {isEditing ? (
                          <Select
                            value={formData.gender}
                            onValueChange={(value) => handleSelectChange("gender", value)}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input id="gender" value={formData.gender} disabled />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birth_date">Date of Birth</Label>
                        <Input
                          id="birth_date"
                          name="birth_date"
                          type="date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="portfolio">Portfolio URL</Label>
                        <Input
                          id="portfolio"
                          name="portfolio"
                          value={formData.portfolio || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="https://your-portfolio.com"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              first_name: user.first_name,
                              last_name: user.last_name,
                              email: user.email,
                              phone: user.phone,
                              gender: user.gender,
                              birth_date: user.birth_date,
                              portfolio: user.portfolio || "",
                            })
                            setIsEditing(false)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-dark-blue-gray hover:bg-very-dark-blue-gray">
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-white">
                      <h3 className="text-lg font-semibold text-dark-blue-gray mb-4">Profile Photo</h3>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
                          <AvatarFallback className="bg-dark-blue-gray text-white">
                            {user.first_name.charAt(0)}
                            {user.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Upload a professional profile photo. JPG or PNG format, max 5MB.
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload New Photo
                            </Button>
                            {user.profile_photo && (
                              <Button variant="outline" size="sm" className="text-red-600">
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6 bg-white">
                      <h3 className="text-lg font-semibold text-dark-blue-gray mb-4">Curriculum Vitae (CV)</h3>
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload your CV to make it easier to apply for jobs. PDF format recommended, max 10MB.
                        </p>
                        {user.cv ? (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-dark-blue-gray" />
                              <span>John_Doe_CV.pdf</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button variant="outline" className="flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload CV
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
