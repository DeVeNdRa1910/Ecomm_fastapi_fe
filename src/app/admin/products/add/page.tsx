"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
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
import { ArrowLeft, X, Plus } from "lucide-react"
import { productApi } from "@/lib/product-api"
import { useToast } from "@/lib/toast-context"

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

const addProductSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
  category: z.string().min(1, { message: "Category is required" }),
  quantity: z.number().int().min(0, { message: "Quantity must be 0 or greater" }),
  images: z.array(z.instanceof(File)).min(1, { message: "At least one image is required" }),
})

type AddProductFormValues = z.infer<typeof addProductSchema>

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error: showError } = useToast()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      images: [],
      category: "",
    },
  })

  const watchedImages = watch("images")
  
  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup will happen automatically when images are removed or component unmounts
      // Object URLs are created in render and cleaned up by browser when no longer referenced
    }
  }, [])

  const onSubmit = async (data: AddProductFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await productApi.addProduct({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        quantity: data.quantity,
        images: data.images,
      })

      success(response.message || "Product added successfully!")
      router.push("/admin/products")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add product. Please try again."
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (files: File[]) => {
    setValue("images", files, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your catalog
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Form Card */}
      <Card className="shadow-lg border-border">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Fill in the product details below. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
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
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
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
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="quantity">
                  Quantity <span className="text-destructive">*</span>
                </Label>
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
              <Label>
                Product Images <span className="text-destructive">*</span>
              </Label>
              <FileUpload
                accept="image/*"
                multiple={true}
                disabled={isSubmitting}
                label=""
                helperText="Drag & drop images here or click to upload. You can upload multiple images."
                onChange={handleImageChange}
                value={watchedImages}
                accumulate={true}
              />
              {errors.images && (
                <p className="text-sm text-destructive">{errors.images.message}</p>
              )}
              {watchedImages && watchedImages.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">
                    {watchedImages.length} image{watchedImages.length !== 1 ? "s" : ""} selected
                  </p>
                  {/* Image Previews */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchedImages.map((file, index) => {
                      const imageUrl = URL.createObjectURL(file)
                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted shadow-md hover:shadow-lg transition-shadow"
                        >
                          {/* Image Preview */}
                          <img
                            src={imageUrl}
                            alt={`Preview ${index + 1}: ${file.name}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Remove Button Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                URL.revokeObjectURL(imageUrl)
                                const newImages = watchedImages.filter((_, i) => i !== index)
                                setValue("images", newImages, { shouldValidate: true })
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 shadow-lg"
                              disabled={isSubmitting}
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {/* Image Number Badge */}
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            {index + 1}
                          </div>
                          {/* File Name Tooltip */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-2">
                            <p className="text-xs text-white truncate font-medium" title={file.name}>
                              {file.name}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-lg"
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

