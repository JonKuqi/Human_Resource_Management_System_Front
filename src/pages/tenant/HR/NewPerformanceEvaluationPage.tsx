
"use client";
import { PerformanceEvaluationForm } from "../../../components/tenant/HR/PerformanceEvaluationForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
export const dynamic = 'force-dynamic';
import { Link } from "react-router-dom"

export default function NewPerformanceEvaluationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
<Link to="/tenant/performance">
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
