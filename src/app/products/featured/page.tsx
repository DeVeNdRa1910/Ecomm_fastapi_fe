"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { IndianRupee, Package, ShoppingCart, Tag, Loader2, Star, Sparkles } from "lucide-react"
import { productApi, type Product } from "@/lib/product-api"
import { useToast } from "@/lib/toast-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { error: showError } = useToast()

  // Fetch products on mount using public API
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      // For now, use all-products API
      // Later, this will be replaced with a dedicated featured products API
      const allProducts = await productApi.getAllProducts()
      // Filter to show only active products
      const activeProducts = (allProducts || []).filter(
        (product) => product.is_active !== false
      )
      // Limit to first 12 products for featured section (can be adjusted)
      // When dedicated API is ready, this filtering won't be needed
      setProducts(activeProducts.slice(0, 12))
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load featured products."
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatCategory = (category: string | null | undefined) => {
    if (!category) return "Uncategorized"
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Helper to get product ID (handles both id and _id fields)
  const getProductId = (product: Product) => {
    return product.id || product._id || ""
  }

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1" data-scroll-section>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Handpicked Selection
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Featured Products
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover our carefully curated selection of premium products,
                handpicked for quality and value
              </p>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Card
                    key={i}
                    className="shadow-lg border-border animate-pulse overflow-hidden"
                  >
                    <div className="h-64 bg-muted" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="shadow-lg border-border max-w-md mx-auto">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Featured Products Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Check back later for featured products!
                  </p>
                  <Link href="/products">
                    <button className="text-primary hover:underline font-medium">
                      View All Products →
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => {
                  const productId = getProductId(product)
                  return (
                    <motion.div
                      key={productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full"
                    >
                      <Link href={`/products/${productId}`}>
                        <div className="relative group cursor-pointer h-full">
                          {/* Featured Badge */}
                          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white" />
                            Featured
                          </div>

                          {/* VIBGYOR Animated Border */}
                          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-300 animate-gradient-x"></div>

                          {/* Card Content - Fixed height */}
                          <Card className="relative bg-card rounded-2xl border-0 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                            {/* Product Image - Fixed height */}
                            <div className="relative h-64 w-full bg-muted overflow-hidden flex-shrink-0">
                              {product.product_image_urls &&
                              product.product_image_urls.length > 0 ? (
                                <>
                                  <img
                                    src={product.product_image_urls[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src =
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                                    }}
                                  />
                                  {/* Image Gallery Indicator */}
                                  {product.product_image_urls.length > 1 && (
                                    <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
                                      {product.product_image_urls.length} images
                                    </div>
                                  )}
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>View Details</span>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                  <Package className="h-16 w-16" />
                                </div>
                              )}
                            </div>

                            <CardContent className="p-6 flex-1 flex flex-col min-h-[240px]">
                              {/* Category Badge */}
                              <div className="mb-3 flex-shrink-0">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                                  <Tag className="h-3 w-3" />
                                  {formatCategory(product.category)}
                                </span>
                              </div>

                              {/* Product Title - Fixed height */}
                              <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors flex-shrink-0">
                                {product.title}
                              </h3>

                              {/* Product Description - Fixed height */}
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem] flex-shrink-0">
                                {product.description}
                              </p>

                              {/* Spacer to push footer down */}
                              <div className="flex-1"></div>

                              {/* Price and Stock - Always at bottom */}
                              <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
                                <div className="flex items-center gap-1 text-xl font-bold text-primary">
                                  <IndianRupee className="h-5 w-5" />
                                  {formatPrice(product.price)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {product.in_stock === true ||
                                  (product.in_stock === undefined &&
                                    product.is_active !== false) ? (
                                    <span className="text-green-600 font-medium">
                                      {product.quantity
                                        ? `In Stock (${product.quantity})`
                                        : "Available"}
                                    </span>
                                  ) : (
                                    <span className="text-red-600 font-medium">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* View All Products Link */}
            {!isLoading && products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center mt-12"
              >
                <Link href="/products">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                    View All Products
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Add custom styles for animated gradient */}
            <style jsx>{`
              @keyframes gradient-x {
                0%,
                100% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
              }
              .animate-gradient-x {
                background-size: 200% 200%;
                animation: gradient-x 3s ease infinite;
              }
            `}</style>
          </div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

