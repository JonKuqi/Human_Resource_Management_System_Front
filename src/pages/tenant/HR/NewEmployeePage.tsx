import { EmployeeForm } from "../../../components/tenant/HR/EmployeeForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
// import Link from "next/link"
import { Link } from "react-router-dom"


export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/tenant/employees">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-hr-darker-blue">Add New Employee</h1>
      </div>
      <EmployeeForm />
    </div>
  )
}
