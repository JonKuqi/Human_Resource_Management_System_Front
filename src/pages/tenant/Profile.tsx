"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Button from "../../components/Button"

const ProfilePage = () => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [profileImage, setProfileImage] = useState<File | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token not found")

        const response = await axios.get("http://localhost:8081/api/v1/tenant/user-tenant", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })

        const [data] = response.data
        setUser(data)
        setFormData({
          ...data,
          email: data.user.email
        })
      } catch (err) {
        console.error("Failed to fetch user profile:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      const form = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value !== "object") form.append(key, value as string)
      })

      if (profileImage) {
        form.append("profilePhoto", profileImage)
      }

      await axios.put("http://localhost:8081/api/v1/tenant/user-tenant", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })

      setEditMode(false)
      window.location.reload()
    } catch (err) {
      console.error("Failed to update profile:", err)
    }
  }

  if (loading) return <div className="text-center text-lg">Loading...</div>

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-7xl mx-auto mt-10 w-full">
      <h1 className="text-3xl font-bold text-[#1C2833] mb-8">My Profile</h1>
      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="col-span-1 flex flex-col items-center">
            <img
              src={profileImage ? URL.createObjectURL(profileImage) : user.profilePhoto || "/default-profile.png"}
              alt="Profile"
              className="w-52 h-52 rounded-full object-cover border-4 border-gray-300 shadow-sm"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                className="mt-4 text-sm"
                onChange={handleImageChange}
              />
            )}
            <p className="mt-4 font-semibold text-lg">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">{user.tenant?.name}</p>
          </div>

          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Gender", name: "gender" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                {editMode ? (
                  <input
                    name={name}
                    type="text"
                    value={formData[name] || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{formData[name]}</p>
                )}
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Address</label>
              <p className="text-gray-900 text-lg">
                {user.address?.street}, {user.address?.city}, {user.address?.country} {user.address?.zip}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">You do not have access to view profile data.</p>
      )}

      <div className="flex justify-center gap-4 mt-10">
        <Button variant="primary" onClick={() => (editMode ? handleSave() : setEditMode(true))}>
          {editMode ? "Save Changes" : "Edit Profile"}
        </Button>
        <Button variant="outline">Change Password</Button>
      </div>
    </div>
  )
}

export default ProfilePage
