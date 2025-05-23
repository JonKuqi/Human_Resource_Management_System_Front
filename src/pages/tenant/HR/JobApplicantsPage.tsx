"use client";
import { useParams } from "react-router-dom"
import { ApplicantsTable } from "@/src/components/tenant/HR/ApplicantsTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
export const dynamic = 'force-dynamic';
export default function JobApplicantsPage() {
  const { id: jobId } = useParams<{ id: string }>()

  if (!jobId) return <div>Loading...</div>

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/tenant/jobs">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-hr-darker-blue">Job Applicants</h1>
      </div>

      <Card className="border-hr-light-gray">
        <CardHeader>
          <CardTitle>Applicants for Job ID: {jobId}</CardTitle>
          <CardDescription>Fetched from backend API</CardDescription>
        </CardHeader>
        <CardContent>
          {/* You can load dynamic stats here later */}
        </CardContent>
      </Card>

      <ApplicantsTable jobId={jobId} />
    </div>
  )
}
