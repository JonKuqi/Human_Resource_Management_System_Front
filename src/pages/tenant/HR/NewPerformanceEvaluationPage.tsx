import { PerformanceEvaluationForm } from "../../../components/tenant/HR/PerformanceEvaluationForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewPerformanceEvaluationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
<Link href="/tenant/HR/PerformancePage">
  <Button variant="outline" size="sm">
    <ChevronLeft className="mr-2 h-4 w-4" />
    Back
  </Button>
</Link>

        <h1 className="text-3xl font-bold text-hr-darker-blue">New Performance Evaluation</h1>
      </div>
      <PerformanceEvaluationForm />
    </div>
  )
}
