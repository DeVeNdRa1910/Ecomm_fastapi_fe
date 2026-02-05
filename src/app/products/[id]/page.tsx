"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Package, 
  IndianRupee, 
  ShoppingCart, 
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { productApi } from "@/lib/product-api"
import { cartApi } from "@/lib/cart-api"
import { paymentApi } from "@/lib/payment-api"
import { orderApi } from "@/lib/order-api"
import { authApi } from "@/lib/auth-api"
import { useAuthStore } from "@/store/useAuthStore"
import { CompleteProfileModal } from "@/components/complete-profile-modal"
import { getMissingOrderProfileFields, type ProfileMissingField } from "@/lib/profile"
import { getUserId } from "@/lib/user-id"
import { useToast } from "@/lib/toast-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { tokenManager } from "@/lib/cookies"

interface ProductDetail {
  id?: string
  _id?: string
  title: string
  description: string
  price: number
  category: string
  seller_id?: string
  quantity?: number
  product_image_urls: string[]
  is_active?: boolean
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { success, error: showError } = useToast()
  const { user, setUser } = useAuthStore()
  
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [missingProfileFields, setMissingProfileFields] = useState<ProfileMissingField[]>([])
  
  // Flipkart-style magnifying glass state
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const imageRef = useRef<HTMLDivElement>(null)
  const zoomPreviewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        // Use public API (no authentication required)
        const product = await productApi.getProductByIdPublic(productId)
        setProduct(product)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load product."
        showError(errorMessage)
        setTimeout(() => {
          router.push("/products")
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

  // Flipkart-style magnifying glass handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !product || !currentImage) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage position for zoom preview background position
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    // Update mouse position for magnifying glass lens
    setMousePosition({ x, y })
    
    // Update zoom position for preview (inverted for natural zoom effect)
    setZoomPosition({ 
      x: Math.max(0, Math.min(100, percentX)), 
      y: Math.max(0, Math.min(100, percentY)) 
    })
  }

  const handleMouseEnter = () => {
    setIsZooming(true)
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  const handleAddToCart = async () => {
    const token = tokenManager.getToken()
    if (!token) {
      showError("Please sign in to add items to cart")
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
      return
    }

    if (!product) return

    const currentProductId = product.id || product._id || productId
    if (!currentProductId) {
      showError("Product ID is missing")
      return
    }

    setIsAddingToCart(true)
    try {
      const response = await cartApi.addToCart(currentProductId, quantity)
      success(response.message || "Product added to cart successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add product to cart. Please try again."
      showError(errorMessage)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    const token = tokenManager.getToken()
    if (!token) {
      showError("Please sign in to buy products")
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
      return
    }

    if (!product) return

    if (product.is_active === false) {
      showError("This product is currently out of stock")
      return
    }

    setIsProcessingBuyNow(true)
    try {
      // Ensure user is loaded (AuthInitializer may still be fetching)
      const currentUser = user ?? (await authApi.getMe())
      if (!user) setUser(currentUser)

      // Block buy-now if profile is incomplete
      const missing = getMissingOrderProfileFields(currentUser)
      if (missing.length > 0) {
        setMissingProfileFields(missing)
        setIsProfileModalOpen(true)
        return
      }

      const currentProductId = product.id || product._id || productId
      const sellerId = product.seller_id
      if (!currentProductId || !sellerId) {
        showError("Unable to create order: missing product information.")
        return
      }

      const userId = getUserId(currentUser)
      if (!userId) {
        showError("Unable to create order: missing user id. Please sign in again.")
        return
      }
      const address = (currentUser.address || "").trim()

      // Create order (ordered_from = product_page)
      await orderApi.createOrder({
        product_id: [currentProductId],
        seller_id: [sellerId],
        ordered_from: "product_page",
        user_id: userId,
        address,
        category: product.category || "uncategorized",
        quantity,
        unit_price: product.price,
      })

      // Transform product to checkout format
      const products = [
        {
          name: product.title,
          price: product.price,
          quantity: quantity,
        },
      ]

      // Create checkout session
      const response = await paymentApi.createCheckoutSession(products)
      
      // Redirect to the checkout URL
      if (response.url) {
        window.location.href = response.url
      } else {
        showError("Failed to create checkout session. Please try again.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create checkout session. Please try again."
      showError(errorMessage)
    } finally {
      setIsProcessingBuyNow(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <CompleteProfileModal
          open={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          missingFields={missingProfileFields}
          onGoToMyAccount={() => router.push("/my-account")}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer data-scroll-section />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col" data-scroll-section>
        <Header />
        <CompleteProfileModal
          open={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          missingFields={missingProfileFields}
          onGoToMyAccount={() => router.push("/my-account")}
        />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Product Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The product you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button 
                onClick={() => {
                  // Check if there's history to go back to
                  if (window.history.length > 1) {
                    router.back()
                  } else {
                    // Fallback to products page if no history
                    router.push("/products")
                  }
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer data-scroll-section />
      </div>
    )
  }

  const hasMultipleImages = product.product_image_urls.length > 1
  const currentImage = product.product_image_urls[selectedImageIndex] || ""

  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <CompleteProfileModal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        missingFields={missingProfileFields}
        onGoToMyAccount={() => router.push("/my-account")}
      />
      <main className="flex-1" data-scroll-section>
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => {
              // Check if there's history to go back to
              if (window.history.length > 1) {
                router.back()
              } else {
                // Fallback to products page if no history
                router.push("/products")
              }
            }}
            className="shadow-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery with Flipkart-style Magnifying Glass */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image Container with Magnifying Glass */}
            <div className="relative">
              <Card className="shadow-2xl border-border overflow-hidden relative group">
                <div 
                  ref={imageRef}
                  className="relative aspect-square bg-muted overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {currentImage ? (
                    <>
                      {/* Main Image */}
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
                      
                      {/* Magnifying Glass Lens (follows cursor) - Flipkart style */}
                      {isZooming && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute pointer-events-none z-30 border-2 border-white rounded-full overflow-hidden shadow-2xl"
                          style={{
                            left: `${mousePosition.x}px`,
                            top: `${mousePosition.y}px`,
                            width: '200px',
                            height: '200px',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 0 40px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.2)',
                          }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${currentImage})`,
                              backgroundSize: `${imageRef.current?.offsetWidth ? imageRef.current.offsetWidth * 2.5 : 1000}px ${imageRef.current?.offsetHeight ? imageRef.current.offsetHeight * 2.5 : 1000}px`,
                              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              backgroundRepeat: 'no-repeat',
                            }}
                          />
                        </motion.div>
                      )}

                      {/* Large Zoom Preview Area (Flipkart style) - Shows on hover */}
                      {isZooming && (
                        <motion.div
                          ref={zoomPreviewRef}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hidden lg:block absolute left-full ml-4 top-0 w-full h-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-2xl z-40"
                          style={{
                            aspectRatio: '1 / 1',
                          }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${currentImage})`,
                              backgroundSize: `${imageRef.current?.offsetWidth ? imageRef.current.offsetWidth * 2.5 : 1000}px ${imageRef.current?.offsetHeight ? imageRef.current.offsetHeight * 2.5 : 1000}px`,
                              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              backgroundRepeat: 'no-repeat',
                            }}
                          />
                        </motion.div>
                      )}

                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage()
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 z-20 shadow-lg"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage()
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 z-20 shadow-lg"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full z-20">
                        {selectedImageIndex + 1} / {product.product_image_urls.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                    <Package className="h-24 w-24" />
                  </div>
                )}
              </div>
            </Card>
            </div>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-3">
                {product.product_image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              {/* Category */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  <Tag className="h-4 w-4" />
                  {formatCategory(product.category)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-2 mb-6">
                <IndianRupee className="h-8 w-8 text-primary" />
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.is_active !== false ? (
                  <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">
                      {product.quantity ? `In Stock (${product.quantity} available)` : 'Available'}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg">
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <Card className="shadow-lg border-border mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 shadow-lg bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-600 hover:via-indigo-600 hover:to-blue-600 text-white"
                  disabled={product.is_active === false || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {product.is_active !== false ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 shadow-lg"
                  onClick={handleBuyNow}
                  disabled={product.is_active === false || isAddingToCart || isProcessingBuyNow}
                >
                  {isProcessingBuyNow ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
          </div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

