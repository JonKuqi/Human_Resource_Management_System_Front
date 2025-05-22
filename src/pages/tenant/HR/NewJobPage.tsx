
"use client";
import { JobPostingForm } from "@/src/components/tenant/HR/JobPostingForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
export const dynamic = 'force-dynamic';
export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/tenant/hr/jobs">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-hr-darker-blue">Post New Job</h1>
      </div>
      <JobPostingForm />
    </div>
  )
}
