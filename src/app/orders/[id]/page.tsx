"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  IndianRupee,
  Loader2,
  Package,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { orderApi, type Order } from "@/lib/order-api"
import { useToast } from "@/lib/toast-context"
import { tokenManager } from "@/lib/cookies"
import Image from "next/image"

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const { error: showError } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const token = tokenManager.getToken()
      if (!token) {
        showError("Please sign in to view order details")
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
        return
      }

      setIsLoading(true)
      try {
        const orders = await orderApi.getOrders()
        const foundOrder = orders.find((o) => o.order_id === orderId)
        if (!foundOrder) {
          showError("Order not found")
          setTimeout(() => {
            router.push("/orders")
          }, 2000)
          return
        }
        setOrder(foundOrder)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load order details."
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

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, router, showError])

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
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer data-scroll-section />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="max-w-md">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The order you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button onClick={() => router.push("/orders")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer data-scroll-section />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 py-8 px-4 sm:py-12" data-scroll-section>
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              onClick={() => router.push("/orders")}
              className="shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </motion.div>

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        Order #{order.order_id.slice(-8).toUpperCase()}
                      </h1>
                      <Badge
                        variant={
                          order.payment_status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-sm"
                      >
                        {order.payment_status}
                      </Badge>
                      {order.is_delivered ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-sm"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Delivered
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Placed on {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Products List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Products ({order.products.length})
                  </h2>
                  <div className="space-y-4">
                    {order.products.map((product, index) => {
                      // Product ID is available as _id in the API response
                      const productId = product._id || product.id || product.product_id
                      return (
                        <motion.div
                          key={product._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <Card
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/products/${productId}`)}
                          >
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                {/* Product Image */}
                                {product.product_image_urls?.[0] && (
                                  <Link
                                    href={`/products/${productId}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted shrink-0"
                                  >
                                    <Image
                                      src={product.product_image_urls[0]}
                                      alt={product.title}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 96px, 128px"
                                    />
                                  </Link>
                                )}

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/products/${productId}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="block"
                                  >
                                    <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                                      {product.title}
                                    </h3>
                                  </Link>
                                  <div className="flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5 text-primary" />
                                    <span className="text-xl font-bold text-primary">
                                      {formatPrice(product.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {formatPrice(order.unit_price)}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-6 w-6 text-primary" />
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(order.unit_price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {order.address}
                  </p>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Payment
                      </span>
                      <Badge
                        variant={
                          order.payment_status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Delivery
                      </span>
                      <Badge
                        variant={order.is_delivered ? "default" : "secondary"}
                        className={
                          order.is_delivered ? "bg-green-500" : ""
                        }
                      >
                        {order.is_delivered ? "Delivered" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

