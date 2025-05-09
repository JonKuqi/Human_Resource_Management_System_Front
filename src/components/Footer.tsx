"use client"

import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"

const Footer = () => {
  const { colors } = useTheme()

  return (
    <footer style={{ backgroundColor: colors.primary }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span>Nex</span>
              <span style={{ color: colors.accent }}>HR</span>
            </Link>
            <p className="mt-4 text-sm opacity-80">
              Streamlining human resource management for businesses of all sizes.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-80 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm opacity-80 hover:opacity-100">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-80 hover:opacity-100">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm opacity-80 hover:opacity-100">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Companies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-sm opacity-80 hover:opacity-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-sm opacity-80 hover:opacity-100">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/tenant/signup" className="text-sm opacity-80 hover:opacity-100">
                  Register Company
                </Link>
              </li>
              <li>
                <Link to="/tenant/login" className="text-sm opacity-80 hover:opacity-100">
                  Company Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm opacity-80">123 Business Avenue</li>
              <li className="text-sm opacity-80">New York, NY 10001</li>
              <li className="text-sm opacity-80">contact@nexhr.com</li>
              <li className="text-sm opacity-80">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80">&copy; {new Date().getFullYear()} NexHR. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm opacity-80 hover:opacity-100">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm opacity-80 hover:opacity-100">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm opacity-80 hover:opacity-100">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
