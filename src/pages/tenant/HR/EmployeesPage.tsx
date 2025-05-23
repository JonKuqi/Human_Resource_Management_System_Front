import { Button } from "@/components/ui/button"
import { EmployeesTable } from "@/src/components/tenant/HR/EmployeesTable"
import { Plus } from "lucide-react"

export const dynamic = 'force-dynamic';
import { Link } from "react-router-dom"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Employees</h1>
        <Button asChild>
          <Link to="/tenant/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>
      <EmployeesTable />
    </div>
  )
}
