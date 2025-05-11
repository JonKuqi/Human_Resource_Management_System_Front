"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import TenantMenu from "../components/tenant/TenantMenu"
import { FaBars } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"

interface TenantLayoutProps {
  children: React.ReactNode
}

const TenantLayout: React.FC<TenantLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { colors } = useTheme()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <div className="flex h-screen bg-[#F4F6F6]">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md"
        style={{ backgroundColor: colors.primary }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <FaBars className="text-white" />
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar menu */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-0 w-64 bg-white shadow-lg`}
      >
        <TenantMenu />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}

export default TenantLayout
