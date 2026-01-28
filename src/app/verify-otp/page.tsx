"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/auth-api"
import { useToast } from "@/lib/toast-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [email, setEmail] = useState<string>("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { success, error: showError } = useToast()

  // Get email from session storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('verification_email')
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        // If no email found, redirect back to signup
        showError("Please register first")
        setTimeout(() => {
          router.push("/signup")
        }, 2000)
      }
    }
  }, [router, showError])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
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

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      return
    }

    if (!email) {
      showError("Email not found. Please register again.")
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.verifyEmail({
        email: email,
        otp: otpValue,
      })

      // Clear email from session storage after successful verification
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('verification_email')
      }

      // Show success toast
      success(response.message || "Email verified successfully!")

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/signin")
      }, 1000)
    } catch (error) {
      // Handle error - show error message from API or generic message
      const errorMessage = error instanceof Error ? error.message : "Invalid OTP. Please try again."
      showError(errorMessage)
      // Reset OTP on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      showError("Email not found. Please register again.")
      return
    }

    setCanResend(false)
    setTimer(60)
    
    try {
      const response = await authApi.resendOtp(email)
      
      // Show success toast
      success(response.message || "OTP has been resent successfully!")
    } catch (error) {
      // Handle error - show error message from API or generic message
      const errorMessage = error instanceof Error ? error.message : "Failed to resend OTP. Please try again."
      showError(errorMessage)
      // Re-enable resend button on error
      setCanResend(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4" data-scroll-section>
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We've sent a 6-digit code to {email ? `${email}` : "your email"}. Please enter it below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
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
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold shadow-sm"
                  />
                ))}
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResend}
                    className="text-primary"
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Resend code in {timer}s
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full shadow-md"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <div className="text-center text-sm">
                <Link href="/signin" className="text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

