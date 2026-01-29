"use client"

import { useEffect } from "react"
import { tokenManager } from "@/lib/cookies"
import { authApi } from "@/lib/auth-api"
import { useAuthStore } from "@/store/useAuthStore"

/**
 * Component to initialize user info from API if token exists but user info is not in store
 * This ensures user info is available throughout the app after login
 */
export function AuthInitializer() {
  const { user, setUser } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      // If user info already exists in store, no need to fetch
      if (user) {
        return
      }

      // Check if token exists
      const token = tokenManager.getToken()
      if (!token) {
        return
      }

      // Fetch user info and store it
      try {
        const userInfo = await authApi.getMe()
        
        // Handle different possible response formats
        let userData = userInfo
        
        if (typeof userInfo === 'string') {
          try {
            userData = JSON.parse(userInfo) as typeof userInfo
          } catch {
            userData = { name: userInfo } as typeof userInfo
          }
        } else if (typeof userInfo === 'object' && userInfo !== null) {
          userData = {
            id: (userInfo as any).id || (userInfo as any)._id || (userInfo as any).user_id,
            name: (userInfo as any).name || (userInfo as any).user_name || (userInfo as any).full_name || (userInfo as any).username,
            email: (userInfo as any).email || (userInfo as any).user_email,
            role: (userInfo as any).role || (userInfo as any).user_role,
            ...userInfo,
          }
        }
        
        setUser(userData)
      } catch (error) {
        // If fetching fails, token might be invalid - clear it
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status === 401 || status === 403) {
            tokenManager.removeToken()
          }
        }
      }
    }

    initializeAuth()
  }, [user, setUser])

  return null
}

