"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import UserProfile from "./UserProfile"
import { FaTachometerAlt, FaUsersCog, FaFileAlt, FaCalendarAlt, FaChartLine } from "react-icons/fa"

// This would typically come from an API or context
const menuPages = [
  { id: "dashboard", name: "Dashboard", path: "/tenant/dashboard", icon: <FaTachometerAlt /> },
  { id: "user-roles", name: "User Roles", path: "/tenant/user-roles", icon: <FaUsersCog /> },
  { id: "applications", name: "Applications", path: "/tenant/applications", icon: <FaFileAlt /> },
  { id: "leave-requests", name: "Leave Requests", path: "/tenant/leave-requests", icon: <FaCalendarAlt /> },
  { id: "performance", name: "Performance", path: "/tenant/performance", icon: <FaChartLine /> },
]

const TenantMenu = () => {
  const location = useLocation()
  const { colors } = useTheme()
  const [activeItem, setActiveItem] = useState("")

  useEffect(() => {
    const currentPath = location.pathname
    const active = menuPages.find((page) => currentPath.includes(page.id))
    if (active) {
      setActiveItem(active.id)
    }
  }, [location])

  return (
    <div className="flex flex-col h-full">
      {/* User profile section */}
      <div className="p-4" style={{ backgroundColor: colors.primary }}>
        <UserProfile />
      </div>

      {/* Menu items */}
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-4 space-y-1">
          {menuPages.map((page) => (
            <Link
              key={page.id}
              to={page.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeItem === page.id
                  ? `bg-[${colors.accent}] text-[${colors.secondary}]`
                  : `text-gray-600 hover:bg-gray-100`
              }`}
              onClick={() => setActiveItem(page.id)}
            >
              <span className="mr-3 text-lg">{page.icon}</span>
              {page.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">NexHR</span>
          <span className="text-xs text-gray-400">v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

export default TenantMenu
