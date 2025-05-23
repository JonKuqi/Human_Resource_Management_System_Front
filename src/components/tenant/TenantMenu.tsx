"use client";

import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { usePermissions } from "../../context/PermissionContext";
import UserProfile from "./UserProfile";

import {
  FaTachometerAlt,
  FaUsersCog,
  FaFileAlt,
  FaCalendarAlt,
  FaChartLine,
  FaCreditCard,
} from "react-icons/fa";

import {
  Home,
  Briefcase,
  Users,
  Star,
  Calendar,
  FileCheck,
  MessageSquare,
  FileText,
  Wallet,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const menuPages = [
  {
    id: "user-roles",
    name: "User Roles",
    path: "/tenant/user-roles",
    permission: "POST:/api/v1/tenant/user-role",
    icon: <FaUsersCog />,
  },
  {
    id: "leave-requests",
    name: "Leave Requests",
    path: "/tenant/leave-requests",
    permission: "PUT:/api/v1/tenant/leave-request",
    icon: <FaCalendarAlt />,
  },
  {
    id: "performance",
    name: "Performance",
    path: "/tenant/performance",
    permission: "POST:/api/v1/tenant/evaluation-forms",
    icon: <FaChartLine />,
  },
  {
    id: "subscription",
    name: "Subscription",
    path: "/tenant/subscription",
    permission: "POST:/api/v1/tenant/subscriptions/payments/create",
    icon: <FaCreditCard />,
  },
  {
    id: "hr-dashboard",
    name: "HR Dashboard",
    path: "/tenant/dashboard",
    permission: "GET:/api/v1/tenant/dashboard",
    icon: <Home className="h-5 w-5" />,
    alwaysVisible: true,
  },
  {
    id: "hr-jobs",
    name: "Job Listings",
    path: "/tenant/jobs",
    permission: "POST:/api/v1/public/job-listing",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: "hr-employees",
    name: "Employees",
    path: "/tenant/employees",
    permission: "POST:/api/v1/tenant/user-tenant",
    icon: <Users className="h-5 w-5" />,
  },
  // {
  //   id: "hr-performance",
  //   name: "HR Performance",
  //   path: "/tenant/performance",
  //   permission: "POST:/api/v1/tenant/evaluation-forms",
  //   icon: <Star className="h-5 w-5" />,
  // },
  // {
  //   id: "hr-leave-requests",
  //   name: "HR Leave Requests",
  //   path: "/tenant/leave-requests",
  //   permission: "PUT:/api/v1/tenant/leave-request/",
  //   icon: <Calendar className="h-5 w-5" />,
  // },
  {
    id: "hr-contracts",
    name: "Contracts",
    path: "/tenant/contracts",
    permission: "POST:/api/v1/tenant/contracts",
    icon: <FileCheck className="h-5 w-5" />,
  },
  {
    id: "hr-chat",
    name: "Team Chat",
    path: "/tenant/chat",
    permission: "GET:/api/v1/tenant/chat",
    icon: <MessageSquare className="h-5 w-5" />,
    hasBadge: true,
    alwaysVisible: true,

  },
  
{
  id: "employee-leave",
  name: "Leave Requests",
  path: "/tenant/employee/leave-request",
  permission: "POST:/api/v1/tenant/leave-request",
  icon: <Calendar className="h-5 w-5" />,
},
{
  id: "employee-contract",
  name: "My Contract",
  path: "/tenant/employee/contract",
  permission: "GET:/api/v1/tenant/contract",
  icon: <FileText className="h-5 w-5" />,
},
{
  id: "employee-evaluation",
  name: "Evaluations",
  path: "/tenant/employee/evaluation",
  permission: "GET:/api/v1/tenant/evaluation-forms",
  icon: <Star className="h-5 w-5" />,
},
{
  id: "employee-payroll",
  name: "Payroll History",
  path: "/tenant/employee/payroll",
  permission: "GET:/api/v1/tenant/payroll",
  icon: <Wallet className="h-5 w-5" />,
},
{
  id: "employee-notifications",
  name: "Notifications",
  path: "/tenant/employee/notifications",
  permission: "GET:/api/v1/tenant/notifications",
  icon: <Bell className="h-5 w-5" />,
  hasBadge: true,
},

];

const TenantMenu = () => {
  const location = useLocation();
  const { colors } = useTheme();
  const { permissions } = usePermissions();
  const [activeItem, setActiveItem] = useState("");

  const unreadMessages = 0;
  if (permissions.length === 0) {
    console.log("Waiting for permissions...");
    return null;
  }

  // Normalize utility
  const normalize = (s: string) => s.replace(/\/+$/, "");

  // Filter visible menu items based on permissions
  // const visibleMenu = useMemo(() => {
  //   return menuPages.filter((page) =>
  //     permissions.some((perm: string) =>
  //       normalize(perm) === normalize(page.permission) ||
  //       normalize(perm).startsWith(normalize(page.permission))
  //     )
  //   );
  // }, [permissions]);

  const visibleMenu = useMemo(() => {
  return menuPages.filter((page) =>
    page.alwaysVisible || permissions.some((perm: string) =>
      normalize(perm) === normalize(page.permission) ||
      normalize(perm).startsWith(normalize(page.permission))
    )
  );
}, [permissions]);

  useEffect(() => {
    const active = menuPages.find((page) => location.pathname.startsWith(page.path));
    if (active) setActiveItem(active.id);
  }, [location]);

  // Debug logs
  useEffect(() => {
    console.log("🔐 Permissions from context:", permissions);

    const visibleIds = visibleMenu.map((p) => p.id);
    const hidden = menuPages.filter((p) => !visibleIds.includes(p.id)).map((p) => p.name);

    console.log("✅ Visible Menu Items:", visibleMenu.map((p) => `${p.name} (${p.permission})`));
    console.log("❌ Hidden Menu Items (no permission):", hidden);
  }, [visibleMenu, permissions]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4" style={{ backgroundColor: colors.primary }}>
        <UserProfile />
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-4 space-y-1">
          {visibleMenu.map((page) => (
            <Link
              key={page.id}
              to={page.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                activeItem === page.id
                  ? `bg-[${colors.accent}] text-[${colors.secondary}]`
                  : `text-gray-600 hover:bg-gray-100`
              }`}
              onClick={() => setActiveItem(page.id)}
            >
              <span className="mr-3 text-lg">{page.icon}</span>
              {page.name}
              {page.hasBadge && unreadMessages > 0 && (
                <Badge className="ml-auto bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadMessages}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">NexHR</span>
          <span className="text-xs text-gray-400">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default TenantMenu;
