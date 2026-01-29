"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { authApi, type UserInfo } from "@/lib/auth-api"
import { tokenManager } from "@/lib/cookies"
import { useToast } from "@/lib/toast-context"
import { validatePassword } from "@/lib/password-validation"
import { useAuthStore } from "@/store/useAuthStore"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

export default function MyAccountPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { user: userInfo, setUser, clearUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <main className="flex-1 py-8 px-4 sm:py-12 animated-background" data-scroll-section>
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
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 py-8 px-4 sm:py-12 animated-background" data-scroll-section>
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Profile Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 pb-4 border-b">
                  {/* Profile Image or Placeholder */}
                  {userInfo?.profile_image && !imageError ? (
                    <div className="relative">
                      <img
                        src={userInfo.profile_image}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover shadow-lg border-4 border-primary/20"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-primary/20">
                      {getInitials(
                        userInfo?.name,
                        userInfo?.email,
                        userInfo?.first_name,
                        userInfo?.last_name
                      )}
                    </div>
                  )}
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

                {/* User Information Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Username</Label>
                    <p className="text-sm font-medium">{userInfo?.name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                    <p className="text-sm font-medium break-all">{userInfo?.email || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</Label>
                    <p className="text-sm font-medium capitalize">
                      {userInfo?.role || "Not set"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account Created</Label>
                    <p className="text-sm font-medium">
                      {formatIndianDate(userInfo?.created_at)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</Label>
                    <p className="text-sm font-medium">{userInfo?.first_name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</Label>
                    <p className="text-sm font-medium">{userInfo?.last_name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mobile Number</Label>
                    <p className="text-sm font-medium">{userInfo?.mobile_number || "Not set"}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</Label>
                    <p className="text-sm font-medium">{userInfo?.address || "Not set"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="shadow-xl">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

