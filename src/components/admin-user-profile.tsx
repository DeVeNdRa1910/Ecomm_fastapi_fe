"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, Moon, Sun } from "lucide-react"
import { tokenManager } from "@/lib/cookies"
import { authApi, type UserInfo } from "@/lib/auth-api"
import { useToast } from "@/lib/toast-context"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/store/useAuthStore"

export function AdminUserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { success, error: showError } = useToast()
  const { theme, setTheme } = useTheme()
  const { user: userInfo, setUser, clearUser } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // If profile image changes (e.g. after updating profile), retry loading it
  useEffect(() => {
    setAvatarError(false)
  }, [userInfo?.profile_image])

  // Fetch user info on mount if not already in store
  useEffect(() => {
    const fetchUserInfo = async () => {
      // If user info already exists in store, use it
      if (userInfo) {
        setIsLoading(false)
        return
      }

      // Check if token exists before making the request
      const token = tokenManager.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const user = await authApi.getMe()
        setUser(user)
      } catch (error) {
        // Only remove token on authentication errors (401, 403), not on network errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status === 401 || status === 403) {
            // Token is invalid or expired
            tokenManager.removeToken()
            clearUser()
            // Dispatch event to update header
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth-change'))
            }
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [userInfo, setUser, clearUser])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    tokenManager.removeToken()
    clearUser()
    setAvatarError(false)
    
    // Dispatch custom event to notify header of logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-change'))
    }
    
    success("Logged out successfully")
    setIsOpen(false)
    router.push("/signin")
  }

  const getAvatarLetter = (name?: string, email?: string) => {
    const fromName = name?.trim()?.[0]
    if (fromName) return fromName.toUpperCase()
    const fromEmail = email?.trim()?.[0]
    if (fromEmail) return fromEmail.toUpperCase()
    return "A"
  }

  const displayName = userInfo?.name || userInfo?.email || "Admin"

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse flex items-center justify-center">
        <User className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="User profile"
      >
        {/* Profile Image (fallback to first letter) */}
        {userInfo?.profile_image && !avatarError ? (
          <img
            src={userInfo.profile_image}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover shadow-md border border-primary/20"
            onError={() => setAvatarError(true)}
            onLoad={() => setAvatarError(false)}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-md">
            {getAvatarLetter(userInfo?.name, userInfo?.email)}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
          {displayName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              {/* Profile Image (fallback to first letter) */}
              {userInfo?.profile_image && !avatarError ? (
                <img
                  src={userInfo.profile_image}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover shadow-md border border-primary/20"
                  onError={() => setAvatarError(true)}
                  onLoad={() => setAvatarError(false)}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-base shadow-md">
                  {getAvatarLetter(userInfo?.name, userInfo?.email)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {userInfo?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userInfo?.email || ""}
                </p>
                {userInfo?.role && (
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {userInfo.role}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="p-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                setIsOpen(false)
                router.push("/admin/my-account")
              }}
            >
              <Settings className="h-4 w-4" />
              My Account
            </Button>
            {mounted && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                }}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

