import { Button } from "@/components/ui/button"
import { JobListingsTable } from "@/src/components/tenant/HR/JobListingTable"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function JobListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Job Listings</h1>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>
      <JobListingsTable />
    </div>
  )
}
