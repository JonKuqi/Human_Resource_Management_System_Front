"use client"

import type React from "react"

interface ButtonProps {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "outline"
  className?: string
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = "py-2 px-6 rounded-md transition-all duration-300 font-medium"

  const variantClasses = {
    primary: "bg-[#2E4053] text-white hover:bg-[#1C2833]",
    secondary: "bg-[#AAB7B8] text-[#1C2833] hover:bg-[#BDC3C7]",
    outline: "border-2 border-[#2E4053] text-[#2E4053] hover:bg-[#2E4053] hover:text-white",
  }

  const widthClass = fullWidth ? "w-full" : ""
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
