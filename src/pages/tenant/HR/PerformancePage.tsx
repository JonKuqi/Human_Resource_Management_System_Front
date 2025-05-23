import { Button } from "@/components/ui/button"
import { PerformanceEvaluationList } from "../../../components/tenant/HR/PerformanceEvaluationList"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-darker-blue">Performance Evaluations</h1>
        <Button asChild>
          <Link to="/tenant/performance/new">
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Link>
        </Button>
      </div>
      <PerformanceEvaluationList />
    </div>
  )
}
