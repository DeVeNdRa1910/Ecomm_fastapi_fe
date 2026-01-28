"use client"

import { SmoothScroll } from "./smooth-scroll"
import { ToastContainer } from "./ui/toast-container"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll>{children}</SmoothScroll>
      <ToastContainer />
    </>
  )
}

