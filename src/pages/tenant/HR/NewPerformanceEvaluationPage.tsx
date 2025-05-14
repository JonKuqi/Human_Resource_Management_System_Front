import { PerformanceEvaluationForm } from "@/src/components/tenant/HR/PerformanceEvaluationForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewPerformanceEvaluationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/performance">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-hr-darker-blue">New Performance Evaluation</h1>
      </div>
      <PerformanceEvaluationForm />
    </div>
  )
}
