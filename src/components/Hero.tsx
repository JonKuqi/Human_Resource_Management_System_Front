"use client"

import { Link } from "react-router-dom"
import Button from "./Button"
import { useTheme } from "../context/ThemeContext"

const Hero = () => {
  const { colors } = useTheme()

  return (
    <div
      className="relative bg-cover bg-center py-20 md:py-32"
      style={{
        backgroundColor: colors.secondary,
        backgroundImage: "linear-gradient(rgba(28, 40, 51, 0.9), rgba(28, 40, 51, 0.8)), url(/images/hero-bg.jpg)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
        <div className="md:max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Simplify Your <span style={{ color: colors.accent }}>HR Management</span> Process
          </h1>
          <p className="mt-6 text-lg text-white opacity-90">
            NexHR provides a comprehensive solution for managing your workforce, streamlining recruitment, and enhancing
            employee experience.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
            <Link to="/tenant/signup">
              <Button
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-[#2E4053]"
              >
                Register Company
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
