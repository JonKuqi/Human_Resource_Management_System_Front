import type React from "react"
import { Field, ErrorMessage } from "formik"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  as?: string
  rows?: number
  required?: boolean
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  as,
  rows,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-[#2E4053] font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {as === "textarea" ? (
        <Field
          as="textarea"
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows || 4}
          className="w-full p-3 border-2 border-[#BDC3C7] rounded-md focus:outline-none focus:border-[#2E4053] bg-white"
        />
      ) : (
        <Field
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          className="w-full p-3 border-2 border-[#BDC3C7] rounded-md focus:outline-none focus:border-[#2E4053] bg-white"
        />
      )}
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  )
}

export default FormField
