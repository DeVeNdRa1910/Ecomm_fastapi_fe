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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const router = useRouter()
  const { success, error: showError } = useToast()

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
          // Map common field name variations
          userData = {
            id: (user as any).id || (user as any)._id || (user as any).user_id,
            name: (user as any).name || (user as any).user_name || (user as any).full_name || (user as any).username,
            email: (user as any).email || (user as any).user_email,
            role: (user as any).role || (user as any).user_role,
            ...user, // Spread to include any other fields
          }
        }
        
        setUserInfo(userData)
      } catch (error) {
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status === 401 || status === 403) {
            tokenManager.removeToken()
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

  const getInitials = (name?: string, email?: string) => {
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4" data-scroll-section>
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 py-12 px-4" data-scroll-section>
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Profile Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  {/* Profile Picture Placeholder */}
                  <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-2xl shadow-lg">
                    {getInitials(userInfo?.name as string, userInfo?.email as string)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{userInfo?.name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{userInfo?.email || ""}</p>
                    {userInfo?.role && (
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {userInfo.role}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-base font-medium mt-1">{userInfo?.name || userInfo?.email || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-base font-medium mt-1">{userInfo?.email || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                    <p className="text-base font-medium mt-1 capitalize">
                      {userInfo?.role || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Update Profile (Coming Soon)
                </Button>
              </CardFooter>
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

