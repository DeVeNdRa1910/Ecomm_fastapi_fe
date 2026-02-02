"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"
import { tokenManager } from "@/lib/cookies"
import { useAuthStore } from "@/store/useAuthStore"

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, isAuthenticated: isAuthFromStore } = useAuthStore()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = tokenManager.getToken()
      const hasUser = !!user
      setIsAuthenticated(!!token || hasUser)
    }

    // Initial check
    checkAuth()

    // Listen for custom auth-change event (e.g., when user logs in/out in same tab)
    const handleAuthChange = () => {
      // Small delay to ensure cookie is set
      setTimeout(checkAuth, 100)
    }

    // Periodically check auth status (for cross-tab synchronization)
    const interval = setInterval(checkAuth, 2000)

    window.addEventListener("auth-change", handleAuthChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("auth-change", handleAuthChange)
    }
  }, [user])
  return (
    <header className=" sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-lg" data-scroll-section>
      <div className="mx-auto h-16 px-4">
        <div className="relative flex items-center justify-between h-full w-full">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="text-xl font-bold text-primary shadow-md hover:shadow-lg transition-shadow">
              fastapi_comm
            </Link>
          </div>

          {/* Center: Navigation Menu - Perfectly centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="shadow-sm hover:shadow-md transition-shadow">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="shadow-md hover:shadow-lg transition-shadow">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="shadow-lg">
                    <ul className="grid gap-3 p-4 w-[200px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/products"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              All Products
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Browse our complete catalog
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/products/featured"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              Featured
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Check out our featured items
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/categories" className="shadow-sm hover:shadow-md transition-shadow">
                      Categories
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/about" className="shadow-sm hover:shadow-md transition-shadow">
                      About
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact" className="shadow-sm hover:shadow-md transition-shadow">
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: User Profile or Sign In/Sign Up, and Theme Toggle */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
            <Button variant="outline" asChild className="shadow-md">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="default" asChild className="shadow-md">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

