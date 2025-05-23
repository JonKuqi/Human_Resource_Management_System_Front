"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa"
import { Bell } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

interface JwtPayload {
  user_tenant_id: number
}

interface UserTenant {
  firstName: string
  lastName: string
  user: {
    email: string
  }
  profilePhoto: string | null
}

const API = axios.create({
  baseURL: "https://humanresourcemanagementsystemback-production.up.railway.app/api/v1",
  withCredentials: true,
})
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token")
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState<UserTenant | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const { user_tenant_id } = jwtDecode<JwtPayload>(token)
        const res = await API.get(`/tenant/user-tenant/${user_tenant_id}`)
        setUser(res.data)
      } catch (err) {
        console.error("Failed to load user tenant", err)
      }
    }

    loadUser()
  }, [])

  if (!user) return null

  return (
      <div className="relative">
        {/* Profile block navigates to profile */}
        <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/tenant/profile")}
        >
          {user.profilePhoto ? (
              <img
                  src={`data:image/*;base64,${user.profilePhoto}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
              />
          ) : (
              <FaUserCircle className="w-10 h-10 text-white" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-300 truncate">{user.user.email}</p>
          </div>
        </div>

        {/* Bell and Dropdown Arrow below */}
        <div className="flex items-center space-x-2 mt-2 ml-[2.75rem]">
          <div
              className="text-white cursor-pointer hover:text-yellow-300"
              onClick={() => navigate("/tenant/company-news")}
          >
            <Bell size={18} />
          </div>
          <div
              className="text-white cursor-pointer hover:text-gray-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaChevronDown size={12} />
          </div>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                <Link
                    to="/tenant/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                >
                  <FaUserCircle className="mr-2" />
                  My Profile
                </Link>
                <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </Link>
              </div>
            </div>
        )}
      </div>
  )

}

export default UserProfile
