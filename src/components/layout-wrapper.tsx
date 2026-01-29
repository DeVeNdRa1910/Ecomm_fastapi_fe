"use client"

import { SmoothScroll } from "./smooth-scroll"
import { ToastContainer } from "./ui/toast-container"
import { AuthInitializer } from "./auth-initializer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      <SmoothScroll>{children}</SmoothScroll>
      <ToastContainer />
    </>
  )
}

