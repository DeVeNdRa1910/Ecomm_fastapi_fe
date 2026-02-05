"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  IndianRupee,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
} from "lucide-react"
import { orderApi, type Order } from "@/lib/order-api"
import { useToast } from "@/lib/toast-context"
import { tokenManager } from "@/lib/cookies"
import Image from "next/image"

type TabType = "pending" | "completed"

export default function OrdersPage() {
  const router = useRouter()
  const { error: showError } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("pending")

  useEffect(() => {
    const fetchOrders = async () => {
      const token = tokenManager.getToken()
      if (!token) {
        showError("Please sign in to view your orders")
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
        return
      }

      setIsLoading(true)
      try {
        const fetchedOrders = await orderApi.getOrders()
        setOrders(fetchedOrders || [])
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load orders."
        showError(errorMessage)
        if (err instanceof Error && (err as { status?: number }).status === 401) {
          setTimeout(() => {
            router.push("/signin")
          }, 2000)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [router, showError])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
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

  const pendingOrders = orders.filter((order) => !order.is_delivered)
  const completedOrders = orders.filter((order) => order.is_delivered === true)
  const currentOrders = activeTab === "pending" ? pendingOrders : completedOrders

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </main>
        <Footer data-scroll-section />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 py-8 px-4 sm:py-12" data-scroll-section>
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">My Orders</h1>
            </div>
            <p className="text-muted-foreground">
              Track and manage all your orders
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "pending"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Orders
                {pendingOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingOrders.length}
                  </Badge>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "completed"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed
                {completedOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {completedOrders.length}
                  </Badge>
                )}
              </div>
            </button>
          </div>

          {/* Orders List */}
          {currentOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                {activeTab === "pending" ? (
                  <>
                    <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-semibold mb-2">
                      No Pending Orders
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      You don&apos;t have any pending orders at the moment. Start
                      shopping to see your orders here!
                    </p>
                    <Button asChild size="lg">
                      <Link href="/products">
                        Browse Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-semibold mb-2">
                      No Completed Orders
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      You haven&apos;t completed any orders yet. Your completed
                      orders will appear here once they are delivered.
                    </p>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/products">
                        Start Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {currentOrders.map((order, index) => (
                <motion.div
                  key={order.order_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => router.push(`/orders/${order.order_id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Order Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold">
                                  Order #{order.order_id.slice(-8).toUpperCase()}
                                </h3>
                                <Badge
                                  variant={
                                    order.payment_status === "completed"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {order.payment_status}
                                </Badge>
                                {order.is_delivered && (
                                  <Badge variant="default" className="bg-green-500">
                                    Delivered
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Products Preview */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              {order.products.length} item
                              {order.products.length !== 1 ? "s" : ""}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {order.products.slice(0, 3).map((product, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-muted/50 rounded-lg p-2"
                                >
                                  {product.product_image_urls?.[0] && (
                                    <div className="relative w-12 h-12 rounded overflow-hidden">
                                      <Image
                                        src={product.product_image_urls[0]}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                      />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium line-clamp-1">
                                    {product.title}
                                  </span>
                                </div>
                              ))}
                              {order.products.length > 3 && (
                                <div className="flex items-center justify-center bg-muted/50 rounded-lg px-3 py-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    +{order.products.length - 3} more
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Address */}
                          <div className="text-sm">
                            <p className="text-muted-foreground mb-1">
                              Delivery Address:
                            </p>
                            <p className="line-clamp-2">{order.address}</p>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="md:w-64 space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Quantity
                              </span>
                              <span className="font-medium">
                                {order.quantity}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-lg font-semibold">Total</span>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="h-5 w-5 text-primary" />
                                <span className="text-2xl font-bold text-primary">
                                  {formatPrice(order.unit_price)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/orders/${order.order_id}`)
                            }}
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

