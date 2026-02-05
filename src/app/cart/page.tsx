"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  IndianRupee, 
  ShoppingCart, 
  Loader2, 
  Trash2, 
  Plus, 
  Minus,
  ArrowLeft,
  Package
} from "lucide-react"
import { cartApi, type CartProduct } from "@/lib/cart-api"
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
import Image from "next/image"

// Component for rotating product images
function RotatingProductImage({ 
  images, 
  alt, 
  productId 
}: { 
  images: string[]
  alt: string
  productId: string
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only rotate if there are multiple images
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 5000) // Change image every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [images.length])

  const currentImage = images[currentImageIndex] || images[0] || '/placeholder-product.jpg'

  return (
    <motion.div
      key={`${productId}-${currentImageIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0"
    >
      <Image
        src={currentImage}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 640px) 100vw, 128px"
      />
    </motion.div>
  )
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [missingProfileFields, setMissingProfileFields] = useState<ProfileMissingField[]>([])
  const { success, error: showError } = useToast()
  const { user, setUser } = useAuthStore()

  // Fetch cart products on mount
  const fetchCartProducts = async () => {
    setIsLoading(true)
    try {
      const token = tokenManager.getToken()
      if (!token) {
        showError("Please sign in to view your cart")
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
        return
      }

      const products = await cartApi.getCartProducts()
      setCartItems(products || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load cart items."
      showError(errorMessage)
      // If unauthorized, redirect to sign in
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        typeof (err as { status?: unknown }).status === "number" &&
        (err as { status: number }).status === 401
      ) {
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCartProducts()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getProductId = (item: CartProduct): string => {
    // Product ID is in product._id based on the API response structure
    return item.product?._id || item._id || ''
  }

  const handleIncrementQuantity = async (item: CartProduct) => {
    const productId = getProductId(item)
    if (!productId) {
      showError("Product ID is missing")
      return
    }

    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      // Use add-to-cart API to add one more item
      await cartApi.addToCart(productId, 1)
      // Refresh cart to get updated quantities
      await fetchCartProducts()
      success("Item added to cart!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add item to cart."
      showError(errorMessage)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleDecrementQuantity = async (item: CartProduct) => {
    const productId = getProductId(item)
    if (!productId) {
      showError("Product ID is missing")
      return
    }

    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      // Use DELETE API with query parameter to decrease quantity by one
      // This will decrease quantity by 1, or remove item if quantity is 1
      await cartApi.decreaseCartItem(productId)
      // Refresh cart to get updated quantities
      await fetchCartProducts()
      success("Item quantity decreased!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to decrease item quantity."
      showError(errorMessage)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleUpdateQuantity = async (item: CartProduct, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(item)
      return
    }

    const productId = getProductId(item)
    if (!productId) {
      showError("Product ID is missing")
      return
    }

    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      await cartApi.updateCartItem(productId, newQuantity)
      // Update local state
      setCartItems(prev => 
        prev.map(cartItem => {
          const id = getProductId(cartItem)
          if (id === productId) {
            return { ...cartItem, quantity: newQuantity }
          }
          return cartItem
        })
      )
      success("Cart updated successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update cart item."
      showError(errorMessage)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleRemoveItem = async (item: CartProduct) => {
    const productId = getProductId(item)
    if (!productId) {
      showError("Product ID is missing")
      return
    }

    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      // Call API to completely remove the product from cart
      await cartApi.removeFromCart(productId)
      // Refresh cart to ensure consistency with server
      await fetchCartProducts()
      success("Item removed from cart!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item from cart."
      showError(errorMessage)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) {
      return
    }

    try {
      // Call API to delete all products from cart
      await cartApi.clearCart()
      // Clear local state
      setCartItems([])
      // Refresh cart to ensure consistency with server
      await fetchCartProducts()
      success("Cart cleared successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear cart."
      showError(errorMessage)
    }
  }

  const handleCheckout = async () => {
    const token = tokenManager.getToken()
    if (!token) {
      showError("Please sign in to proceed to checkout")
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
      return
    }

    if (cartItems.length === 0) {
      showError("Your cart is empty")
      return
    }

    setIsProcessingCheckout(true)
    try {
      // Ensure user is loaded (AuthInitializer may still be fetching)
      const currentUser = user ?? (await authApi.getMe())
      if (!user) setUser(currentUser)

      // Block checkout if profile is incomplete
      const missing = getMissingOrderProfileFields(currentUser)
      if (missing.length > 0) {
        setMissingProfileFields(missing)
        setIsProfileModalOpen(true)
        return
      }

      const userId = getUserId(currentUser)
      if (!userId) {
        showError("Unable to create order: missing user id. Please sign in again.")
        return
      }
      const address = (currentUser.address || "").trim()

      // Build arrays from cart items
      const productIds = cartItems.map((i) => i.product?._id).filter(Boolean) as string[]
      const sellerIds = cartItems.map((i) => i.product?.seller_id).filter(Boolean) as string[]

      if (productIds.length === 0 || sellerIds.length === 0) {
        showError("Unable to create order: missing product information.")
        return
      }

      const categories = Array.from(
        new Set(cartItems.map((i) => i.product?.category).filter(Boolean) as string[])
      )
      const category = categories.length === 1 ? categories[0] : "mixed"

      const totalQty = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0)
      const totalAmount = cartItems.reduce((sum, i) => {
        const price = i.product?.price || 0
        return sum + price * (i.quantity || 0)
      }, 0)

      // Create order (ordered_from = cart)
      await orderApi.createOrder({
        product_id: productIds,
        seller_id: sellerIds,
        ordered_from: "cart",
        user_id: userId,
        address,
        category,
        quantity: totalQty,
        unit_price: totalAmount,
      })

      // Transform cart items to checkout format
      const products = cartItems.map((item) => ({
        name: item.product?.title || "Product",
        price: item.product?.price || 0,
        quantity: item.quantity,
      }))

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
      setIsProcessingCheckout(false)
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CompleteProfileModal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        missingFields={missingProfileFields}
        onGoToMyAccount={() => router.push("/my-account")}
      />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              // Check if there's history to go back to
              if (window.history.length > 1) {
                router.back()
              } else {
                // Fallback to home page if no history
                router.push('/')
              }
            }}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const productId = getProductId(item)
                const isUpdating = updatingItems.has(productId)
                const product = item.product
                const images = product?.product_image_urls || []
                const hasMultipleImages = images.length > 1

                return (
                  <motion.div
                    key={item._id || productId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image with Rotation */}
                          <Link 
                            href={`/products/${productId}`}
                            className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted shrink-0 group"
                          >
                            {hasMultipleImages ? (
                              <RotatingProductImage
                                images={images}
                                alt={product?.title || 'Product'}
                                productId={productId}
                              />
                            ) : (
                              <Image
                                src={images[0] || '/placeholder-product.jpg'}
                                alt={product?.title || 'Product'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, 128px"
                              />
                            )}
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex-1">
                              <Link 
                                href={`/products/${productId}`}
                                className="hover:text-primary transition-colors"
                              >
                                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                                  {product?.title || 'Product'}
                                </h3>
                              </Link>
                              {product?.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {product.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mb-4">
                                <IndianRupee className="h-5 w-5 text-primary" />
                                <span className="text-2xl font-bold text-primary">
                                  {formatPrice(product?.price || 0)}
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls and Remove */}
                            <div className="flex items-center justify-between gap-4 pt-4 border-t">
                              {/* Quantity Selector */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDecrementQuantity(item)}
                                  disabled={isUpdating}
                                  className="h-9 w-9"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1
                                    handleUpdateQuantity(item, Math.max(1, val))
                                  }}
                                  className="w-20 text-center"
                                  disabled={isUpdating}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleIncrementQuantity(item)}
                                  disabled={isUpdating}
                                  className="h-9 w-9"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Item Total</p>
                                <p className="text-lg font-bold text-primary">
                                  {formatPrice((product?.price || 0) * item.quantity)}
                                </p>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item)}
                                disabled={isUpdating}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}

              {/* Clear Cart Button */}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky top-24 shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full mb-4 bg-linear-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-600 hover:via-indigo-600 hover:to-blue-600 text-white"
                      onClick={handleCheckout}
                      disabled={isProcessingCheckout || cartItems.length === 0}
                    >
                      {isProcessingCheckout ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      asChild
                    >
                      <Link href="/products">
                        Continue Shopping
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

