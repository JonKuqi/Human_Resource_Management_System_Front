import { Button } from "@/components/ui/button"
import { LeaveRequestsTable } from "@/src/components/tenant/HR/LeaveRequestTable"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function LeaveRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Leave Requests</h1>
        <Button asChild>
          <Link href="/dashboard/leave/new">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>
      <LeaveRequestsTable />
    </div>
  )
}
