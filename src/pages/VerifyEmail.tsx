"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import Button from "../components/Button"
export const dynamic = 'force-dynamic';

const VerifyEmailPage = () => {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail")
    if (savedEmail) setEmail(savedEmail)
  }, [])

  useEffect(() => {
    // Try to get email from query string or localStorage
    const params = new URLSearchParams(location.search)
    const queryEmail = params.get("email")
    const storedEmail = localStorage.getItem("email")

    if (queryEmail) {
      setEmail(queryEmail)
    } else if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [location.search])

  useEffect(() => {
    if (timeLeft <= 0) {
      setResendDisabled(false)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/user-general/verify`,
        { email, code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      alert("Email verified successfully!")
      navigate("/login")
    } catch (error: any) {
      console.error("Verification failed", error)
      alert("Invalid or expired verification code.")
    }
  }

  const handleResend = async () => {
    try {
      await axios.post(
        `https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/user-general/resend`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      alert("Verification code resent!")
      setTimeLeft(15 * 60)
      setResendDisabled(true)
    } catch (error: any) {
      console.error("Resend failed", error)
      alert("Failed to resend verification code.")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify Your Email</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">
          Please enter your email and the 6-digit code sent to it.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <Button fullWidth onClick={handleVerify}>
          Verify Email
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Time left: {formatTime(timeLeft)}</p>
          <button
           // disabled={resendDisabled}
            onClick={handleResend}
            className={`mt-2 text-sm font-medium text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage