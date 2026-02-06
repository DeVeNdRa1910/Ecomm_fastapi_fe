"use client"

import { useEffect } from "react"
import { SmoothScroll } from "./smooth-scroll"
import { ToastContainer } from "./ui/toast-container"
import { AuthInitializer } from "./auth-initializer"
import { useThemeColorStore, applyThemeColor } from "@/store/useThemeColorStore"

function ThemeColorInitializer() {
  const { primaryColor } = useThemeColorStore()

  useEffect(() => {
    // Apply theme color on mount
    applyThemeColor(primaryColor)

    // Watch for theme changes (dark/light mode toggle) and admin attribute changes
    const observer = new MutationObserver(() => {
      applyThemeColor(primaryColor)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-admin"],
    })

    return () => {
      observer.disconnect()
    }
  }, [primaryColor])

  return null
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      <ThemeColorInitializer />
      <SmoothScroll>{children}</SmoothScroll>
      <ToastContainer />
    </>
  )
}

