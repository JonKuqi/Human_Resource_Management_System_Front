"use client"

import type React from "react"
import { createContext, useContext, type ReactNode } from "react"

type ThemeContextType = {
  colors: {
    primary: string
    secondary: string
    accent: string
    light: string
    background: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme: ThemeContextType = {
    colors: {
      primary: "#2E4053", // dark blue-gray
      secondary: "#1C2833", // very dark blue-gray
      accent: "#AAB7B8", // light gray
      light: "#BDC3C7", // lighter gray
      background: "#F4F6F6", // almost white
    },
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
