"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FaUser,
  FaMapMarkerAlt,
  FaIdBadge,
  FaCamera,
  FaCheck,
  FaTimes,
  FaKey,
} from "react-icons/fa";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { useTheme } from "../../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_tenant_id: number;

}

/* ------------------------------------------------------------------ */
/* Axios helper with token                                             */
/* ------------------------------------------------------------------ */
const API = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  withCredentials: true,
});
API.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
//const refreshPage = () => setTimeout(() => window.location.reload(), 1000);

const toFormValues = (u: UserDTO) => ({
  userTenantId: u.userTenantId,
  firstName:    u.firstName,
  lastName:     u.lastName,
  email:        u.user.email,     //  <-- flatten
  phone:        u.phone,
  gender:       u.gender ?? "",
  address:      { ...u.address },
});



/* ------------------------------------------------------------------ */
/* Validation schemas                                                  */
/* ------------------------------------------------------------------ */
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  gender: Yup.string()
      .required("Gender is required")
      .oneOf(["M", "F", "O"], "Please select a valid gender"),
  address: Yup.object().shape({

    street: Yup.string().required("Street is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    zip: Yup.string().required("ZIP code is required"),
  }),
});

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string().min(6, "At least 6 chars").required("Required"),
  confirm: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Required"),
});

interface AssignedRole {
  roleId: number;
  roleName: string;
}

/* ------------------------------------------------------------------ */
interface UserDTO {
  userTenantId: number;
  user: {
    userId: number;
    email: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  profilePhoto: string | null; // base64 from backend
  createdAt: string;
  address: {
    addressId: number;
    street: string;
    country: string;
    city: string;
    zip: string;
  };
  roles?: AssignedRole[];
}



const ProfilePage = () => {
  const { colors } = useTheme();

  /* ---------------- state ---------------- */
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [formVals, setFormVals] = useState<any | null>(null);

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- load profile once ---------------- */
  const fetchRoles = async (userTenantId: number) => {
    try {
      const res = await API.get<AssignedRole[]>(
          `/tenant/user-role/by-user-tenant/${userTenantId}`
      );
      setRoles(res.data.map((r: any) => r.role?.roleName ?? r.roleName));
    } catch (e) {
      console.error(e);
      toast.error("Unable to fetch user roles");
    }
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        console.log("HEREEEEEE")
        const raw = localStorage.getItem("token");
        if (!raw) throw new Error("Token missing");

        const { user_tenant_id } = jwtDecode<JwtPayload>(raw);
        const res = await API.get<UserDTO>(
            `/tenant/user-tenant/${user_tenant_id}`
        );
        await fetchRoles(res.data.userTenantId);
        setUser(res.data);
        setFormVals(toFormValues(res.data));
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- handlers ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };



  const saveProfile = async (values: any, { setSubmitting }: any) => {
    if (!user) return;

    try {
      // ✅ 1. Prepare FormData for the simplified backend endpoint
      const formData = new FormData();
      formData.append("userTenantId", values.userTenantId);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("addressId", String(user.address.addressId)); // assuming address is fixed

      await API.put("/tenant/user-tenant/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // ✅ 2. Upload photo separately if a new file was chosen
      if (photoFile) {
        const fd = new FormData();
        fd.append("file", photoFile);
        await API.put(
            `/tenant/user-tenant/photo/${user.userTenantId}`,
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      toast.success("Profile updated ✔️");

      // Optional: update state locally
      setUser({ ...user, ...values, profilePhoto: preview ?? user.profilePhoto });
    } catch (e: any) {
      console.error(e);
      toast.error(`Save failed: ${e.response?.status ?? ""}`);
    } finally {
      setIsEditing(false);
      setSubmitting(false);
    }
  };





  /* ---------------- render ---------------- */
  if (loading) return <p>Loading…</p>;
  if (!user) return <p className="text-red-600">Could not load profile.</p>;

  return (
      <div className="max-w-5xl mx-auto">
        <ToastContainer position="bottom-right" autoClose={3000} />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1C2833]">My Profile</h1>

        </div>

        {formVals && (<Formik
                enableReinitialize
                initialValues={user}

                validationSchema={ProfileSchema}
                onSubmit={saveProfile}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                      {/* banner */}
                      <div
                          className="h-32 w-full"
                          style={{
                            backgroundColor: colors.primary,
                            backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                          }}
                      />

                      <div className="px-6 pb-6">
                        {/* photo */}
                        <div className="relative -mt-16 mb-6 flex justify-center">
                          <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
                              {preview || user.profilePhoto ? (
                                  <img
                                      src={preview ?? `data:image/*;base64,${user.profilePhoto}`}
                                      className="h-full w-full object-cover"
                                  />
                              ) : (
                                  <FaUser className="h-16 w-16 text-gray-400" />
                              )}
                            </div>

                            {isEditing && (
                                <label
                                    htmlFor="profile-photo"
                                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[#2E4053] flex items-center justify-center cursor-pointer border-2 border-white"
                                >
                                  <FaCamera className="text-white" />
                                  <input
                                      id="profile-photo"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="hidden"
                                  />
                                </label>
                            )}
                          </div>
                        </div>


                        {/* buttons */}
                        <div className="flex justify-end mb-6">
                          {isEditing ? (
                              <>
                                {/* ✅ already a submit button – leave untouched */}
                                <Button type="submit" variant="primary" disabled={isSubmitting}>
                                  <FaCheck className="mr-2" />
                                  {isSubmitting ? "Saving…" : "Save Changes"}
                                </Button>

                                {/* ⬇️ 1.  give Cancel a type="button" */}
                                <Button
                                    type="button"          // <-- add this
                                    variant="secondary"
                                    onClick={() => {
                                      setIsEditing(false);
                                      setPhotoFile(null);
                                      setPreview(null);
                                    }}
                                >
                                  <FaTimes className="mr-2" /> Cancel
                                </Button>
                              </>
                          ) : (
                              /* ⬇️ 2.  give Edit a type="button" */
                              <Button
                                  type="button"           // <-- add this
                                  variant="primary"
                                  onClick={() => setIsEditing(true)}
                              >
                                Edit Profile
                              </Button>
                          )}
                        </div>

                        {/* PERSONAL INFORMATION */}
                        <section className="bg-[#F4F6F6] p-6 rounded-lg mb-6">
                          <div className="flex items-center mb-4">
                            <FaUser className="text-[#2E4053] mr-2" />
                            <h2 className="text-lg font-semibold text-[#2E4053]">
                              Personal Information
                            </h2>
                          </div>

                          {isEditing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="firstName" label="First Name" required />
                                <FormField name="lastName" label="Last Name" required />
                                <FormField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    required
                                />
                                <FormField name="phone" label="Phone" required />

                                <div className="md:col-span-2">
                                  <label className="block text-[#2E4053] font-medium mb-2">
                                    Gender <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                      name="gender"
                                      value={values.gender}
                                      onChange={(e) => setFieldValue("gender", e.target.value)}
                                      className="w-full p-3 border-2 border-[#BDC3C7] rounded-md focus:outline-none focus:border-[#2E4053]"
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                  </select>
                                </div>
                              </div>
                          ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  ["First Name", values.firstName],
                                  ["Last Name", values.lastName],
                                  ["Email", values.user.email],
                                  ["Phone", values.phone],
                                  [
                                    "Gender",
                                    values.gender === "M"
                                        ? "Male"
                                        : values.gender === "F"
                                            ? "Female"
                                            : "Other",
                                  ],
                                ].map(([label, val]) => (
                                    <div key={label}>
                                      <p className="text-sm text-gray-500">{label}</p>
                                      <p className="font-medium">{val}</p>
                                    </div>
                                ))}
                              </div>
                          )}
                        </section>

                        {/* ADDRESS */}
                        <section className="bg-[#F4F6F6] p-6 rounded-lg mb-6">
                          <div className="flex items-center mb-4">
                            <FaMapMarkerAlt className="text-[#2E4053] mr-2" />
                            <h2 className="text-lg font-semibold text-[#2E4053]">
                              Address
                            </h2>
                          </div>

                          {isEditing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="address.street" label="Street" required />
                                <FormField name="address.city" label="City" required />
                                <FormField name="address.country" label="Country" required />
                                <FormField name="address.zip" label="ZIP Code" required />
                              </div>
                          ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  ["Street", values.address.street],
                                  ["City", values.address.city],
                                  ["Country", values.address.country],
                                  ["ZIP Code", values.address.zip],
                                ].map(([label, val]) => (
                                    <div key={label}>
                                      <p className="text-sm text-gray-500">{label}</p>
                                      <p className="font-medium">{val}</p>
                                    </div>
                                ))}
                              </div>
                          )}
                        </section>

                        {/* ROLES */}
                        <section className="bg-[#F4F6F6] p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <FaIdBadge className="text-[#2E4053] mr-2" />
                            <h2 className="text-lg font-semibold text-[#2E4053]">
                              Roles
                            </h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {roles.map((role, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-[#2E4053] text-white text-sm rounded-full"
                                >
                        {role}
                      </span>
                            ))}
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            * Roles are assigned by administrators and cannot be changed
                            here.
                          </p>
                        </section>
                        <br />
                        <br />
                        <Button variant="secondary" onClick={() => setShowPwdModal(true)}>
                          <FaKey className="mr-2" /> Change Password
                        </Button>
                      </div>
                    </div>
                  </Form>
              )}
            </Formik>
        )}

        {/* ---------------- Change-Password modal ---------------- */}
        {showPwdModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FaKey className="mr-2" /> Change Password
                </h2>

                <Formik
                    initialValues={{ currentPassword: "", newPassword: "", confirm: "" }}
                    validationSchema={PasswordSchema}
                    onSubmit={async (vals, { setSubmitting, resetForm }) => {
                      try {
                        await API.post("/public/user/change-password", {
                          currentPassword: vals.currentPassword,
                          newPassword: vals.newPassword
                        });
                        toast.success("Password updated ✔️");
                        setShowPwdModal(false);
                        resetForm();
                      } catch (e) {
                        console.error(e);
                        toast.error("Password change failed ❌");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                >
                  {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <FormField
                            name="currentPassword"
                            label="Current Password"
                            type="password"
                            required
                        />
                        <FormField
                            name="newPassword"
                            label="New Password"
                            type="password"
                            required
                        />
                        <FormField
                            name="confirm"
                            label="Confirm New Password"
                            type="password"
                            required
                        />

                        <div className="flex justify-end space-x-2 pt-2">
                          <Button
                              variant="secondary"
                              onClick={() => setShowPwdModal(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                              variant="primary"
                              type="submit"
                              disabled={isSubmitting}
                          >
                            {isSubmitting ? "Saving…" : "Save"}
                          </Button>
                        </div>
                      </Form>
                  )}
                </Formik>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProfilePage;