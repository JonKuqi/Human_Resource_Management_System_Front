"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa"

// Mock user data - in a real app, this would come from context or API
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "HR Manager",
  profilePhoto: null, // URL would go here if available
}

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {mockUser.profilePhoto ? (
          <img
            src={mockUser.profilePhoto || "/placeholder.svg"}
            alt={`${mockUser.firstName} ${mockUser.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-white" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {mockUser.firstName} {mockUser.lastName}
          </p>
          <p className="text-xs text-gray-300 truncate">{mockUser.role}</p>
        </div>
        <div className="text-white">{isDropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}</div>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-10">
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
              to="/tenant/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaCog className="mr-2" />
              Settings
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
