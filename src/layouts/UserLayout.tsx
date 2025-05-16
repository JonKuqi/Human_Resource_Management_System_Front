// layouts/UserLayout.tsx
"use client"

import type React from "react"
import UserNavbar from "../components/NavBar2"
import Footer from "../components/Footer"

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default UserLayout
