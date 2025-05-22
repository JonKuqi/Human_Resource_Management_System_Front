"use client"
export const dynamic = 'force-dynamic';
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import FormField from "../components/FormField"
import Button from "../components/Button"
import { FaLock } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { decode } from "punycode"

interface DecodedToken {
  role: string;
  user_tenant_id: number;
}



const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
})

const LoginPage = () => {
  const { colors } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem("token")
  }, [])

 const handleSubmit = async (values: any, { setSubmitting }: any) => {
  try {
    const response = await axios.post(`http://localhost:8081/api/v1/public/user/authenticate`, {
      email: values.email,
      password: values.password,
    })

    const token = response.data.token
    localStorage.setItem("token", token)

    const decoded = jwtDecode<DecodedToken>(token)
    console.log("Decoded Role:", decoded.role)

    const { role, user_tenant_id: userTenantId } = decoded

    if (role === "TENANT_USER") {
      const userRolesResponse = await axios.get(
        `http://localhost:8081/api/v1/tenant/user-role/filter?userTenantId=/${userTenantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const roles = userRolesResponse.data
      const roleName = roles[0]?.role?.roleName?.toLowerCase() || ""

      if (roleName === "owner") {
        navigate("/tenant/dashboard")
      } else if (roleName === "hr") {
        navigate("/tenant/hr/dashboard")
      } else {
        navigate("/tenant")
      }

    } else if (role === "GENERAL_USER") {
      navigate("/user")
    } else {
      navigate("/")
    }

  } catch (error: any) {
    console.error("Login failed:", error)

    const message = error.response?.data?.error || ""
    console.log("Error message:", message)

    if (message.toLowerCase().includes("email not verified")) {
      // Save email for prefill on verification page
      localStorage.setItem("pendingEmail", values.email)
      navigate("/verify-email")
    } else if (message) {
      alert(message)
    } else {
      alert("Invalid email or password.")
    }

  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold inline-flex items-center">
            <span style={{ color: colors.primary }}>Nex</span>
            <span style={{ color: colors.accent }}>HR</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-[#1C2833]">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/signup" className="font-medium text-[#2E4053] hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-[#F4F6F6] p-3">
              <FaLock size={24} className="text-[#2E4053]" />
            </div>
          </div>

          <Formik
            initialValues={{ email: "", password: "", rememberMe: false }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, handleChange }) => (
              <Form className="space-y-6">
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={values.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#2E4053] focus:ring-[#2E4053] border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-[#2E4053] hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Are you a company?{" "}
            <Link to="/tenant/login" className="font-medium text-[#2E4053] hover:underline">
              Sign in to your company account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
