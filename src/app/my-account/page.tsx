"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { authApi, type UserInfo } from "@/lib/auth-api"
import { tokenManager } from "@/lib/cookies"
import { useToast } from "@/lib/toast-context"
import { validatePassword } from "@/lib/password-validation"
import { useAuthStore } from "@/store/useAuthStore"
import {
  indianStates,
  getLocationByPincode,
  getLocationByPincodeAPI,
  getCitiesByState,
  type IndianState,
} from "@/lib/indian-locations"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnimatedBackground } from "@/components/animated-background"
import { FileUpload } from "@/components/ui/file-upload"
import { Palette, RotateCcw } from "lucide-react"
import { useThemeColorStore } from "@/store/useThemeColorStore"
import { useTheme } from "next-themes"

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, { message: "Current password is required" }),
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must be at most 20 characters" })
      .superRefine((val, ctx) => {
        const error = validatePassword(val)
        if (error) {
          ctx.addIssue({
            code: "custom",
            message: error,
          })
        }
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

const nameNoSpacesRegex = /^[A-Za-z]+$/
const mobileRegex = /^\+?\d+$/

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .max(254, { message: "Email is too long" }),
  address: z
    .string()
    .max(250, { message: "Address must be at most 250 characters" })
    .optional()
    .or(z.literal("")),
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters" })
    .regex(nameNoSpacesRegex, { message: "First name can contain letters only (no spaces)" }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters" })
    .regex(nameNoSpacesRegex, { message: "Last name can contain letters only (no spaces)" }),
  mobile_number: z
    .string()
    .min(7, { message: "Mobile number is too short" })
    .max(20, { message: "Mobile number is too long" })
    .regex(mobileRegex, { message: "Mobile number can contain only + and digits" }),
  profile_image: z.any().optional(),
})

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

export default function MyAccountPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null)
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [addressPincode, setAddressPincode] = useState("")
  const [addressCountry, setAddressCountry] = useState("India")
  const [addressState, setAddressState] = useState<IndianState | "">("")
  const [addressCity, setAddressCity] = useState("")
  const [addressText, setAddressText] = useState("")
  const [isLoadingPincode, setIsLoadingPincode] = useState(false)
  const profileFileInputRef = useRef<HTMLInputElement | null>(null)
  const imageMenuRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { user: userInfo, setUser, clearUser } = useAuthStore()
  const { primaryColor, setPrimaryColor } = useThemeColorStore()
  const { theme } = useTheme()
  const [currentColor, setCurrentColor] = useState(primaryColor)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue: setProfileValue,
    watch: watchProfile,
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      first_name: "",
      last_name: "",
      mobile_number: "",
    },
  })

  // Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = tokenManager.getToken()
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        // If user info already exists in store, use it
        if (userInfo) {
          setIsLoading(false)
          return
        }

        const user = await authApi.getMe()
        
        // Handle different possible response formats
        let userData: UserInfo = {}
        
        if (typeof user === 'string') {
          // If API returns a string, try to parse it
          try {
            userData = JSON.parse(user) as UserInfo
          } catch {
            // If it's just a plain string, use it as name
            userData = { name: user } as UserInfo
          }
        } else if (typeof user === 'object' && user !== null) {
          // Use the user data directly as it matches the API response
          userData = user as UserInfo
        }
        
        setUser(userData)
        setImageError(false) // Reset image error when user data is loaded
      } catch (error) {
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status === 401 || status === 403) {
            tokenManager.removeToken()
            clearUser()
            router.push("/signin")
          } else {
            showError("Failed to load user information")
          }
        } else {
          showError("Failed to load user information")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [router, showError])

  // Keep editable form in sync once userInfo is available/updated
  useEffect(() => {
    if (!userInfo) return
    resetProfile({
      name: userInfo.name || "",
      email: userInfo.email || "",
      address: userInfo.address || "",
      first_name: userInfo.first_name || "",
      last_name: userInfo.last_name || "",
      mobile_number: userInfo.mobile_number || "",
      profile_image: undefined,
    })
    setProfilePreviewUrl(null)
    setImageError(false)
  }, [userInfo, resetProfile])

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl)
    }
  }, [profilePreviewUrl])

  const onSubmitPassword = async (data: ChangePasswordFormValues) => {
    setIsChangingPassword(true)
    try {
      const response = await authApi.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      })

      success(response.message || "Password changed successfully!")
      reset()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password. Please try again."
      showError(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const sanitizeNameInput = (value: string) => value.replace(/[^A-Za-z]/g, "")

  const sanitizeMobileInput = (value: string) => {
    // Keep only digits and +, and ensure + appears at most once and only at the start.
    const cleaned = value.replace(/[^\d+]/g, "")
    const hasPlus = cleaned.includes("+")
    const digitsOnly = cleaned.replace(/\+/g, "")
    return hasPlus ? `+${digitsOnly}` : digitsOnly
  }

  const onSubmitProfile = async (data: UpdateProfileFormValues) => {
    setIsUpdatingProfile(true)
    try {
      const response = await authApi.updateProfile({
        name: data.name.trim(),
        email: data.email.trim(),
        address: (data.address || "").trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        mobile_number: data.mobile_number.trim(),
      })

      success(response.message || "Profile updated successfully!")

      // Refresh user in store so header + page update immediately
      const refreshed = await authApi.getMe()
      setUser(refreshed)
      setImageError(false)
      setProfilePreviewUrl(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile. Please try again."
      showError(errorMessage)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const refreshUser = async () => {
    const refreshed = await authApi.getMe()
    setUser(refreshed)
    setImageError(false)
  }

  const handleChangeImageClick = () => {
    setIsImageMenuOpen(false)
    profileFileInputRef.current?.click()
  }

  const handleRemoveImage = async () => {
    try {
      setIsUpdatingProfile(true)
      setIsImageMenuOpen(false)
      setProfilePreviewUrl(null)
      setImageError(false)

      const response = await authApi.updateProfile({ profile_image: null })
      success(response.message || "Profile image removed")
      await refreshUser()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to remove image. Please try again."
      showError(errorMessage)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleImageSelected = async (file: File) => {
    try {
      setIsUpdatingProfile(true)
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl)
      setProfilePreviewUrl(URL.createObjectURL(file))
      setImageError(false)

      const response = await authApi.updateProfile({ profile_image: file })
      success(response.message || "Profile image updated")
      await refreshUser()
      setProfilePreviewUrl(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update image. Please try again."
      showError(errorMessage)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Handle pincode change - autofill state and city
  const handlePincodeChange = async (pincode: string) => {
    setAddressPincode(pincode)
    if (pincode.length === 6) {
      setIsLoadingPincode(true)
      // Try local data first
      const location = getLocationByPincode(pincode)
      if (location) {
        // Set state and city together
        setAddressState(location.state)
        setAddressCity(location.city)
        setIsLoadingPincode(false)
      } else {
        // If not found locally, try API
        try {
          const apiLocation = await getLocationByPincodeAPI(pincode)
          if (apiLocation) {
            setAddressState(apiLocation.state)
            setAddressCity(apiLocation.city)
          } else {
            // If pincode not found, clear state and city
            setAddressState("")
            setAddressCity("")
            showError("Pincode not found. Please select state and city manually.")
          }
        } catch (error) {
          console.error("Error fetching pincode:", error)
          setAddressState("")
          setAddressCity("")
          showError("Unable to fetch pincode data. Please select state and city manually.")
        } finally {
          setIsLoadingPincode(false)
        }
      }
    } else if (pincode.length < 6) {
      // Clear state and city if pincode is incomplete
      setAddressState("")
      setAddressCity("")
      setIsLoadingPincode(false)
    }
  }


  // Parse existing address to extract components
  const parseAddress = (address: string) => {
    if (!address) {
      return {
        addressText: "",
        pincode: "",
        state: "" as IndianState | "",
        city: "",
      }
    }

    const remainingAddress = address.trim()
    let pincode = ""
    let state = "" as IndianState | ""
    let city = ""

    // Split by comma for easier parsing
    const parts = remainingAddress.split(",").map((p) => p.trim()).filter((p) => p)

    // Extract pincode (6-digit number) from any part
    for (let i = 0; i < parts.length; i++) {
      const pincodeMatch = parts[i].match(/\b\d{6}\b/)
      if (pincodeMatch) {
        pincode = pincodeMatch[0]
        parts.splice(i, 1) // Remove pincode part
        break
      }
    }

    // Extract state (try to match with our state list)
    for (let i = 0; i < parts.length; i++) {
      for (const stateName of indianStates) {
        // Try exact match (case-insensitive)
        if (parts[i].toLowerCase() === stateName.toLowerCase()) {
          state = stateName as IndianState
          parts.splice(i, 1) // Remove state part
          break
        }
      }
      if (state) break
    }

    // Extract city (try to match with cities from the matched state, or any state)
    if (state) {
      const cities = getCitiesByState(state)
      for (let i = 0; i < parts.length; i++) {
        for (const cityName of cities) {
          if (parts[i].toLowerCase() === cityName.toLowerCase()) {
            city = cityName
            parts.splice(i, 1) // Remove city part
            break
          }
        }
        if (city) break
      }
    } else {
      // If state not found, try to find city from all states
      for (let i = 0; i < parts.length; i++) {
        for (const stateName of indianStates) {
          const cities = getCitiesByState(stateName as IndianState)
          for (const cityName of cities) {
            if (parts[i].toLowerCase() === cityName.toLowerCase()) {
              city = cityName
              state = stateName as IndianState
              parts.splice(i, 1) // Remove city part
              break
            }
          }
          if (state) break
        }
        if (state) break
      }
    }

    // Remove "India" or "INDIA" if present
    const filteredParts = parts.filter(
      (p) => !/^(India|INDIA)$/i.test(p)
    )

    // Join remaining parts as address text
    const addressText = filteredParts.join(", ").trim()

    return {
      addressText,
      pincode,
      state,
      city,
    }
  }

  // Handle state change - update available cities
  const handleStateChange = (state: IndianState) => {
    setAddressState(state)
    setAddressCity("") // Reset city when state changes
  }

  // Handle saving address from modal
  const handleSaveAddress = () => {
    // Build the full address string
    const addressParts: string[] = []
    if (addressText.trim()) {
      addressParts.push(addressText.trim())
    }
    if (addressCity) {
      addressParts.push(addressCity)
    }
    if (addressState) {
      addressParts.push(addressState)
    }
    if (addressPincode) {
      addressParts.push(addressPincode)
    }
    if (addressCountry) {
      addressParts.push(addressCountry)
    }

    const fullAddress = addressParts.join(", ")
    
    // Update the form value
    setProfileValue("address", fullAddress, { shouldValidate: true })
    
    // Reset fields and close the modal
    setAddressPincode("")
    setAddressState("")
    setAddressCity("")
    setAddressText("")
    setAddressCountry("India")
    setIsAddressDialogOpen(false)
  }

  // Close image menu when clicking outside
  useEffect(() => {
    if (!isImageMenuOpen) return
    const onDown = (e: MouseEvent) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
        setIsImageMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [isImageMenuOpen])

  const getInitials = (name?: string, email?: string, firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (name) {
      const parts = name.trim().split(" ")
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return name[0]?.toUpperCase() || "U"
    }
    if (email) {
      return email[0]?.toUpperCase() || "U"
    }
    return "U"
  }

  const formatIndianDate = (dateString?: string) => {
    if (!dateString) return "Not set"
    try {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateString
    }
  }

  const getDisplayLastName = (firstName?: string, lastName?: string) => {
    if (!lastName) return "Not set"
    if (!firstName) return lastName

    const fn = firstName.trim()
    const ln = lastName.trim()
    if (!fn || !ln) return ln || "Not set"

    // If backend accidentally stores "First Last" in last_name, strip the first name part.
    // Example: first_name="Jaybant", last_name="Jaybant Vishwakarma" -> "Vishwakarma"
    const lowerFn = fn.toLowerCase()
    const lowerLn = ln.toLowerCase()
    if (lowerLn.startsWith(lowerFn + " ")) {
      const stripped = ln.slice(fn.length).trim()
      return stripped || ln
    }
    return ln
  }

  // If profile image url changes (after update), allow it to try loading again
  useEffect(() => {
    setImageError(false)
  }, [userInfo?.profile_image])

  // Sync theme color state
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

  const handleResetColor = () => {
    const isDark = theme === "dark"
    const defaultColor = isDark ? "#ff6600" : "#22c55e"
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col relative" data-scroll-section>
        <AnimatedBackground />
        <Header />
        <main className="flex-1 py-8 px-4 sm:py-12 relative z-10" data-scroll-section>
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Header Skeleton */}
            <div className="text-center sm:text-left space-y-2">
              <div className="h-10 w-48 bg-muted animate-pulse rounded-md mx-auto sm:mx-0"></div>
              <div className="h-5 w-64 bg-muted animate-pulse rounded-md mx-auto sm:mx-0"></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Profile Information Card Skeleton */}
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="h-6 w-40 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded-md mt-2"></div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Header Skeleton */}
                  <div className="flex flex-col items-center gap-4 pb-4 border-b">
                    <div className="h-24 w-24 rounded-full bg-muted animate-pulse"></div>
                    <div className="text-center space-y-2 w-full">
                      <div className="h-7 w-32 bg-muted animate-pulse rounded-md mx-auto"></div>
                      <div className="h-4 w-48 bg-muted animate-pulse rounded-md mx-auto"></div>
                      <div className="h-6 w-16 bg-muted animate-pulse rounded-full mx-auto"></div>
                    </div>
                  </div>

                  {/* Information Grid Skeleton */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                        <div className="h-5 w-full bg-muted animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Change Password Card Skeleton */}
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="h-6 w-36 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 w-56 bg-muted animate-pulse rounded-md mt-2"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                    </div>
                  ))}
                  <div className="h-3 w-full bg-muted animate-pulse rounded mt-2"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col relative" data-scroll-section>
      <AnimatedBackground />
      <Header />
      <main className="flex-1 py-8 px-4 sm:py-12 relative z-10" data-scroll-section>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* User Profile Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 pb-4 border-b">
                  {/* Clickable Profile Image with menu */}
                  <div className="relative" ref={imageMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsImageMenuOpen((v) => !v)}
                      className="relative"
                      aria-label="Profile image options"
                    >
                      {((profilePreviewUrl ?? userInfo?.profile_image) && !imageError) ? (
                        <img
                          src={profilePreviewUrl ?? (userInfo?.profile_image as string)}
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover shadow-lg border-4 border-primary/20 cursor-pointer"
                          onError={() => setImageError(true)}
                          onLoad={() => setImageError(false)}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-primary/20 cursor-pointer">
                          {getInitials(
                            userInfo?.name,
                            userInfo?.email,
                            userInfo?.first_name,
                            userInfo?.last_name
                          )}
                        </div>
                      )}
                    </button>

                    {/* hidden file input (opened via menu) */}
                    <input
                      ref={profileFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = (e.target as HTMLInputElement).files
                        if (!files || files.length === 0) return
                        void handleImageSelected(files[0])
                        // reset so selecting same file again triggers change
                        ;(e.target as HTMLInputElement).value = ""
                      }}
                    />

                    {isImageMenuOpen && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-44 rounded-md border bg-background shadow-lg z-50 overflow-hidden">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleChangeImageClick}
                          disabled={isUpdatingProfile}
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => void handleRemoveImage()}
                          disabled={isUpdatingProfile || (!userInfo?.profile_image && !profilePreviewUrl)}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{userInfo?.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{userInfo?.email || ""}</p>
                    {userInfo?.role && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary capitalize">
                        {userInfo.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Editable Profile Form */}
                <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile_name">Username</Label>
                      <Input
                        id="profile_name"
                        maxLength={50}
                        {...registerProfile("name")}
                      />
                      {profileErrors.name && (
                        <p className="text-sm text-destructive">{profileErrors.name.message as string}</p>
                      )}
                    </div>
 
                    <div className="space-y-2">
                      <Label htmlFor="profile_email">Email</Label>
                      <Input
                        id="profile_email"
                        type="email"
                        maxLength={254}
                        {...registerProfile("email")}
                      />
                      {profileErrors.email && (
                        <p className="text-sm text-destructive">{profileErrors.email.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={userInfo?.role ? String(userInfo.role) : "Not set"} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <Input value={formatIndianDate(userInfo?.created_at)} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile_first_name">First Name</Label>
                      <Input
                        id="profile_first_name"
                        maxLength={50}
                        {...registerProfile("first_name", {
                          onChange: (e) => {
                            const next = sanitizeNameInput(e.target.value)
                            setProfileValue("first_name", next, { shouldValidate: true })
                          },
                        })}
                      />
                      {profileErrors.first_name && (
                        <p className="text-sm text-destructive">{profileErrors.first_name.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile_last_name">Last Name</Label>
                      <Input
                        id="profile_last_name"
                        maxLength={50}
                        {...registerProfile("last_name", {
                          onChange: (e) => {
                            const next = sanitizeNameInput(e.target.value)
                            setProfileValue("last_name", next, { shouldValidate: true })
                          },
                        })}
                      />
                      {profileErrors.last_name && (
                        <p className="text-sm text-destructive">{profileErrors.last_name.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile_mobile_number">Mobile Number</Label>
                      <Input
                        id="profile_mobile_number"
                        inputMode="tel"
                        maxLength={20}
                        placeholder="+91876543210"
                        {...registerProfile("mobile_number", {
                          onChange: (e) => {
                            const next = sanitizeMobileInput(e.target.value)
                            setProfileValue("mobile_number", next, { shouldValidate: true })
                          },
                        })}
                      />
                      {profileErrors.mobile_number && (
                        <p className="text-sm text-destructive">{profileErrors.mobile_number.message as string}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="profile_address">Address</Label>
                      <Textarea
                        id="profile_address"
                        maxLength={250}
                        rows={4}
                        placeholder="Enter your address"
                        {...registerProfile("address")}
                        readOnly
                      />
                      {profileErrors.address && (
                        <p className="text-sm text-destructive">{profileErrors.address.message as string}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Max 250 characters
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white text-black hover:bg-gray-100 border-black"
                        onClick={async () => {
                          // Initialize modal with current address if available
                          const currentAddress = watchProfile("address") || userInfo?.address || ""
                          
                          // Parse the existing address
                          const parsed = parseAddress(currentAddress)
                          
                          // Set all fields from parsed address
                          setAddressText(parsed.addressText)
                          setAddressPincode(parsed.pincode)
                          setAddressState(parsed.state)
                          setAddressCity(parsed.city)
                          setAddressCountry("India")
                          
                          // If pincode is found but state/city not found, try to fetch from API
                          if (parsed.pincode && parsed.pincode.length === 6 && (!parsed.state || !parsed.city)) {
                            try {
                              const apiLocation = await getLocationByPincodeAPI(parsed.pincode)
                              if (apiLocation) {
                                setAddressState(apiLocation.state)
                                setAddressCity(apiLocation.city)
                              }
                            } catch (error) {
                              console.error("Error fetching pincode data:", error)
                            }
                          }
                          
                          setIsAddressDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="profile_image">Profile Image</Label>
                      <FileUpload
                        className="max-w-2xl"
                        accept="image/*"
                        disabled={isUpdatingProfile}
                        label=""
                        helperText="Drag & drop your image here or click to upload"
                        onChange={(files) => {
                          if (!files.length) return
                          void handleImageSelected(files[0])
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Click the profile picture above to change/remove your image.
                      </p>
                    </div> 
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="shadow-md" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </form>

                {/* Address Edit Dialog */}
                <Dialog 
                  open={isAddressDialogOpen} 
                  onClose={() => {
                    // Reset fields when closing without saving
                    setAddressPincode("")
                    setAddressState("")
                    setAddressCity("")
                    setAddressText("")
                    setAddressCountry("India")
                    setIsAddressDialogOpen(false)
                  }} 
                  className="relative z-50"
                >
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-md" aria-hidden="true" />
                  <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-2xl space-y-4 border bg-background/95 backdrop-blur-xl p-6 rounded-lg shadow-2xl w-full max-h-[90vh] overflow-y-auto">
                      <DialogTitle className="font-bold text-xl">Edit Address</DialogTitle>
                      <Description className="text-sm text-muted-foreground">
                        Enter your complete address details
                      </Description>
                      <div className="space-y-4">
                        {/* Pincode */}
                        <div className="space-y-2">
                          <Label htmlFor="dialog_pincode">PINCODE</Label>
                          <div className="relative">
                            <Input
                              id="dialog_pincode"
                              type="text"
                              maxLength={6}
                              placeholder="Enter 6-digit pincode"
                              value={addressPincode}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "") // Only digits
                                void handlePincodeChange(value)
                              }}
                              disabled={isLoadingPincode}
                            />
                            {isLoadingPincode && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {isLoadingPincode
                              ? "Fetching location data..."
                              : "Enter pincode to auto-fill state and city"}
                          </p>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                          <Label htmlFor="dialog_country">Country</Label>
                          <Input
                            id="dialog_country"
                            value={addressCountry}
                            onChange={(e) => setAddressCountry(e.target.value)}
                            readOnly
                            className="bg-muted"
                          />
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                          <Label htmlFor="dialog_state">State</Label>
                          <Select
                            value={addressState}
                            onValueChange={(value) => handleStateChange(value as IndianState)}
                          >
                            <SelectTrigger id="dialog_state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto">
                              {indianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                          <Label htmlFor="dialog_city">City</Label>
                          <Select
                            value={addressCity}
                            onValueChange={setAddressCity}
                            disabled={!addressState}
                          >
                            <SelectTrigger id="dialog_city">
                              <SelectValue placeholder={addressState ? "Select city" : "Select state first"} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto">
                              {addressState && (
                                <>
                                  {/* Show cities from our list */}
                                  {getCitiesByState(addressState).map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                  {/* If city from API is not in our list, show it as an option */}
                                  {addressCity && 
                                   !getCitiesByState(addressState).includes(addressCity) && (
                                    <SelectItem key={addressCity} value={addressCity}>
                                      {addressCity}
                                    </SelectItem>
                                  )}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Address Textarea */}
                        <div className="space-y-2">
                          <Label htmlFor="dialog_address_text">Address</Label>
                          <Textarea
                            id="dialog_address_text"
                            rows={4}
                            maxLength={250}
                            placeholder="Enter your street address, building name, etc."
                            value={addressText}
                            onChange={(e) => setAddressText(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            {addressText.length} / 250 characters
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddressDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSaveAddress}
                          >
                            Save Address
                          </Button>
                        </div>
                      </div>
                    </DialogPanel>
                  </div>
                </Dialog>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-5">
            {/* Change Password Card */}
            <Card className="shadow-xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <PasswordInput
                      id="current_password"
                      placeholder="Enter your current password"
                      {...register("current_password")}
                      className={errors.current_password ? "border-destructive" : ""}
                    />
                    {errors.current_password && (
                      <p className="text-sm text-destructive">
                        {errors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <PasswordInput
                      id="new_password"
                      placeholder="Enter your new password"
                      {...register("new_password")}
                      className={errors.new_password ? "border-destructive" : ""}
                    />
                    {errors.new_password && (
                      <p className="text-sm text-destructive">
                        {errors.new_password.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be 8-20 characters with uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <PasswordInput
                      id="confirm_password"
                      placeholder="Confirm your new password"
                      {...register("confirm_password")}
                      className={errors.confirm_password ? "border-destructive" : ""}
                    />
                    {errors.confirm_password && (
                      <p className="text-sm text-destructive">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full shadow-md"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Changing Password..." : "Change Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Theme Customization Card */}
            <Card className="shadow-xl lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Customization
                </CardTitle>
                <CardDescription>
                  Customize the primary color of your theme
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
                      onClick={handleResetColor}
                      className="shadow-md"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

