"use client";

import { useEffect, useState } from "react";
import { usePermissions } from "../../context/PermissionContext";
import { useTheme } from "../../context/ThemeContext";
import { format } from "date-fns";
import { FaPlus, FaTimes } from "react-icons/fa";
import Button from "../../components/Button";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_tenant_id: number;
}

interface Notification {
  notificationId: number;
  title: string;
  description: string;
  createdAt: string;
  expiresAt: string;
}

const API = axios.create({
  baseURL: "http://humanresourcemanagementsystemback-production.up.railway.app/api/v1",
  withCredentials: true,
});
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const NotificationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  expiresAt: Yup.date().required("Expiry date is required"),
});

const CompanyNews = () => {
  const { permissions } = usePermissions();
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const canCreate = permissions.includes("POST:/api/v1/tenant/notification");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/tenant/notification");
        const sorted = res.data.sort((a: Notification, b: Notification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sorted);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const createNotification = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const rawToken = localStorage.getItem("token");
      if (!rawToken) throw new Error("JWT token missing");

      const { user_tenant_id } = jwtDecode<JwtPayload>(rawToken);

      const payload = {
        title: values.title,
        description: values.description,
        createdAt: new Date().toISOString(),
        expiresAt: `${values.expiresAt}T00:00:00`,
        userTenant: { userTenantId: user_tenant_id },
      };

      const res = await API.post("/tenant/notification", payload);
      setNotifications((prev) =>
          [res.data, ...prev].sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to create notification", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1C2833]">Company News</h1>
          {canCreate && (
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <FaPlus className="mr-2" /> Add Notification
              </Button>
          )}
        </div>

        {loading ? (
            <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
            <p className="text-gray-500">No notifications available.</p>
        ) : (
            <div className="grid gap-4">
              {notifications.map((n) => (
                  <div key={n.notificationId} className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl text-center italic font-bold underline text-[#2E4053] mb-4">
                      {n.title}
                    </h2>
                    <p className="text-gray-800 text-justify leading-relaxed mb-3">{n.description}</p>
                    <p className="text-sm text-gray-500 text-right">
                      Created: {format(new Date(n.createdAt), "PPP")} &nbsp;|&nbsp;
                      Expires: {format(new Date(n.expiresAt), "PPP")}
                    </p>
                  </div>
              ))}
            </div>
        )}

        {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Create Notification</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500">
                    <FaTimes />
                  </button>
                </div>

                <Formik
                    initialValues={{
                      title: "",
                      description: "",
                      expiresAt: "",
                    }}
                    validationSchema={NotificationSchema}
                    onSubmit={createNotification}
                >
                  {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Title</label>
                          <Field
                              name="title"
                              className="w-full p-2 border rounded"
                              placeholder="Enter title"
                          />
                          <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Description</label>
                          <Field
                              name="description"
                              as="textarea"
                              className="w-full p-2 border rounded"
                              placeholder="Enter description"
                              rows={4}
                          />
                          <ErrorMessage
                              name="description"
                              component="div"
                              className="text-red-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Expires At</label>
                          <Field
                              name="expiresAt"
                              type="date"
                              className="w-full p-2 border rounded"
                          />
                          <ErrorMessage
                              name="expiresAt"
                              component="div"
                              className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? "Creating…" : "Create"}
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

export default CompanyNews;