"use client"

import { useEffect, useRef, useState } from "react"
import { motion, motionValue, type MotionValue } from "framer-motion"
import { useTheme } from "next-themes"

interface Blob {
  id: number
  size: number
  radius: number
  // top-left position (px)
  x: number
  y: number
  vx: number
  vy: number
  xMv: MotionValue<number>
  yMv: MotionValue<number>
}

export function AnimatedBackground() {
  const { resolvedTheme } = useTheme()
  const animationFrameRef = useRef<number | null>(null)
  const lastTRef = useRef<number | null>(null)
  const viewportRef = useRef({ w: 0, h: 0 })
  const cursorYRef = useRef<number | null>(null)
  const speedRef = useRef(0.6)
  const blobsRef = useRef<Blob[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const updateViewport = () => {
      viewportRef.current = { w: window.innerWidth, h: window.innerHeight }
    }

    const computeSpeed = () => {
      const { h } = viewportRef.current
      const doc = document.documentElement
      const scrollMax = Math.max(1, doc.scrollHeight - h)
      const scrollProgress = clamp01(window.scrollY / scrollMax) // top 0 -> bottom 1

      const cursorY = cursorYRef.current
      const cursorProgress =
        cursorY == null || h <= 0 ? 0.2 : clamp01(cursorY / h) // top 0 -> bottom 1

      // Required behavior:
      // - bottom of page => faster
      // - cursor near top => slower
      // Make scroll position the dominant factor (bottom is always fast),
      // while cursor only gently modulates the speed.
      const scrollFactor = 0.5 + 2.5 * scrollProgress // 0.5..3.0
      const cursorFactor = 0.8 + 0.4 * cursorProgress // 0.8..1.2
      speedRef.current = scrollFactor * cursorFactor // ~0.4..3.6
    }

    const onScroll = () => computeSpeed()
    const onPointerMove = (e: PointerEvent) => {
      cursorYRef.current = e.clientY
      computeSpeed()
    }
    const onResize = () => {
      updateViewport()
      computeSpeed()
    }

    updateViewport()
    computeSpeed()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("resize", onResize, { passive: true } as any)

    // Initialize 5 blobs (bigger)
    const { w, h } = viewportRef.current
    const initial: Blob[] = Array.from({ length: 5 }).map((_, idx) => {
      const size = rand(300, 520)
      const radius = size / 2
      const x = rand(0, Math.max(0, w - size))
      const y = rand(0, Math.max(0, h - size))

      // Base velocity in px/sec (will be scaled by dt + speedRef).
      const vx = rand(-70, 70) || (idx % 2 === 0 ? 55 : -55)
      const vy = rand(-70, 70) || (idx % 2 === 0 ? -45 : 45)

      return {
        id: idx + 1,
        size,
        radius,
        x,
        y,
        vx,
        vy,
        xMv: motionValue(x),
        yMv: motionValue(y),
      }
    })
    blobsRef.current = initial
    setReady(true)

    const animate = (t: number) => {
      const { w: vw, h: vh } = viewportRef.current
      if (vw <= 0 || vh <= 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const lastT = lastTRef.current ?? t
      const dtMs = Math.min(32, Math.max(8, t - lastT))
      lastTRef.current = t

      // Normalize so 16.67ms ~= 1
      const dt = dtMs / 16.67
      const s = speedRef.current

      // Light damping is fine, but we must never let blobs decay to a stop.
      const damping = 0.9992
      const bounceLoss = 0.985
      const blobs = blobsRef.current

      // Integrate + boundary reflection
      for (const b of blobs) {
        b.x += b.vx * dt * s * 0.12
        b.y += b.vy * dt * s * 0.12

        const maxX = Math.max(0, vw - b.size)
        const maxY = Math.max(0, vh - b.size)

        if (b.x <= 0) {
          b.x = 0
          b.vx = Math.abs(b.vx) * bounceLoss
        } else if (b.x >= maxX) {
          b.x = maxX
          b.vx = -Math.abs(b.vx) * bounceLoss
        }

        if (b.y <= 0) {
          b.y = 0
          b.vy = Math.abs(b.vy) * bounceLoss
        } else if (b.y >= maxY) {
          b.y = maxY
          b.vy = -Math.abs(b.vy) * bounceLoss
        }

        b.vx *= damping
        b.vy *= damping

        // Keep a minimum speed so motion never "dies" over time.
        // Tie it to scroll-based speed so bottom remains fast consistently.
        const vMag = Math.hypot(b.vx, b.vy)
        const minMag = 45 + 35 * s // ~59..171
        const maxMag = 220 + 80 * s // ~252..508 (safety clamp)
        if (vMag < 0.001) {
          // If direction is lost, re-seed it.
          const angle = Math.random() * Math.PI * 2
          b.vx = Math.cos(angle) * minMag
          b.vy = Math.sin(angle) * minMag
        } else if (vMag < minMag) {
          const k = minMag / vMag
          b.vx *= k
          b.vy *= k
        } else if (vMag > maxMag) {
          const k = maxMag / vMag
          b.vx *= k
          b.vy *= k
        }
      }

      // Collisions (elastic-ish)
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i]
          const b = blobs[j]

          const ax = a.x + a.radius
          const ay = a.y + a.radius
          const bx = b.x + b.radius
          const by = b.y + b.radius

          const dx = ax - bx
          const dy = ay - by
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = a.radius + b.radius
          if (dist <= 0 || dist >= minDist) continue

          const nx = dx / dist
          const ny = dy / dist

          const rvx = a.vx - b.vx
          const rvy = a.vy - b.vy
          const velAlongNormal = rvx * nx + rvy * ny
          if (velAlongNormal > 0) continue

          const restitution = 0.9
          const invMassA = 1 / a.size
          const invMassB = 1 / b.size

          const impulse =
            (-(1 + restitution) * velAlongNormal) / (invMassA + invMassB)

          a.vx += impulse * invMassA * nx
          a.vy += impulse * invMassA * ny
          b.vx -= impulse * invMassB * nx
          b.vy -= impulse * invMassB * ny

          // Separate overlap
          const overlap = minDist - dist
          const sep = overlap / (invMassA + invMassB)
          a.x += sep * invMassA * nx
          a.y += sep * invMassA * ny
          b.x -= sep * invMassB * nx
          b.y -= sep * invMassB * ny
        }
      }

      // Commit to motion values
      for (const b of blobs) {
        b.xMv.set(b.x)
        b.yMv.set(b.y)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("scroll", onScroll as any)
      window.removeEventListener("pointermove", onPointerMove as any)
      window.removeEventListener("resize", onResize as any)
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  if (!ready) return null

  // Theme colors
  const primaryColorLight = resolvedTheme === "dark"
    ? "rgba(255, 102, 0, 0.15)" 
    : "rgba(34, 197, 94, 0.15)"
  const primaryColorMedium = resolvedTheme === "dark"
    ? "rgba(255, 102, 0, 0.25)"
    : "rgba(34, 197, 94, 0.25)"
  const primaryColorStrong = resolvedTheme === "dark"
    ? "rgba(255, 102, 0, 0.35)"
    : "rgba(34, 197, 94, 0.35)"

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {blobsRef.current.map((blob, index) => {
        const blur = index % 2 === 0 ? "blur-3xl" : "blur-[80px]"
        return (
          <motion.div
            key={blob.id}
            className={`absolute rounded-full ${blur}`}
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              background: `radial-gradient(circle, ${primaryColorStrong}, ${primaryColorMedium}, ${primaryColorLight}, transparent)`,
              x: blob.xMv,
              y: blob.yMv,
            }}
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              scale: {
                duration: 6 + index * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        )
      })}
    </div>
  )
}

