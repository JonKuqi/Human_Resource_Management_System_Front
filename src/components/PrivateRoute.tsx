"use client"

import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  role?: string
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)

    if (decoded.role !== "TENANT_USER") {
      return <Navigate to="/login" replace />
    }

    return <>{children}</>
  } catch (error) {
    console.error("Invalid token:", error)
    return <Navigate to="/login" replace />
  }
}

export default PrivateRoute