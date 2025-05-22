import { Button } from "@/components/ui/button"
import { ContractsTable } from "@/src/components/tenant/HR/ContractsTable"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Contracts</h1>
        <Button asChild>
          <Link to="/tenant/contracts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Link>
        </Button>
      </div>
      <ContractsTable />
    </div>
  )
}
