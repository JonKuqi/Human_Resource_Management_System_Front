"use client"

import { Formik, Form } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import FormField from "../components/FormField"
import Button from "../components/Button"
import { FaUserPlus } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"
import axios from "axios"
export const dynamic = 'force-dynamic';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required").min(2),
  lastName: Yup.string().required("Last name is required").min(2),
  username: Yup.string().required("Username is required"),
  phone: Yup.string().required("Phone is required"),
  gender: Yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
  birthDate: Yup.date().required("Birth date is required"),
  email: Yup.string().email("Invalid email").required(),
  password: Yup.string()
    .required()
    .min(8)
     .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords must match"),
  agreeTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
})

const SignupPage = () => {
  const { colors } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const payload = {
      email: values.email,
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      gender: values.gender,
      birthDate: values.birthDate,
    }

    try {
      const response = await axios.post("https://humanresourcemanagementsystemback-production.up.railway.app/api/v1/public/user-general/register", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      const {token, verified} = response.data;
      localStorage.setItem("token", token)
      localStorage.setItem("email", values.email)

      if (!verified) {
        navigate("/verify-email"); // ✅ we’ll build this page
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error("Registration failed", error)
      if (error.response?.data?.error) {
        alert(error.response.data.error)
      } else {
        alert("Something went wrong during registration.")
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
          <h2 className="mt-6 text-3xl font-extrabold text-[#1C2833]">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#2E4053] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-[#F4F6F6] p-3">
              <FaUserPlus size={24} className="text-[#2E4053]" />
            </div>
          </div>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              username: "",
              phone: "",
              gender: "",
              birthDate: "",
              email: "",
              password: "",
              confirmPassword: "",
              agreeTerms: false,
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, handleChange }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="First Name" name="firstName" required />
                  <FormField label="Last Name" name="lastName" required />
                  <FormField label="Username" name="username" required />
                  <FormField label="Phone" name="phone" required />
                </div>

                <FormField label="Gender" name="gender" placeholder="Male | Female | Other" required />
                <FormField label="Birth Date" name="birthDate" type="date" required />
                <FormField label="Email Address" name="email" type="email" required />
                <FormField label="Password" name="password" type="password" required />
                <FormField label="Confirm Password" name="confirmPassword" type="password" required />

                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={values.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#2E4053] focus:ring-[#2E4053] border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="font-medium text-[#2E4053] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="font-medium text-[#2E4053] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Want to register your company?{" "}
            <Link to="/tenant/signup" className="font-medium text-[#2E4053] hover:underline">
              Create a company account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
