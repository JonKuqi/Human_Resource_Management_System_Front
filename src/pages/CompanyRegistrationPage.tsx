"use client"
export const dynamic = 'force-dynamic';
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import FormField from "../components/FormField"
import Button from "../components/Button"
import { FaBuilding } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"
import axios from "axios"

// Validation schema
const CompanyRegistrationSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required").min(2, "Company name must be at least 2 characters"),
  contactEmail: Yup.string().email("Invalid email address").required("Contact email is required"),
  address: Yup.object().shape({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    zip: Yup.string().required("ZIP code is required"),
  }),
})

const CompanyRegistrationPage = () => {
  const { colors } = useTheme()
  const navigate = useNavigate()

  const initialValues = {
    name: "",
    contactEmail: "",
    address: {
      street: "",
      city: "",
      country: "",
      zip: "",
    },
  }

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await axios.post("http://localhost:8081/api/v1/public/tenant/register", values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      alert("Check your email for verification")
      navigate("/")
    } catch (error: any) {
      console.error("Company registration failed:", error)
      alert(error?.response?.data?.error || "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center bg-[#F4F6F6]">
      <div className="max-w-3xl w-full mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold inline-flex items-center">
            <span style={{ color: colors.primary }}>Nex</span>
            <span style={{ color: colors.accent }}>HR</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-[#1C2833]">Register Your Company</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of companies that use NexHR to streamline their HR operations
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-[#F4F6F6] p-3">
              <FaBuilding size={24} className="text-[#2E4053]" />
            </div>
          </div>

          <Formik initialValues={initialValues} validationSchema={CompanyRegistrationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="bg-[#F4F6F6] p-4 rounded-md mb-6">
                  <h3 className="text-lg font-medium text-[#2E4053] mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <FormField label="Company Name" name="name" placeholder="Your Company Name" required />
                    <FormField
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      placeholder="contact@yourcompany.com"
                      required
                    />
                  </div>
                </div>

                <div className="bg-[#F4F6F6] p-4 rounded-md">
                  <h3 className="text-lg font-medium text-[#2E4053] mb-4">Company Address</h3>
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
                    {isSubmitting ? "Creating..." : "Create Company"}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                  By registering, you agree to our{" "}
                  <Link to="/terms" className="font-medium text-[#2E4053] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-[#2E4053] hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have a company account?{" "}
            <Link to="/login" className="font-medium text-[#2E4053] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CompanyRegistrationPage
