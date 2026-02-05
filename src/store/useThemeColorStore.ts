import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeColorState {
  primaryColor: string
  setPrimaryColor: (color: string) => void
}

const DEFAULT_LIGHT_COLOR = "#22c55e" // Green

export const useThemeColorStore = create<ThemeColorState>()(
  persist(
    (set) => ({
      primaryColor: DEFAULT_LIGHT_COLOR,
      setPrimaryColor: (color: string) => {
        set({ primaryColor: color })
        // Apply color immediately
        applyThemeColor(color)
      },
    }),
    {
      name: "ecomm-theme-color-storage",
    }
  )
)

// Function to apply theme color to CSS variables
export function applyThemeColor(color: string) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const isDark = root.classList.contains("dark")
  const isAdmin = root.getAttribute("data-admin") === "true"

  // Calculate and set related colors based on the primary color
  const rgb = hexToRgb(color)
  if (!rgb) return

  if (isAdmin) {
    // Admin panel: update --admin-primary and related admin variables
    root.style.setProperty("--admin-primary", color, "important")
    root.style.setProperty("--admin-ring", color, "important")

    if (isDark) {
      // Dark mode: create darker variants
      root.style.setProperty("--admin-secondary", adjustBrightness(color, -0.85), "important")
      root.style.setProperty("--admin-muted", adjustBrightness(color, -0.9), "important")
      root.style.setProperty("--admin-accent", adjustBrightness(color, -0.8), "important")
      root.style.setProperty("--admin-border", adjustBrightness(color, -0.7), "important")
      root.style.setProperty("--admin-input", adjustBrightness(color, -0.7), "important")
    } else {
      // Light mode: create lighter tints
      root.style.setProperty("--admin-secondary", adjustBrightness(color, 0.95), "important")
      root.style.setProperty("--admin-muted", adjustBrightness(color, 0.97), "important")
      root.style.setProperty("--admin-accent", adjustBrightness(color, 0.92), "important")
    }

    // Update admin background gradient
    const alpha = isDark ? 0.22 : 0.18
    const gradientColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    const bodyStyle = document.body.style
    if (isDark) {
      bodyStyle.background = `radial-gradient(1000px 600px at 50% -150px, ${gradientColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 60%), var(--background)`
      bodyStyle.boxShadow = `0 0 100px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
    } else {
      bodyStyle.background = `radial-gradient(1000px 600px at 50% -150px, ${gradientColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 60%), var(--background)`
    }
  } else {
    // Regular pages: update --primary and related variables
    root.style.setProperty("--primary", color, "important")
    root.style.setProperty("--ring", color, "important")

    if (isDark) {
      // Dark mode: create darker variants
      root.style.setProperty("--secondary", adjustBrightness(color, -0.85), "important")
      root.style.setProperty("--muted", adjustBrightness(color, -0.9), "important")
      root.style.setProperty("--accent", adjustBrightness(color, -0.8), "important")
      root.style.setProperty("--border", adjustBrightness(color, -0.7), "important")
      root.style.setProperty("--input", adjustBrightness(color, -0.7), "important")
    } else {
      // Light mode: create lighter tints
      root.style.setProperty("--secondary", adjustBrightness(color, 0.95), "important")
      root.style.setProperty("--muted", adjustBrightness(color, 0.97), "important")
      root.style.setProperty("--accent", adjustBrightness(color, 0.92), "important")
    }

    // Update background gradient
    const alpha = isDark ? 0.22 : 0.18
    const gradientColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    const bodyStyle = document.body.style
    if (isDark) {
      bodyStyle.background = `radial-gradient(1000px 600px at 50% -150px, ${gradientColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 60%), var(--background)`
    } else {
      bodyStyle.background = `radial-gradient(1000px 600px at 50% -150px, ${gradientColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 60%), var(--background)`
    }
  }
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Helper function to adjust brightness of a color
function adjustBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  // For darkening (negative factor), multiply
  // For lightening (positive factor), add to white
  if (factor < 0) {
    const r = Math.max(0, Math.min(255, Math.round(rgb.r * (1 + factor))))
    const g = Math.max(0, Math.min(255, Math.round(rgb.g * (1 + factor))))
    const b = Math.max(0, Math.min(255, Math.round(rgb.b * (1 + factor))))
    return `rgb(${r}, ${g}, ${b})`
  } else {
    const r = Math.round(rgb.r + (255 - rgb.r) * factor)
    const g = Math.round(rgb.g + (255 - rgb.g) * factor)
    const b = Math.round(rgb.b + (255 - rgb.b) * factor)
    return `rgb(${r}, ${g}, ${b})`
  }
}

// Note: Theme color initialization is handled by ThemeColorInitializer component

