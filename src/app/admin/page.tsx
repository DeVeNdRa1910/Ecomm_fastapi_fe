"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, DollarSign, TrendingUp } from "lucide-react"
import { productApi } from "@/lib/product-api"

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await productApi.getProducts()
        setProductCount(response.seller_products?.length || 0)
      } catch (error) {
        // Silently fail - product count is not critical for dashboard
        console.error("Failed to fetch product count:", error)
      }
    }
    fetchProductCount()
  }, [])

  const stats = [
    {
      title: "Total Products",
      value: productCount.toString(),
      description: "Products in your store",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Total Users",
      value: "0",
      description: "Registered users",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Revenue",
      value: "$0",
      description: "Total revenue",
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      title: "Growth",
      value: "+0%",
      description: "This month",
      icon: TrendingUp,
      color: "text-blue-500",
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Quick actions will be available here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



