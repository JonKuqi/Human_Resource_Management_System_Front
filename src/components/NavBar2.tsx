"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { User, Menu, X, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"

const Navbar2 = () => {
  const { colors } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  const isActive = (path: string) => pathname === path

  return (
    <nav style={{ backgroundColor: colors.primary, color: "white" }} className="sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold">
            <span style={{ color: "white" }}>Nex</span>
            <span style={{ color: colors.accent }}>HR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/user/joblist"
              style={{
                backgroundColor: isActive("/user/joblist") ? colors.accent : "transparent",
                color: isActive("/user/joblist") ? "white" : "#BDC3C7",
              }}
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-opacity-20"
            >
              Job Listings
            </Link>

            <Link
              to="/user/skills"
              style={{
                backgroundColor: isActive("/user/skills") ? colors.accent : "transparent",
                color: isActive("/user/skills") ? "white" : "#BDC3C7",
              }}
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-opacity-20"
            >
              Manage Skills
            </Link>
            <Link
              to="/user/applications"
              style={{
                backgroundColor: isActive("/user/applications") ? colors.accent : "transparent",
                color: isActive("/user/applications") ? "white" : "#BDC3C7",
              }}
              className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-opacity-20"
            >
              My Applications
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback style={{ backgroundColor: colors.accent }}>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/user/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-opacity-20"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div style={{ backgroundColor: colors.accent }} className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/user/joblist"
            style={{
              backgroundColor: isActive("/user/joblist") ? colors.primary : "transparent",
              color: isActive("/user/joblist") ? "white" : "#F4F6F6",
            }}
            className="block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            See Job Listings
          </Link>
          <Link
            to="/user/skills"
            style={{
              backgroundColor: isActive("/user/skills") ? colors.primary : "transparent",
              color: isActive("/user/skills") ? "white" : "#F4F6F6",
            }}
            className="block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Manage Skills
          </Link>
          <Link
            to="/user/profile"
            style={{
              backgroundColor: isActive("/user/profile") ? colors.primary : "transparent",
              color: isActive("/user/profile") ? "white" : "#F4F6F6",
            }}
            className="block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            View Profile
          </Link>
          <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:opacity-80">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar2
