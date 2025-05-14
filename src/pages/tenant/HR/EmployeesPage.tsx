import { Button } from "@/components/ui/button"
import { EmployeesTable } from "@/src/components/tenant/HR/EmployeesTable"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Employees</h1>
        <Button asChild>
          <Link href="/dashboard/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>
      <EmployeesTable />
    </div>
  )
}
