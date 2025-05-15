import { ApplicantsTable } from "@/src/components/tenant/HR/ApplicantsTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function JobApplicantsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/jobs">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-hr-darker-blue">Job Applicants</h1>
      </div>

      <Card className="border-hr-light-gray">
        <CardHeader>
          <CardTitle>Senior Software Engineer</CardTitle>
          <CardDescription>Job ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-hr-lightest-gray p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Applicants</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="rounded-lg bg-hr-lightest-gray p-4">
              <div className="text-sm font-medium text-muted-foreground">New Today</div>
              <div className="text-2xl font-bold">3</div>
            </div>
            <div className="rounded-lg bg-hr-lightest-gray p-4">
              <div className="text-sm font-medium text-muted-foreground">Shortlisted</div>
              <div className="text-2xl font-bold">8</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ApplicantsTable jobId={params.id} />
    </div>
  )
}
