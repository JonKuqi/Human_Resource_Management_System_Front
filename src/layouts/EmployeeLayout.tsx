import { ReactNode } from "react"
import { EmployeeSidebar } from "@/src/components/tenant/Employee/Esidebar"

interface EmployeeLayoutProps {
  children: ReactNode
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return (
    <div className="flex h-screen bg-employee-lightest-gray">
      <EmployeeSidebar />
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  )
}