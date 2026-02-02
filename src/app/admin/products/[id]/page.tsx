"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Package, 
  IndianRupee, 
  ShoppingCart, 
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit,
  Trash2
} from "lucide-react"
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { productApi } from "@/lib/product-api"
import { useToast } from "@/lib/toast-context"
import { tokenManager } from "@/lib/cookies"
import { X } from "lucide-react"

interface ProductDetail {
  id?: string
  _id?: string
  title: string
  description: string
  price: number
  category: string
  seller_id: string
  quantity: number
  product_image_urls: string[]
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { success, error: showError } = useToast()
  
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const token = tokenManager.getToken()
      if (!token) {
        router.push("/signin")
        return
      }

      setIsLoading(true)
      try {
        const response = await productApi.getProductById(productId)
        setProduct(response.product)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load product."
        showError(errorMessage)
        setTimeout(() => {
          router.push("/admin/products")
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router, showError])

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

  const nextImage = () => {
    if (product && product.product_image_urls.length > 0) {
      setSelectedImageIndex((prev) => 
        (prev + 1) % product.product_image_urls.length
      )
    }
  }

  const prevImage = () => {
    if (product && product.product_image_urls.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.product_image_urls.length - 1 : prev - 1
      )
    }
  }

  const handleDelete = async () => {
    const id = product?.id || product?._id || productId
    if (!id) {
      showError("Product ID is missing")
      return
    }

    setIsDeleting(true)
    try {
      await productApi.deleteProduct(id)
      success("Product deleted successfully!")
      router.push("/admin/products")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product. Please try again."
      showError(errorMessage)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </motion.div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </motion.div>
      </div>
    )
  }

  const hasMultipleImages = product.product_image_urls.length > 1
  const currentImage = product.product_image_urls[selectedImageIndex] || ""

  return (
    <div className="space-y-6">
      {/* Back Button and Action Buttons */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-4"
      >
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push(`/admin/products/edit/${product.id || product._id || productId}`)}
            className="shadow-lg"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="shadow-lg"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Product
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Main Image */}
          <Card className="shadow-xl border-border overflow-hidden relative group max-w-[80%] mx-auto">
            <div className="relative aspect-square bg-muted overflow-hidden">
              {currentImage ? (
                <>
                  <motion.img
                    key={selectedImageIndex}
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    onError={() => setImageError(true)}
                  />
                  {/* Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {/* Image Counter */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      {selectedImageIndex + 1} / {product.product_image_urls.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Package className="h-24 w-24 opacity-50" />
                </div>
              )}
            </div>
          </Card>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-4 gap-3"
            >
              {product.product_image_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary shadow-lg scale-105"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImageIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Title and Category */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground capitalize">
                  {formatCategory(product.category)}
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {product.title}
              </h1>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 pb-4 border-b border-border"
            >
              <IndianRupee className="h-6 w-6 text-primary" />
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-lg border-border">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stock Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="shadow-lg border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock Quantity</p>
                      <p className={`text-2xl font-bold ${product.quantity > 0 ? 'text-foreground' : 'text-destructive'}`}>
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                  {product.quantity === 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-2 bg-destructive/10 text-destructive rounded-full font-medium text-sm"
                    >
                      Out of Stock
                    </motion.span>
                  )}
                  {product.quantity > 0 && product.quantity < 10 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full font-medium text-sm"
                    >
                      Low Stock
                    </motion.span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product ID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-xs text-muted-foreground"
          >
            Product ID: {product.id || product._id || productId || 'N/A'}
          </motion.div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteConfirm} 
        onClose={() => !isDeleting && setShowDeleteConfirm(false)} 
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md border bg-background/95 backdrop-blur-xl rounded-lg shadow-2xl w-full">
            <div className="flex items-center justify-between p-6 pb-4 border-b">
              <DialogTitle className="font-bold text-xl text-destructive">
                Delete Product
              </DialogTitle>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <Description className="text-sm text-muted-foreground">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{product.title}"</span>? This action cannot be undone.
              </Description>
              
              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="shadow-lg"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

