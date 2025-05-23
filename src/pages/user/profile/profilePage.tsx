"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, FileText } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"

interface UserDTO {
  userId: number
  username: string
  email: string
  passwordHash: string
  tenantId: string | null
  role: string
  createdAt: string | null
}

interface UserGeneralDTO {
  userGeneralId: number
  user: UserDTO
  firstName: string
  lastName: string
  phone: string
  gender: string
  birthDate: string
  profilePhoto: string
  cvData: string
  portfolio: string
  verified: boolean
}

interface DecodedToken {
  sub: string
  role: string
  user_id: number
  tenant: string
  user_general_id: number
  iat: number
  exp: number
}

// ... pjesa e imports dhe interfaces mbetet e njëjtë

export default function Profile() {
  const [user, setUser] = useState<UserGeneralDTO | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Tokeni nuk ekziston!")

        const decoded = jwtDecode<DecodedToken>(token)
        const userGeneralId = decoded.user_general_id
        const userId = decoded.user_id

        const response = await axios.get(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/user-general/${userGeneralId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUser(response.data)
        if (!response.data) {
  throw new Error("User data not found in response");
}
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone,
          gender: response.data.gender,
          birthDate: response.data.birthDate,
          portfolio: response.data.portfolio || "",
          email: response.data.user?.email || "",
          userId: userId,
          cvData: response.data.cvData || ""
        })
        console.log("Fetched user data:", response.data);


      } catch (error) {
        console.error("Failed to fetch user:", error)
        toast.error("Failed to load profile")
      }
    }
    fetchUser()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }
const viewCvBlob = () => {
  const byteCharacters = atob(formData.cvData);
  const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        setFormData((prev: any) => ({ ...prev, cvData: base64 }));
        toast.success("CV loaded successfully");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token || !formData) throw new Error("Token ose formData mungon!")

      const decoded = jwtDecode<DecodedToken>(token)
      const userGeneralId = decoded.user_general_id
      const userId = decoded.user_id

      const { email, userId: _, ...rest } = formData
      const payload = {
  ...rest,
  user: { userId },
  userGeneralId: userGeneralId,
  verified: user?.verified ?? true  // ruajmë statusin ekzistues
}

      await axios.put(`https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/user-general/${userGeneralId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Profile updated successfully")
      setUser((prev) => (prev ? { ...prev, ...payload } : prev))
      setIsEditing(false)
    } catch (error) {
      console.error("Update failed:", error)
      toast.error("Update failed")
    }
  }

  if (!user || !formData) return <p>Loading...</p>

  // UI layout stays the same — but make sure the Save Changes button calls handleSubmit


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-dark-blue-gray mb-6">Your Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.profilePhoto ? `data:image/*;base64,${user.profilePhoto}` : undefined}
                    alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                  />
                  <AvatarFallback className="text-2xl bg-dark-blue-gray text-white">
                    {(user.firstName?.[0] || "")}{(user.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>{formData.email}</CardDescription>
            </CardHeader>
            <CardFooter>
              {!isEditing && (
                <Button
                  className="bg-dark-blue-gray hover:bg-dark-blue-hover text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

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
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
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
                      <Label htmlFor="birthDate">Date of Birth</Label>
                      <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input id="portfolio" name="portfolio" value={formData.portfolio || ""} onChange={handleInputChange} disabled={!isEditing} placeholder="https://your-portfolio.com" />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end space-x-2 mt-6 md:col-span-2">
                        <Button type="button" variant="outline" className="bg-dark-blue-gray hover:bg-dark-blue-hover text-white" onClick={() => { setIsEditing(false); if (user) setFormData({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          phone: user.phone,
                          gender: user.gender,
                          birthDate: user.birthDate,
                          portfolio: user.portfolio || "",
                          email: user.user?.email || "",
                          userId: user.user?.userId || null,
                        }) }}>Cancel</Button>
                        <Button type="submit" className="bg-dark-blue-gray hover:bg-dark-blue-hover text-white">Save Changes</Button>
                      </div>
                    )}
                  </form>
                </TabsContent>
 <TabsContent value="documents">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Curriculum Vitae (CV)</CardTitle>
              <CardDescription>
                Upload a PDF CV only if you don't already have one.
              </CardDescription>
            </CardHeader>
            <CardContent>
             {!formData.cvData ? (
  <Input type="file" accept="application/pdf" onChange={handleCvChange} />
) : (
  <div className="space-y-2">
    <p className="text-sm text-gray-500 italic">CV already uploaded</p>
    <Button onClick={viewCvBlob} className="bg-dark-blue-gray hover:bg-dark-blue-hover text-white">View CV</Button>

  </div>
)}

            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={!formData.cvData} className="bg-dark-blue-gray hover:bg-dark-blue-hover text-white">
  Save Changes
</Button>

            </CardFooter>
          </Card>
        </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
