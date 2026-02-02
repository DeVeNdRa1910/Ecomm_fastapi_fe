"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, X, Loader2 } from "lucide-react"
import { productApi } from "@/lib/product-api"
import { useToast } from "@/lib/toast-context"
import { tokenManager } from "@/lib/cookies"

// Product categories
const PRODUCT_CATEGORIES = [
  { value: "mobile_phones", label: "Mobile Phones" },
  { value: "laptops", label: "Laptops" },
  { value: "tablets", label: "Tablets" },
  { value: "desktops", label: "Desktops" },
  { value: "televisions", label: "Televisions" },
  { value: "smart_tvs", label: "Smart TVs" },
  { value: "audio_devices", label: "Audio Devices" },
  { value: "home_theatre", label: "Home Theatre" },
  { value: "cameras", label: "Cameras" },
  { value: "wearables", label: "Wearables" },
  { value: "computer_accessories", label: "Computer Accessories" },
  { value: "mobile_accessories", label: "Mobile Accessories" },
  { value: "networking_devices", label: "Networking Devices" },
  { value: "storage_devices", label: "Storage Devices" },
  { value: "gaming_consoles", label: "Gaming Consoles" },
  { value: "gaming_accessories", label: "Gaming Accessories" },
  { value: "smart_home_devices", label: "Smart Home Devices" },
] as const

// All fields are optional for editing
const updateProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  quantity: z.number().int().optional(),
  images: z.array(z.instanceof(File)).optional(),
})

type UpdateProductFormValues = z.infer<typeof updateProductSchema>

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const { success, error: showError } = useToast()
  
  // Extract productId from params - handle both array and string cases
  const productId = params?.id 
    ? (Array.isArray(params.id) ? params.id[0] : params.id)
    : undefined

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      category: "",
    },
  })

  const watchedImages = watch("images")

  // Fetch product data and populate form
  useEffect(() => {
    // Wait for params to be available
    if (!params) {
      return
    }

    const fetchProduct = async () => {
      const token = tokenManager.getToken()
      if (!token) {
        router.push("/signin")
        return
      }

      // Get productId from params
      const id = params.id 
        ? (Array.isArray(params.id) ? params.id[0] : String(params.id))
        : null

      // Validate productId
      if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
        showError("Product ID is missing or invalid. Please try again.")
        setIsLoading(false)
        setTimeout(() => {
          router.push("/admin/products")
        }, 2000)
        return
      }

      setIsLoading(true)
      try {
        const response = await productApi.getProductById(id)
        const product = response.product
        
        // Store existing images
        setExistingImages(product.product_image_urls || [])
        
        // Populate form with existing data
        reset({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category || "",
          quantity: product.quantity,
          // Don't set images in defaultValues - only set when user uploads
        })
      } catch (err) {
        let errorMessage = "Failed to load product."
        if (err instanceof Error) {
          // Check if it's a 404 error
          if ('status' in err && (err as any).status === 404) {
            errorMessage = "Product not found. It may have been deleted."
          } else {
            errorMessage = err.message || errorMessage
          }
        }
        showError(errorMessage)
        setTimeout(() => {
          router.push("/admin/products")
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params, router, showError, reset])

  const onSubmit = async (data: UpdateProductFormValues) => {
    setIsSubmitting(true)
    try {
      // Get productId from params to ensure we have the correct ID
      const id = params?.id 
        ? (Array.isArray(params.id) ? params.id[0] : String(params.id))
        : null

      if (!id) {
        showError("Product ID is missing. Cannot update product.")
        setIsSubmitting(false)
        return
      }

      // Ensure images is undefined if empty array or no images
      const imagesToSend = data.images && Array.isArray(data.images) && data.images.length > 0 
        ? data.images 
        : undefined

      const response = await productApi.updateProduct(id, {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        quantity: data.quantity,
        images: imagesToSend,
      })

      success(response.message || "Product updated successfully!")
      
      // Small delay to ensure backend update is complete, then redirect to product detail page
      setTimeout(() => {
        router.push(`/admin/products/${id}`)
      }, 500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update product. Please try again."
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (files: File[]) => {
    // Only set images if there are actual files, otherwise set undefined
    if (files && files.length > 0) {
      setValue("images", files, { shouldValidate: true })
    } else {
      setValue("images", undefined, { shouldValidate: true })
    }
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      watchedImages?.forEach((file) => {
        if (file instanceof File) {
          const url = URL.createObjectURL(file)
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [watchedImages])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            Update product information. All fields are optional.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/products/${productId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product
        </Button>
      </div>

      {/* Form Card */}
      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Update the fields you want to change. Leave fields empty to keep existing values.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Macbook Air m2"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 69999"
                  {...register("price", { valueAsNumber: true })}
                  className={errors.price ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Enter product description"
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="category"
                        className={errors.category ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 120"
                  {...register("quantity", { valueAsNumber: true })}
                  className={errors.quantity ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <FileUpload
                accept="image/*"
                multiple={true}
                disabled={isSubmitting}
                label=""
                helperText="Drag & drop images here or click to upload. You can upload multiple images. Leave empty to keep existing images."
                onChange={handleImageChange}
                value={watchedImages || []}
                accumulate={true}
              />
              {errors.images && (
                <p className="text-sm text-destructive">{errors.images.message}</p>
              )}
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Existing Images</p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-border"
                      >
                        <img
                          src={imageUrl}
                          alt={`Existing image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newly Added Images */}
              {watchedImages && watchedImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    New Images ({watchedImages.length})
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {watchedImages.map((file, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = watchedImages.filter((_, i) => i !== index)
                            // Set undefined if no images left, otherwise set the filtered array
                            if (newImages.length === 0) {
                              setValue("images", undefined, { shouldValidate: true })
                            } else {
                              setValue("images", newImages, { shouldValidate: true })
                            }
                          }}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 shadow-lg z-10"
                          disabled={isSubmitting}
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/products/${productId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-lg"
              >
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

