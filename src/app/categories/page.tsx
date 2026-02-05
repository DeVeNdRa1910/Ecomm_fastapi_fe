"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Tag, ArrowRight } from "lucide-react"

// Product categories - same as in admin
const PRODUCT_CATEGORIES = [
  { value: "mobile_phones", label: "Mobile Phones", icon: "📱" },
  { value: "laptops", label: "Laptops", icon: "💻" },
  { value: "tablets", label: "Tablets", icon: "📱" },
  { value: "desktops", label: "Desktops", icon: "🖥️" },
  { value: "televisions", label: "Televisions", icon: "📺" },
  { value: "smart_tvs", label: "Smart TVs", icon: "📺" },
  { value: "audio_devices", label: "Audio Devices", icon: "🔊" },
  { value: "home_theatre", label: "Home Theatre", icon: "🎬" },
  { value: "cameras", label: "Cameras", icon: "📷" },
  { value: "wearables", label: "Wearables", icon: "⌚" },
  { value: "computer_accessories", label: "Computer Accessories", icon: "🖱️" },
  { value: "mobile_accessories", label: "Mobile Accessories", icon: "📲" },
  { value: "networking_devices", label: "Networking Devices", icon: "🌐" },
  { value: "storage_devices", label: "Storage Devices", icon: "💾" },
  { value: "gaming_consoles", label: "Gaming Consoles", icon: "🎮" },
  { value: "gaming_accessories", label: "Gaming Accessories", icon: "🎯" },
  { value: "smart_home_devices", label: "Smart Home Devices", icon: "🏠" },
] as const

export default function CategoriesPage() {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Product Categories
              </h1>
              <p className="text-muted-foreground text-lg">
                Browse products by category
              </p>
            </motion.div>

            {/* Categories Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {PRODUCT_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/categories/${category.value}`}>
                    <Card className="shadow-lg border-border hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        {/* Category Icon */}
                        <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        
                        {/* Category Name */}
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {category.label}
                        </h3>
                        
                        {/* View Products Link */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors mt-auto">
                          <span>View Products</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

