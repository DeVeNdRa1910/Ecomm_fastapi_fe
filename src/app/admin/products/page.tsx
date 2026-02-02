"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-lg border-border animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product._id} href={`/admin/products/${product._id}`}>
                <Card className="shadow-lg border-border hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
                {/* Product Image */}
                <div className="relative h-44 w-full bg-muted overflow-hidden shrink-0">
                  {product.product_image_urls && product.product_image_urls.length > 0 ? (
                    <>
                      <img
                        src={product.product_image_urls[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                      <Package className="h-16 w-16 opacity-50" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-background/90 backdrop-blur-sm text-foreground text-xs px-2.5 py-1 rounded-full font-medium shadow-lg flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      <span className="capitalize">{formatCategory(product.category)}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 flex flex-col grow">
                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-1.5 mb-4 pb-4 border-b border-border">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Stock: <span className={`font-semibold ${product.quantity > 0 ? 'text-foreground' : 'text-destructive'}`}>
                          {product.quantity}
                        </span>
                      </span>
                    </div>
                    {product.quantity === 0 && (
                      <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
