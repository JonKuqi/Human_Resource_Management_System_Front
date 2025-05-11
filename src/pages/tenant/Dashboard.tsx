"use client";

import { FaUsers, FaFileAlt, FaCalendarAlt, FaBriefcase } from "react-icons/fa"
import { useTheme } from "../../context/ThemeContext"

// Mock data for dashboard
const stats = [
  { id: 1, name: "Total Employees", value: "124", icon: <FaUsers size={24} />, change: "+5.4%" },
  { id: 2, name: "Open Applications", value: "42", icon: <FaFileAlt size={24} />, change: "+12.3%" },
  { id: 3, name: "Pending Leave Requests", value: "8", icon: <FaCalendarAlt size={24} />, change: "-2.5%" },
  { id: 4, name: "Open Positions", value: "15", icon: <FaBriefcase size={24} />, change: "+3.2%" },
]

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "submitted a leave request",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Michael Chen",
    action: "applied for Senior Developer position",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: "Emily Rodriguez",
    action: "completed performance review",
    time: "Yesterday",
  },
  {
    id: 4,
    user: "David Kim",
    action: "was hired as Marketing Specialist",
    time: "2 days ago",
  },
]

const Dashboard = () => {
  console.log("🧪 Is useTheme running in client?", typeof window !== "undefined");
  const { colors } = useTheme()

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C2833] mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-[#2E4053] mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.background}` }}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-xs font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: colors.accent }}
                >
                  <span className="text-xs font-bold text-[#1C2833]">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-medium text-[#2E4053] hover:underline" style={{ color: colors.primary }}>
            View all activities
          </button>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div
                className="min-w-[50px] text-center p-2 rounded-md mr-4"
                style={{ backgroundColor: colors.background }}
              >
                <p className="text-sm font-bold">MAY</p>
                <p className="text-lg font-bold">15</p>
              </div>
              <div>
                <p className="font-medium">Team Building Event</p>
                <p className="text-sm text-gray-600 mt-1">10:00 AM - 4:00 PM</p>
                <p className="text-sm text-gray-600">Central Park</p>
              </div>
            </div>
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div
                className="min-w-[50px] text-center p-2 rounded-md mr-4"
                style={{ backgroundColor: colors.background }}
              >
                <p className="text-sm font-bold">MAY</p>
                <p className="text-lg font-bold">22</p>
              </div>
              <div>
                <p className="font-medium">Quarterly Review</p>
                <p className="text-sm text-gray-600 mt-1">9:00 AM - 12:00 PM</p>
                <p className="text-sm text-gray-600">Conference Room A</p>
              </div>
            </div>
            <div className="flex items-start">
              <div
                className="min-w-[50px] text-center p-2 rounded-md mr-4"
                style={{ backgroundColor: colors.background }}
              >
                <p className="text-sm font-bold">JUN</p>
                <p className="text-lg font-bold">05</p>
              </div>
              <div>
                <p className="font-medium">New Employee Orientation</p>
                <p className="text-sm text-gray-600 mt-1">1:00 PM - 3:00 PM</p>
                <p className="text-sm text-gray-600">Training Room</p>
              </div>
            </div>
          </div>
          <button className="mt-4 text-sm font-medium hover:underline" style={{ color: colors.primary }}>
            View calendar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
