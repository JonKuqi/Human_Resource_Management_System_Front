'use client'
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from 'next/navigation'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import FormField from '../components/FormField'
import Button from '../components/Button'
import { FaUserShield } from 'react-icons/fa'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

const OwnerOnboardingSchema = Yup.object().shape({
    username: Yup.string()
        .required("Username is required")
        .min(3)
        .matches(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string().required().min(8),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password")]),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    phone: Yup.string().required(),
    gender: Yup.string().required().oneOf(["M", "F", "O"]),
    address: Yup.object().shape({
        street: Yup.string().required(),
        city: Yup.string().required(),
        country: Yup.string().required(),
        zip: Yup.string().required(),
    }),
})

export default function OwnerOnboardingContent() {
    const { colors } = useTheme()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams?.get("token")

    if (!token) {
        return (
            <div className="text-center mt-20 text-lg text-red-600">
                Missing or invalid verification token.
            </div>
        )
    }

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "", // still needed for form validation
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

    const handleSubmit = async (
        values: typeof initialValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            // Exclude confirmPassword before sending
            const { confirmPassword, ...dataToSend } = values

            await axios.post("http://localhost:8081/api/v1/public/tenant/onboard", {
                ...dataToSend,
                token,
            })

            alert("Account created successfully. Please log in.")
            router.push("/login")
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

                    <Formik
                        initialValues={initialValues}
                        validationSchema={OwnerOnboardingSchema}
                        onSubmit={handleSubmit}
                    >
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