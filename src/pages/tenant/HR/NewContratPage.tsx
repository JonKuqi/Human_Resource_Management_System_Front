"use client";
import { ContractForm } from "@/src/components/tenant/HR/ContratsForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
export const dynamic = 'force-dynamic';
export default function NewContractPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/contracts">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-hr-darker-blue">New Contract</h1>
      </div>
      <ContractForm />
    </div>
  )
}
