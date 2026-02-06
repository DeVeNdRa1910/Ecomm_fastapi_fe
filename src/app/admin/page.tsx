"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, TrendingUp, IndianRupee } from "lucide-react"
import { productApi } from "@/lib/product-api"
import { orderApi } from "@/lib/order-api"
import { useSellerStatsStore } from "@/store/useSellerStatsStore"

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0)
  const [growthData, setGrowthData] = useState<{
    currentMonthSales: number
    previousMonthSales: number
    growthPercentage: number
    currentMonth: string
    previousMonth: string
  } | null>(null)
  const { totalCustomers, totalRevenue, setCustomers } = useSellerStatsStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product count
        const productResponse = await productApi.getProducts()
        setProductCount(productResponse.seller_products?.length || 0)

        // Fetch seller users to calculate customers and revenue
        const usersResponse = await orderApi.getSellerUsers()
        setCustomers(usersResponse || [])

        // Fetch monthly growth data
        const growthResponse = await orderApi.getMonthlyGrowth()
        setGrowthData({
          currentMonthSales: growthResponse.current_month_sales,
          previousMonthSales: growthResponse.previous_month_sales,
          growthPercentage: growthResponse.growth_percentage,
          currentMonth: growthResponse.current_month,
          previousMonth: growthResponse.previous_month,
        })
      } catch (error) {
        // Silently fail - stats are not critical for dashboard
        console.error("Failed to fetch dashboard data:", error)
      }
    }
    fetchData()
  }, [setCustomers])

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMonthYear = (monthYear: string): string => {
    if (!monthYear) return "N/A"
    
    // Parse format like "2-2026" or "1-2026"
    const parts = monthYear.split("-")
    if (parts.length !== 2) return monthYear
    
    const month = parseInt(parts[0], 10)
    const year = parts[1]
    
    if (isNaN(month) || month < 1 || month > 12) return monthYear
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    
    return `${monthNames[month - 1]} ${year}`
  }

  const stats = [
    {
      title: "Total Products",
      value: productCount.toString(),
      description: "Products in your store",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      description: "Customers who purchased",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Revenue",
      value: formatRevenue(totalRevenue),
      description: "Total revenue",
      icon: IndianRupee,
      color: "text-blue-500",
    },
    {
      title: "Growth",
      value: growthData
        ? `${growthData.growthPercentage >= 0 ? "+" : ""}${growthData.growthPercentage.toFixed(1)}%`
        : "Loading...",
      description: growthData
        ? `Current month: ${formatRevenue(growthData.currentMonthSales)}`
        : "This month",
      icon: TrendingUp,
      color: growthData && growthData.growthPercentage >= 0 ? "text-green-500" : growthData && growthData.growthPercentage < 0 ? "text-red-500" : "text-blue-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin panel. Manage your store from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="shadow-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>Sales comparison with previous month</CardDescription>
          </CardHeader>
          <CardContent>
            {growthData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Month</p>
                    <p className="text-lg font-semibold">
                      {formatMonthYear(growthData.currentMonth)}
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatRevenue(growthData.currentMonthSales)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Previous Month</p>
                    <p className="text-lg font-semibold">
                      {formatMonthYear(growthData.previousMonth)}
                    </p>
                    <p className="text-2xl font-bold text-muted-foreground mt-1">
                      {formatRevenue(growthData.previousMonthSales)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <span
                      className={`text-xl font-bold ${
                        growthData.growthPercentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {growthData.growthPercentage >= 0 ? "+" : ""}
                      {growthData.growthPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        growthData.growthPercentage >= 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(Math.abs(growthData.growthPercentage), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Loading growth data...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




