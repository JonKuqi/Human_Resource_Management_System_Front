"use client";
import { Button } from "@/components/ui/button"
import { JobListingsTable } from "@/src/components/tenant/HR/JobListingTable"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
export const dynamic = 'force-dynamic';
export default function JobListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Job Listings</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/tenant/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/tenant/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Link>
          </Button>
        </div>
      </div>
      <JobListingsTable />
    </div>
  )
}
