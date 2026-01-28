"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import LocomotiveScroll from "locomotive-scroll"
import "locomotive-scroll/dist/locomotive-scroll.css"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Locomotive Scroll v5 uses native scrolling (built on Lenis) and exposes
    // `resize()` (not `update()` like v4).
    const locomotiveScroll = new LocomotiveScroll()

    locomotiveScrollRef.current = locomotiveScroll

    // Update on window resize
    const handleResize = () => {
      locomotiveScroll.resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      locomotiveScroll.destroy()
    }
  }, [])

  // Update scroll on route change
  useEffect(() => {
    const instance = locomotiveScrollRef.current
    if (!instance) return

    // Next.js route changes may alter layout; trigger a recalculation.
    const t = window.setTimeout(() => {
      instance.resize()
      instance.scrollTo(0, { duration: 0 })
    }, 100)

    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  )
}

