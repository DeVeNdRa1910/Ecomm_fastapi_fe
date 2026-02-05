"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, RotateCcw } from "lucide-react"
import { useThemeColorStore } from "@/store/useThemeColorStore"
import { useToast } from "@/lib/toast-context"
import { useTheme } from "next-themes"

const DEFAULT_LIGHT_COLOR = "#22c55e" // Green
const DEFAULT_DARK_COLOR = "#ff6600" // Orange

export default function AdminSettings() {
  const { primaryColor, setPrimaryColor } = useThemeColorStore()
  const { success } = useToast()
  const { theme } = useTheme()
  const [currentColor, setCurrentColor] = useState(primaryColor)

  useEffect(() => {
    setCurrentColor(primaryColor)
  }, [primaryColor])

  const handlePresetColorChange = (color: string) => {
    setCurrentColor(color)
    setPrimaryColor(color)
    success("Theme color updated!")
  }

  const handleColorInputChange = (color: string) => {
    setCurrentColor(color)
    setPrimaryColor(color)
  }

  const handleColorInputBlur = () => {
    // Show toast only when user finishes selecting color from color picker
    success("Theme color updated!")
  }

  const handleReset = () => {
    const isDark = theme === "dark"
    const defaultColor = isDark ? DEFAULT_DARK_COLOR : DEFAULT_LIGHT_COLOR
    setCurrentColor(defaultColor)
    setPrimaryColor(defaultColor)
    success("Theme color reset to default!")
  }

  // Preset colors for quick selection
  const presetColors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Orange", value: "#ff6600" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Red", value: "#ef4444" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Indigo", value: "#6366f1" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your admin panel settings
        </p>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customization
          </CardTitle>
          <CardDescription>
            Customize the primary color of your admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Picker */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-color" className="text-base font-medium">
                Primary Color
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose a color to customize your theme. Black and white colors
                for dark and light modes remain unchanged.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Color Input */}
              <div className="relative">
                      <input
                        type="color"
                        id="theme-color"
                        value={currentColor}
                        onChange={(e) => handleColorInputChange(e.target.value)}
                        onBlur={handleColorInputBlur}
                        className="h-16 w-16 rounded-lg border-2 border-border cursor-pointer shadow-lg"
                        style={{
                          backgroundColor: currentColor,
                        }}
                      />
              </div>

              {/* Color Display */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-24 rounded-lg border-2 border-border shadow-md"
                    style={{ backgroundColor: currentColor }}
                  />
                  <div>
                    <p className="font-mono text-sm font-medium">
                      {currentColor.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current theme color
                    </p>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="shadow-md"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </div>

          {/* Preset Colors */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Select</Label>
            <p className="text-sm text-muted-foreground">
              Choose from popular color presets
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {presetColors.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handlePresetColorChange(preset.value)}
                        className={`relative h-12 w-12 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-lg ${
                    currentColor.toLowerCase() === preset.value.toLowerCase()
                      ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                  aria-label={`Select ${preset.name} color`}
                >
                  {currentColor.toLowerCase() === preset.value.toLowerCase() && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-base font-medium">Preview</Label>
            <div className="flex flex-wrap gap-3">
              <Button className="shadow-md">Primary Button</Button>
              <Button variant="secondary" className="shadow-md">
                Secondary Button
              </Button>
              <Button variant="outline" className="shadow-md">
                Outline Button
              </Button>
              <div className="px-4 py-2 rounded-md bg-primary/10 text-primary font-medium">
                Primary Text
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
