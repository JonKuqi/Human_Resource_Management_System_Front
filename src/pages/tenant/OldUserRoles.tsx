"use client"

import { useState } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa"
import Button from "../../components/Button"
import { useTheme } from "../../context/ThemeContext"

// Mock data for roles
const initialRoles = [
  {
    id: 1,
    name: "HR Manager",
    description: "Full access to HR functions and employee data",
    permissions: ["view_employees", "edit_employees", "manage_roles", "approve_leave"],
  },
  {
    id: 2,
    name: "Department Head",
    description: "Manages department employees and approves requests",
    permissions: ["view_department", "edit_department", "approve_leave"],
  },
  {
    id: 3,
    name: "Employee",
    description: "Basic access to personal information and requests",
    permissions: ["view_profile", "submit_leave", "view_directory"],
  },
  {
    id: 4,
    name: "Recruiter",
    description: "Manages job listings and applications",
    permissions: ["create_jobs", "review_applications", "schedule_interviews"],
  },
]

// Mock data for users
const initialUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    roles: ["HR Manager", "Department Head"],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    roles: ["Employee"],
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    roles: ["Department Head"],
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@example.com",
    roles: ["Recruiter", "Employee"],
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    roles: ["Employee"],
  },
]

// Mock data for all available permissions
const allPermissions = [
  { id: "view_employees", name: "View All Employees", description: "Can view all employee profiles" },
  { id: "edit_employees", name: "Edit Employee Data", description: "Can edit employee information" },
  { id: "manage_roles", name: "Manage Roles", description: "Can create, edit, and delete roles" },
  { id: "approve_leave", name: "Approve Leave", description: "Can approve leave requests" },
  { id: "view_department", name: "View Department", description: "Can view department employees" },
  { id: "edit_department", name: "Edit Department", description: "Can edit department information" },
  { id: "view_profile", name: "View Own Profile", description: "Can view own profile" },
  { id: "submit_leave", name: "Submit Leave", description: "Can submit leave requests" },
  { id: "view_directory", name: "View Directory", description: "Can view company directory" },
  { id: "create_jobs", name: "Create Jobs", description: "Can create job listings" },
  { id: "review_applications", name: "Review Applications", description: "Can review job applications" },
  { id: "schedule_interviews", name: "Schedule Interviews", description: "Can schedule interviews" },
  { id: "view_reports", name: "View Reports", description: "Can view company reports" },
  { id: "manage_payroll", name: "Manage Payroll", description: "Can manage employee payroll" },
  { id: "admin_access", name: "Admin Access", description: "Has administrative access" },
]

const OldUserRoles = () => {
  const { colors } = useTheme()
  const [roles, setRoles] = useState(initialRoles)
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle role permission change
  const handlePermissionChange = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId])
    }
  }

  // Handle user role change
  const handleRoleChange = (roleName: string) => {
    if (selectedUserRoles.includes(roleName)) {
      setSelectedUserRoles(selectedUserRoles.filter((name) => name !== roleName))
    } else {
      setSelectedUserRoles([...selectedUserRoles, roleName])
    }
  }

  // Open permissions panel for a role
  const openPermissionsPanel = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId)
    if (role) {
      setSelectedPermissions(role.permissions)
      setSelectedRoleId(roleId)
      // Close user roles dropdown if open
      setSelectedUserId(null)
    }
  }

  // Open roles dropdown for a user
  const openRolesDropdown = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUserRoles(user.roles)
      setSelectedUserId(userId)
      // Close permissions panel if open
      setSelectedRoleId(null)
    }
  }

  // Save permissions for a role
  const savePermissions = () => {
    if (selectedRoleId !== null) {
      setRoles(
        roles.map((role) => {
          if (role.id === selectedRoleId) {
            return { ...role, permissions: selectedPermissions }
          }
          return role
        }),
      )
      setSelectedRoleId(null)
    }
  }

  // Save roles for a user
  const saveUserRoles = () => {
    if (selectedUserId !== null) {
      setUsers(
        users.map((user) => {
          if (user.id === selectedUserId) {
            return { ...user, roles: selectedUserRoles }
          }
          return user
        }),
      )
      setSelectedUserId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1C2833] mb-4 sm:mb-0">User Roles & Permissions</h1>
        <Button variant="primary">
          <FaPlus className="mr-2" />
          Add New Role
        </Button>
      </div>

      {/* Roles Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-[#F4F6F6]">
          <h2 className="text-lg font-semibold text-[#2E4053]">Roles</h2>
          <p className="text-sm text-gray-600">Manage roles and their permissions</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Roles Table */}
          <div className={`flex-1 overflow-x-auto ${selectedRoleId !== null ? "lg:border-r border-gray-200" : ""}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: colors.primary }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id} className={`hover:bg-gray-50 ${selectedRoleId === role.id ? "bg-blue-50" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#2E4053]">{role.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{role.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          onClick={() => openPermissionsPanel(role.id)}
                        >
                          Change Permissions
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Permissions Panel */}
          {selectedRoleId !== null && (
            <div className="lg:w-1/2 border-t lg:border-t-0 border-gray-200">
              <div className="p-4 bg-[#F4F6F6] border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#2E4053]">
                  Permissions for {roles.find((r) => r.id === selectedRoleId)?.name}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedRoleId(null)}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`permission-${permission.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#2E4053] border-gray-300 rounded focus:ring-[#2E4053]"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`permission-${permission.id}`} className="font-medium text-gray-700">
                          {permission.name}
                        </label>
                        <p className="text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 bg-[#F4F6F6]">
                <Button variant="primary" onClick={savePermissions}>
                  Save Permissions
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-[#F4F6F6]">
          <h2 className="text-lg font-semibold text-[#2E4053]">Users</h2>
          <p className="text-sm text-gray-600">Manage user roles</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#2E4053]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: colors.primary }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-[#2E4053]">{user.firstName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{user.roles.join(", ")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        onClick={() => openRolesDropdown(user.id)}
                      >
                        Change Roles
                      </button>

                      {/* Roles Dropdown */}
                      {selectedUserId === user.id && (
                        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-700">Select Roles</h4>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setSelectedUserId(null)}
                              aria-label="Close"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                          <div className="py-1 max-h-60 overflow-y-auto">
                            {roles.map((role) => (
                              <div key={role.id} className="px-4 py-2 hover:bg-gray-100">
                                <div className="flex items-center">
                                  <input
                                    id={`role-${role.id}-user-${user.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 text-[#2E4053] border-gray-300 rounded focus:ring-[#2E4053]"
                                    checked={selectedUserRoles.includes(role.name)}
                                    onChange={() => handleRoleChange(role.name)}
                                  />
                                  <label
                                    htmlFor={`role-${role.id}-user-${user.id}`}
                                    className="ml-2 text-sm text-gray-700"
                                  >
                                    {role.name}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-2 border-t border-gray-200">
                            <button
                              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2E4053] rounded-md hover:bg-[#1C2833] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E4053]"
                              onClick={saveUserRoles}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OldUserRoles
