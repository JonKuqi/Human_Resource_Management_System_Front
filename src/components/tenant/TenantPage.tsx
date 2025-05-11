"use client"

import type React from "react"

import { useParams } from "react-router-dom"
import Dashboard from "../../pages/tenant/Dashboard"
import UserRoles from "../../pages/tenant/UserRoles"
import Profile from "../../pages/tenant/Profile"

// This component dynamically loads the correct page based on the URL parameter
const TenantPage = () => {
  const { pageId } = useParams<{ pageId: string }>()

  // Map of page IDs to their components
  const pageComponents: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    "user-roles": <UserRoles />,
    profile: <Profile />,
  }

  // Default content if no page is selected or page doesn't exist
  if (!pageId || !pageComponents[pageId]) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Select a page from the menu</h2>
          <p className="mt-2 text-gray-500">Choose an option from the sidebar to get started</p>
        </div>
      </div>
    )
  }

  return <>{pageComponents[pageId]}</>
}

export default TenantPage
