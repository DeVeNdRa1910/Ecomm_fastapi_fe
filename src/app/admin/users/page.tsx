"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Calendar,
  Download,
} from "lucide-react"
import { orderApi, type SellerUser } from "@/lib/order-api"
import { useToast } from "@/lib/toast-context"
import { useSellerStatsStore } from "@/store/useSellerStatsStore"
import Image from "next/image"

type SortField = "first_name" | "last_ordered_time"
type SortDirection = "asc" | "desc"

export default function AdminUsers() {
  const [users, setUsers] = useState<SellerUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [sortField, setSortField] = useState<SortField>("first_name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const { error: showError, success } = useToast()
  const { setCustomers } = useSellerStatsStore()

  // Fetch users on mount
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await orderApi.getSellerUsers()
      const usersData = response || []
      setUsers(usersData)
      // Store in global store for use in dashboard
      setCustomers(usersData)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load users."
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [showError, setCustomers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0

    if (sortField === "first_name") {
      comparison = a.first_name.localeCompare(b.first_name)
    } else if (sortField === "last_ordered_time") {
      const dateA = new Date(a.last_ordered_time).getTime()
      const dateB = new Date(b.last_ordered_time).getTime()
      comparison = dateA - dateB
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field with ascending direction
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch {
      return dateString
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const blob = await orderApi.exportSellerUsers()
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "seller_orders_report.csv"
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      success("CSV file downloaded successfully!")
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export CSV file."
      showError(errorMessage)
    } finally {
      setIsExporting(false)
    }
  }

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => {
    const isActive = sortField === field
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          {isActive ? (
            sortDirection === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          )}
        </div>
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            View customers who purchased your products
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={isExporting || users.length === 0}
          className="shadow-lg"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer List
          </CardTitle>
          <CardDescription>
            {users.length} order{users.length !== 1 ? "s" : ""} from{" "}
            {new Set(users.map((u) => `${u.first_name}_${u.last_name}`)).size}{" "}
            customer
            {new Set(users.map((u) => `${u.first_name}_${u.last_name}`)).size !== 1
              ? "s"
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg animate-pulse"
                >
                  <div className="h-12 w-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              ))}
            </div>
          ) : sortedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                No customers found yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Customers who purchase your products will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">
                      <SortButton field="first_name">Customer</SortButton>
                    </th>
                    <th className="text-left p-4 font-semibold">Product</th>
                    <th className="text-left p-4 font-semibold">
                      <SortButton field="last_ordered_time">
                        Last Ordered
                      </SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Profile Image */}
                          {user.profile_image ? (
                            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                              <Image
                                src={user.profile_image}
                                alt={`${user.first_name} ${user.last_name}`}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm border-2 border-primary/20">
                              {getInitials(user.first_name, user.last_name)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Customer
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.product_images?.[0] && (
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border">
                              <Image
                                src={user.product_images[0]}
                                alt={user.product_name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{user.product_name}</p>
                            <Badge variant="secondary" className="mt-1">
                              <Package className="h-3 w-3 mr-1" />
                              Purchased
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(user.last_ordered_time)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
