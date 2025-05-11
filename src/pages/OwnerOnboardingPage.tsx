"use client"

import { Formik, Form } from "formik"
import * as Yup from "yup"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import FormField from "../components/FormField"
import Button from "../components/Button"
import { FaUserShield } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"
import axios from "axios"

const OwnerOnboardingSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone number is required"),
  gender: Yup.string().required("Gender is required").oneOf(["M", "F", "O"], "Please select a valid gender"),
  address: Yup.object().shape({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    zip: Yup.string().required("ZIP code is required"),
  }),
})

const OwnerOnboardingPage = () => {
  const { colors } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()

  if (!searchParams) {
    return <div className="text-center mt-20 text-lg text-red-600">You do not have access to this page.</div>
  }
  
  const token = searchParams.get("token")
  if (!token) {
    return <div className="text-center mt-20 text-lg text-red-600">Missing or invalid verification token.</div>
  }

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    address: {
      street: "",
      city: "",
      country: "",
      zip: "",
    },
  }

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (!token) {
        alert("Missing or invalid token.")
        return
      }

      const payload = { ...values, token }

      await axios.post("http://localhost:8081/api/v1/public/tenant/onboard", payload)

      alert("Account created successfully. Please log in.")
      router.push("/")
    } catch (err) {
      console.error("Error creating owner:", err)
      alert("Something went wrong. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center bg-[#F4F6F6]">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold inline-flex items-center">
            <span style={{ color: colors.primary }}>Nex</span>
            <span style={{ color: colors.accent }}>HR</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-[#1C2833]">CREATE OWNER</h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete your account setup to start managing your company's HR operations
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-[#F4F6F6] p-3">
              <FaUserShield size={24} className="text-[#2E4053]" />
            </div>
          </div>

          <Formik initialValues={initialValues} validationSchema={OwnerOnboardingSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="bg-[#F4F6F6] p-4 rounded-md mb-6">
                  <h3 className="text-lg font-medium text-[#2E4053] mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Username" name="username" placeholder="johndoe" required />
                      <FormField label="Email" name="email" type="email" placeholder="john.doe@example.com" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Password" name="password" type="password" placeholder="••••••••" required />
                      <FormField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" required />
                    </div>
                  </div>
                </div>

                <div className="bg-[#F4F6F6] p-4 rounded-md mb-6">
                  <h3 className="text-lg font-medium text-[#2E4053] mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="First Name" name="firstName" placeholder="John" required />
                      <FormField label="Last Name" name="lastName" placeholder="Doe" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Phone" name="phone" placeholder="+1 (555) 123-4567" required />
                      <div>
                        <label htmlFor="gender" className="block text-[#2E4053] font-medium mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={values.gender}
                          onChange={(e) => setFieldValue("gender", e.target.value)}
                          className="w-full p-3 border-2 border-[#BDC3C7] rounded-md focus:outline-none focus:border-[#2E4053] bg-white"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F4F6F6] p-4 rounded-md">
                  <h3 className="text-lg font-medium text-[#2E4053] mb-4">Address</h3>
                  <div className="space-y-4">
                    <FormField label="Street" name="address.street" placeholder="123 Main Street" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="City" name="address.city" placeholder="City" required />
                      <FormField label="Country" name="address.country" placeholder="Country" required />
                    </div>
                    <FormField label="ZIP Code" name="address.zip" placeholder="10000" required />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Owner Account"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default OwnerOnboardingPage
