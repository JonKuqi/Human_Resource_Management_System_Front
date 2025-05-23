"use client";
export const dynamic = 'force-dynamic';
// Dynamic User-Role-Permission management page (React + TypeScript)
// Now injects Bearer token on every API request.

import { EmployeeForm } from "@/src/components/tenant/HR/EmployeeForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaCreditCard, FaCheck } from "react-icons/fa";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import Button from "../../components/Button";
import { useTheme } from "../../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ------------------------------------------------------------------
 * DTO typings
 * ----------------------------------------------------------------*/
interface Role {
  roleId: number;
  roleName: string;
  description: string;
}

interface TenantPermission {
  tenantPermissionId: number;
  name: string | null;
  verb: string;
  resource: string;
  description?: string | null;
}

interface AssignedRole {
  roleId: number;
  roleName: string;
}

interface UserTenantView {
  userTenantId: number;
  user: {
    userId: number;
    email: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  createdAt: string;
  roles?: AssignedRole[];
}

interface RolePermissionDTO {
  tenantPermission: {
    verb: string;
    resource: string;
  };
}


/* -------------------------------------------------------------- */
const UserRoles = () => {

  const { colors } = useTheme();

  // ---------- data ----------
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserTenantView[]>([]);
  const [permissions, setPermissions] = useState<TenantPermission[]>([]);
  const permissionIds: number[] = [];
  const targetRoleIds: number[] = [];


  const refreshUsers = async () => {
    try {
      const res = await API.get<UserTenantView[]>("/tenant/user-tenant");
      setUsers(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to refresh user list");
    }
  };




  // ---------- UI ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);
  const [permTargets, setPermTargets] = useState<Record<number, Set<number>>>({});

  // ---------- status ----------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  /* ---------------- Axios instance with token ---------------- */
  const API = axios.create({
    baseURL: "http://localhost:8081/api/v1",
    withCredentials: true,
  });

  API.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
  );

  /* ---------------- initial load ----------------*/
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roleRes, userRes, permRes] = await Promise.all([
          API.get<Role[]>("/tenant/role"),
          API.get<UserTenantView[]>("/tenant/user-tenant"),
          API.get<TenantPermission[]>("/public/permission"),
        ]);
        setRoles(roleRes.data);
        setUsers(userRes.data);
        setPermissions(permRes.data);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load data. Please check backend/auth.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // run once

  /* ---------------- helpers ----------------*/
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.user.email.toLowerCase().includes(q)
    );
  });

  const togglePermission = (id: string, permId: number) => {
    setSelectedPermissions((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

    // ✅ fix: use Set not number
    setPermTargets((prev) => ({
      ...prev,
      [permId]: prev[permId] ?? new Set<number>([0]),  // <== FIXED HERE
    }));
  };

  const toggleUserRole = (roleName: string) =>
      setSelectedUserRoles((prev) =>
          prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
      );



  const toggleTarget = (permId: number, roleId: number) => {
    setPermTargets((prev) => {
      const current = new Set(prev[permId] ?? new Set<number>([0])); // default ALL
      if (current.has(roleId)) {
        current.delete(roleId);
      } else {
        current.delete(0);          // selecting a specific role removes “ALL”
        current.add(roleId);
      }
      if (current.size === 0) current.add(0); // nothing selected → back to ALL
      return { ...prev, [permId]: current };
    });
  };

  /* ---------------- actions ----------------*/
  const openPermissionsPanel = async (roleId: number) => {
    setSelectedRoleId(roleId);
    setSelectedUserId(null);
    try {
      // expect RolePermission list
      const res = await API.get<RolePermissionDTO[]>(
        `/tenant/role-permission/by-role/${roleId}`
      );

      // convert to "verb:resource"
      setSelectedPermissions(
        res.data.map(
          (rp) => `${rp.tenantPermission.verb}:${rp.tenantPermission.resource}`
        )
      );
    } catch (e) {
      console.error(e);
      setError("Unable to fetch role permissions.");
    }
  };

const openRolesDropdown = async (userTenantId: number) => {
  setSelectedUserId(userTenantId);
  setSelectedRoleId(null);
try {
  const res = await API.get<AssignedRole[]>(`/tenant/user-role/by-user-tenant/${userTenantId}`);
  setSelectedUserRoles(res.data.map((r: any) => r.role?.roleName ?? r.roleName));
} catch (e: any) {
  if (e.response?.status === 404) {
    setSelectedUserRoles([]); // nuk ka role – por nuk është error
  } else {
    console.error(e);
    setError("Unable to fetch user roles.");
  }
}

  }



  const savePermissions = async () => {
    if (selectedRoleId === null) return;

    // ---------- build arrays (multi-target) ----------
    const permissionIds: number[] = [];
    const targetRoleIds: number[] = [];

    selectedPermissions.forEach((id) => {
      const [verb, resource] = id.split(":");
      const perm = permissions.find(
          (p) => p.verb === verb && p.resource === resource
      );
      if (!perm) return;

      const targets =
          permTargets[perm.tenantPermissionId] ?? new Set<number>([0]); // 0 = ALL
      targets.forEach((t) => {
        permissionIds.push(perm.tenantPermissionId);
        targetRoleIds.push(t);
      });
    });
    // ---------- end build arrays ----------

    try {
      await API.put(`/tenant/role-permission/replace/${selectedRoleId}`, {
        permissionIds,
        targetRoleIds,
      });
      toast.success("Permissions saved ✔️");
      setSelectedRoleId(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save permissions ❌");
    }
  };


  const saveNewRole = async () => {
    if (!newRoleName.trim()) return toast.error("Role name required");

    try {
      const res = await API.post<Role>("/tenant/role", {
        roleName: newRoleName,
        description: newRoleDesc,
      });
      setRoles([...roles, res.data]);          // push into list
      toast.success("Role created ✔️");
      setShowAddModal(false);
      setNewRoleName("");
      setNewRoleDesc("");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create role");
    }
  };




  /* ----------- save user roles ----------*/
  const saveUserRoles = async () => {
    if (selectedUserId === null) return;

    // translate role names to roleIds
    const roleIds = roles
        .filter((r) => selectedUserRoles.includes(r.roleName))
        .map((r) => r.roleId);

    try {
      await API.put(`/tenant/user-role/replace/${selectedUserId}`, roleIds);
      toast.success("Roles updated ✔️");
      setSelectedUserId(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save user roles ❌");
    }
  };


  const deleteRole = async (roleId: number) => {
    // basic confirm – swap for a prettier modal if you wish
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await API.delete(`/tenant/role/${roleId}`);
      setRoles((prev) => prev.filter((r) => r.roleId !== roleId));
      toast.success("Role deleted ✔️");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete role ❌");
    }
  };


  /* ---------------- render ----------------*/
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
      <div className="space-y-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1C2833] mb-4 sm:mb-0">
            User Roles &amp; Permissions
          </h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <FaPlus className="mr-2" /> Add New Role
          </Button>
        </div>

        {/* ROLES SECTION */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-[#F4F6F6]">
            <h2 className="text-lg font-semibold text-[#2E4053]">Roles</h2>
            <p className="text-sm text-gray-600">Manage roles and their permissions</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* table */}
            <div
                className={`flex-1 overflow-x-auto ${
                    selectedRoleId !== null ? "lg:border-r border-gray-200" : ""
                }`}
            >
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
                    <tr
                        key={role.roleId}
                        className={`hover:bg-gray-50 ${
                            selectedRoleId === role.roleId ? "bg-blue-50" : ""
                        }`}
                    >
                      <td className="px-6 py-4 font-medium text-[#2E4053]">
                        {role.roleName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {role.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              onClick={() => openPermissionsPanel(role.roleId)}
                          >
                            Change Permissions
                          </button>
                          <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => deleteRole(role.roleId)}
                              title="Delete role"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* side panel */}
            {selectedRoleId !== null && (
                <div className="lg:w-1/2 border-t lg:border-t-0 border-gray-200">
                  <div className="p-4 bg-[#F4F6F6] border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-[#2E4053]">
                      Permissions for{" "}
                      {roles.find((r) => r.roleId === selectedRoleId)?.roleName}
                    </h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedRoleId(null)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                    {permissions.map((perm) => {
                      const id = `${perm.verb}:${perm.resource}`;
                      return (
                          <div key={id} className="flex items-start">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-[#2E4053]"
                                checked={selectedPermissions.includes(id)}
                                onChange={() => togglePermission(id, perm.tenantPermissionId)}   //  ← changed
                            />
                            <div className="ml-3 text-sm">
                              <label className="font-medium text-gray-700">
                                {perm.name ||
                                    `${perm.verb.toUpperCase()} ${perm.resource}`}
                              </label>
                              {perm.description && (
                                  <p className="text-gray-500">{perm.description}</p>
                              )}
                            </div>

                            <div className="ml-auto flex space-x-2">
                              {/* ALL checkbox */}
                              <label className="flex items-center text-xs">
                                <input
                                    type="checkbox"
                                    className="mr-1"
                                    checked={(permTargets[perm.tenantPermissionId] ?? new Set([0])).has(0)}
                                    onChange={() => toggleTarget(perm.tenantPermissionId, 0)}
                                />
                                ALL
                              </label>

                              {roles.map((r) => (
                                  <label key={r.roleId} className="flex items-center text-xs">
                                    <input
                                        type="checkbox"
                                        className="mr-1"
                                        checked={(permTargets[perm.tenantPermissionId] ?? new Set([0])).has(
                                            r.roleId
                                        )}
                                        onChange={() => toggleTarget(perm.tenantPermissionId, r.roleId)}
                                    />
                                    {r.roleName}
                                  </label>
                              ))}
                            </div>


                          </div>
                      );
                    })}
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

        {/* USERS SECTION */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-[#F4F6F6]">
            <h2 className="text-lg font-semibold text-[#2E4053]">Users</h2>
            <p className="text-sm text-gray-600">Manage user roles</p>
            <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal} >
              <DialogTrigger asChild>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h1 className="text-2xl font-bold text-[#1C2833] mb-4 sm:mb-0">
                    User Roles &amp; Permissions
                  </h1>
                  <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <FaPlus className="mr-2" /> Add New Employee
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <EmployeeForm
                    onSuccess={async () => {
                      await refreshUsers();
                      setShowEmployeeModal(false);
                    }}
                />
              </DialogContent>

            </Dialog>
          </div>

          {/* search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                  type="text"
                  placeholder="Search users by name or email…"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Roles
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                  <tr key={u.userTenantId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#2E4053]">
                      {u.firstName}
                    </td>
                    <td className="px-6 py-4">{u.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.user.email}
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-600">
                {(u.roles ?? []).map((r) => r.roleName).join(", ") || "-"}
                      </td> */}
                    <td className="px-6 py-4 relative">
                      <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-2 sm:space-y-0">
                        <button
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            onClick={() => openRolesDropdown(u.userTenantId)}
                        >
                          Change Roles
                        </button>


                      </div>


                      {selectedUserId === u.userTenantId && (
                          <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="text-sm font-medium text-gray-700">
                                Select Roles
                              </h4>
                              <button
                                  className="text-gray-500 hover:text-gray-700"
                                  onClick={() => setSelectedUserId(null)}
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>

                            <div className="py-1 max-h-60 overflow-y-auto">
                              {roles.map((r) => (
                                  <div
                                      key={r.roleId}
                                      className="px-4 py-2 hover:bg-gray-100 flex items-center"
                                  >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={selectedUserRoles.includes(r.roleName)}
                                        onChange={() => toggleUserRole(r.roleName)}
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                      {r.roleName}
                                    </label>
                                  </div>
                              ))}
                            </div>

                            <div className="p-2 border-t border-gray-200">
                              <button
                                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2E4053] rounded-md hover:bg-[#1C2833]"
                                  onClick={saveUserRoles}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>


        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Role</h2>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Role Name
                  <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#2E4053]"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </label>

                <label className="block mb-4 text-sm font-medium text-gray-700">
                  Description
                  <textarea
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#2E4053]"
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                  />
                </label>

                <div className="flex justify-end space-x-3">
                  <button
                      className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                      className="px-4 py-2 rounded-md bg-[#2E4053] text-white hover:bg-[#1C2833]"
                      onClick={saveNewRole}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default UserRoles;