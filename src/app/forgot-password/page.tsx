"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { authApi } from "@/lib/auth-api"
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

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

const resetPasswordSchema = z
  .object({
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

type EmailFormValues = z.infer<typeof emailSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { success, error: showError } = useToast()

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Check if email exists in session storage (user already entered email)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('forgot_password_email')
      if (storedEmail) {
        setEmail(storedEmail)
        setStep("reset")
      }
    }
  }, [])

  const onSubmitEmail = async (data: EmailFormValues) => {
    setIsLoading(true)
    try {
      const response = await authApi.getForgotPasswordOtp({
        email: data.email,
      })

      // Store email in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('forgot_password_email', data.email)
      }

      setEmail(data.email)
      success(response.message || "OTP has been sent to your email")
      setStep("reset")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP. Please try again."
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-focus previous input on backspace
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, '')
    const newOtp = [...otp]

    for (let i = 0; i < 6; i++) {
      if (i < pastedData.length) {
        newOtp[i] = pastedData[i]
      } else {
        newOtp[i] = ""
      }
    }

    setOtp(newOtp)
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const onSubmitReset = async (data: ResetPasswordFormValues) => {
    if (!email) {
      showError("Email not found. Please start over.")
      return
    }

    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      showError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.forgotPassword({
        email: email,
        otp: otpValue,
        new_password: data.new_password,
      })

      // Clear email from session storage after successful reset
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('forgot_password_email')
      }

      success(response.message || "Password reset successfully!")
      
      // Redirect to signin page after a short delay
      setTimeout(() => {
        router.push("/signin")
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password. Please try again."
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('forgot_password_email')
    }
    setEmail("")
    setOtp(["", "", "", "", "", ""])
    setStep("email")
    emailForm.reset()
    resetForm.reset()
  }

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4" data-scroll-section>
        <Card className="w-full max-w-xl shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {step === "email" ? "Forgot Password" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "email"
                ? "Enter your email address to receive a password reset OTP"
                : `Enter the OTP sent to ${email} and your new password`}
            </CardDescription>
          </CardHeader>

          {step === "email" ? (
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...emailForm.register("email")}
                    className={emailForm.formState.errors.email ? "border-destructive" : ""}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onSubmitReset)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>OTP</Label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-12 text-center text-lg font-semibold shadow-sm"
                      />
                    ))}
                  </div>
                  {otp.join("").length !== 6 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Enter 6-digit OTP
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <PasswordInput
                    id="new_password"
                    placeholder="Enter your new password"
                    {...resetForm.register("new_password")}
                    className={resetForm.formState.errors.new_password ? "border-destructive" : ""}
                  />
                  {resetForm.formState.errors.new_password && (
                    <p className="text-sm text-destructive">
                      {resetForm.formState.errors.new_password.message}
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
                    {...resetForm.register("confirm_password")}
                    className={resetForm.formState.errors.confirm_password ? "border-destructive" : ""}
                  />
                  {resetForm.formState.errors.confirm_password && (
                    <p className="text-sm text-destructive">
                      {resetForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                >
                  Back to Email
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}

