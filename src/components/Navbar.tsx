"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { FaBars, FaTimes } from "react-icons/fa"

const Navbar = () => {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav style={{ backgroundColor: colors.primary }} className="py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center">
          <span>Nex</span>
          <span style={{ color: colors.accent }}>HR</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="text-white hover:text-gray-300 transition-colors">
            Jobs
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300 transition-colors">
            Contact
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-white border border-white hover:bg-white hover:text-[#2E4053] transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-md bg-white text-[#2E4053] hover:bg-gray-200 transition-all"
            >
              Sign Up
            </Link>
            <Link
              to="/tenant/register"
              className="px-4 py-2 rounded-md bg-[#AAB7B8] text-[#1C2833] hover:bg-[#BDC3C7] transition-all"
            >
              Register Company
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#1C2833] bg-opacity-95" style={{ top: "64px" }}>
          <div className="flex flex-col items-center py-8 space-y-6">
            <Link to="/" className="text-white text-xl hover:text-gray-300 transition-colors" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/jobs" className="text-white text-xl hover:text-gray-300 transition-colors" onClick={toggleMenu}>
              Jobs
            </Link>
            <Link to="/about" className="text-white text-xl hover:text-gray-300 transition-colors" onClick={toggleMenu}>
              About
            </Link>
            <Link
              to="/contact"
              className="text-white text-xl hover:text-gray-300 transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-4 w-full px-8">
              <Link
                to="/login"
                className="w-full text-center px-4 py-3 rounded-md text-white border border-white hover:bg-white hover:text-[#2E4053] transition-all"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-full text-center px-4 py-3 rounded-md bg-white text-[#2E4053] hover:bg-gray-200 transition-all"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
              <Link
                to="/tenant/register"
                className="w-full text-center px-4 py-3 rounded-md bg-[#AAB7B8] text-[#1C2833] hover:bg-[#BDC3C7] transition-all"
                onClick={toggleMenu}
              >
                Register Company
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
