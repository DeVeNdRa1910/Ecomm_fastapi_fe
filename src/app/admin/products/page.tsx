"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, IndianRupee, ShoppingCart, Tag } from "lucide-react"
import { productApi, type Product } from "@/lib/product-api"
import { useToast } from "@/lib/toast-context"
import Link from "next/link"

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { error: showError } = useToast()

  // Fetch products on mount
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await productApi.getProducts()
      setProducts(response.seller_products || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load products."
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatCategory = (category: string | null | undefined) => {
    if (!category) return 'Uncategorized'
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button 
          className="shadow-lg" 
          onClick={() => router.push("/admin/products/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="shadow-lg border-border animate-pulse overflow-hidden">
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
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>All products in your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No products yet.</p>
              <Button onClick={() => router.push("/admin/products/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{products.length}</span> product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={`/admin/products/${product._id}`}>
                  <div className="relative group cursor-pointer h-full">
                    {/* Blue Animated Border */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-400 via-blue-500 via-blue-600 to-blue-700 opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-300 animate-gradient-x-blue"></div>
                    
                    {/* Card Content - Fixed height */}
                    <Card className="relative bg-card rounded-2xl border-0 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Product Image - Fixed height */}
                      <div className="relative h-64 w-full bg-muted overflow-hidden flex-shrink-0">
                        {product.product_image_urls && product.product_image_urls.length > 0 ? (
                          <>
                            <img
                              src={product.product_image_urls[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
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
                            {product.in_stock ? (
                              <span className="text-green-600 font-medium">
                                In Stock
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
            ))}
          </div>
        </>
      )}

      {/* Add custom styles for animated blue gradient */}
      <style jsx>{`
        @keyframes gradient-x-blue {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x-blue {
          background-size: 200% 200%;
          animation: gradient-x-blue 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
