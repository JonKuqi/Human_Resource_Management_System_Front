"use client";
import { DashboardStats } from "@/src/components/tenant/HR/DashboardStats"
import { RecentActivity } from "@/src/components/tenant/HR/RecentActivity"
import { UpcomingEvents } from "@/src/components/tenant/HR/UpcomingEvents"
export const dynamic = 'force-dynamic';
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-hr-darker-blue">HR Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </div>
  )
}
