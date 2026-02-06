"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  Shield,
  Truck,
  Headphones,
  Award,
  Users,
  TrendingUp,
  Heart,
  Zap,
  Globe,
  CreditCard,
  Search,
  Star,
  Package,
  Lock,
  Smartphone,
  BarChart3,
  Palette,
  RefreshCw,
  Gift,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Store,
  FileText,
  Download,
} from "lucide-react"
import Link from "next/link"

const mainFeatures = [
  {
    icon: ShoppingBag,
    title: "Wide Product Selection",
    description: "Browse through thousands of quality products across multiple categories. From electronics to fashion, find everything you need in one place.",
    color: "from-violet-500 to-purple-600",
    gradient: "bg-gradient-to-br from-violet-500/10 to-purple-600/10",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Your payments are protected with industry-leading encryption and secure payment gateways. Shop with complete confidence and peace of mind.",
    color: "from-blue-500 to-cyan-600",
    gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-600/10",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Quick shipping options with real-time tracking. Get your orders delivered to your doorstep with our trusted delivery partners.",
    color: "from-green-500 to-emerald-600",
    gradient: "bg-gradient-to-br from-green-500/10 to-emerald-600/10",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "Our dedicated support team is available round the clock to assist you with any queries, concerns, or issues you may have.",
    color: "from-orange-500 to-red-600",
    gradient: "bg-gradient-to-br from-orange-500/10 to-red-600/10",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "All products undergo strict quality checks. We ensure only the best quality items reach our customers with satisfaction guarantee.",
    color: "from-yellow-500 to-amber-600",
    gradient: "bg-gradient-to-br from-yellow-500/10 to-amber-600/10",
  },
  {
    icon: TrendingUp,
    title: "Best Prices & Deals",
    description: "Competitive pricing with regular discounts, flash sales, and exclusive deals. Save more on every purchase with our best price guarantee.",
    color: "from-pink-500 to-rose-600",
    gradient: "bg-gradient-to-br from-pink-500/10 to-rose-600/10",
  },
]

const shoppingFeatures = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Advanced search with filters, categories, and recommendations to find exactly what you're looking for.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: ShoppingCart,
    title: "Easy Checkout",
    description: "Streamlined checkout process with multiple payment options including cards, UPI, and digital wallets.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Package,
    title: "Order Tracking",
    description: "Track your orders in real-time from confirmation to delivery with detailed status updates.",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Hassle-free return and refund policy. Return products within the specified period for a full refund.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Gift,
    title: "Rewards & Loyalty",
    description: "Earn points on every purchase and redeem them for discounts. Join our loyalty program for exclusive benefits.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: Star,
    title: "Product Reviews",
    description: "Read authentic customer reviews and ratings to make informed purchasing decisions.",
    color: "from-yellow-500 to-amber-600",
  },
]

const sellerFeatures = [
  {
    icon: Store,
    title: "Easy Store Setup",
    description: "Create and manage your online store in minutes. Simple interface to list products and start selling.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive analytics to track sales, revenue, customer behavior, and inventory management.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: FileText,
    title: "Order Management",
    description: "Efficient order processing system with automated notifications and customer communication tools.",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: Download,
    title: "Export Reports",
    description: "Download detailed reports of your sales, customers, and inventory in CSV format for analysis.",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Palette,
    title: "Customizable Theme",
    description: "Personalize your admin panel with custom colors. Choose from presets or create your own theme.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "View and manage customer information, track purchase history, and build lasting relationships.",
    color: "from-cyan-500 to-blue-600",
  },
]

const securityFeatures = [
  {
    icon: Lock,
    title: "Data Encryption",
    description: "All sensitive data is encrypted using industry-standard protocols to ensure maximum security.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "PCI DSS compliant payment processing with multiple secure payment gateway integrations.",
  },
  {
    icon: CheckCircle,
    title: "Verified Sellers",
    description: "All sellers undergo verification process to ensure authenticity and build trust with buyers.",
  },
]

const stats = [
  { value: "10K+", label: "Happy Customers", icon: Users },
  { value: "50K+", label: "Products Available", icon: ShoppingBag },
  { value: "500+", label: "Trusted Sellers", icon: Store },
  { value: "99%", label: "Satisfaction Rate", icon: Heart },
]

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1" data-scroll-section>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Powerful Features
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Everything You Need to
                <br />
                Shop & Sell Online
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover the comprehensive features that make Fastkart the perfect
                platform for both buyers and sellers. Experience seamless shopping
                and powerful selling tools.
              </p>
            </motion.div>

            {/* Stats Section */}
            <section className="mb-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="shadow-lg border-border text-center hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-center mb-3">
                            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* Main Features Section */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Core Features
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need for a seamless shopping experience
                </p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mainFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-2xl transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4 w-fit`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-3">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* Shopping Features Section */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Shopping Features
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tools and features designed to enhance your shopping experience
                </p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shoppingFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4 w-fit`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* Seller Features Section */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Seller Features
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Powerful tools to help you grow and manage your online business
                </p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-xl transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4 w-fit`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* Security Features Section */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Security & Trust
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your security and privacy are our top priorities
                </p>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {securityFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-xl transition-all duration-300 h-full text-center">
                        <CardContent className="p-8">
                          <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                              <Icon className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold mb-3">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <Card className="shadow-2xl border-border bg-gradient-to-br from-primary/5 via-background to-primary/5">
                  <CardContent className="p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Ready to Get Started?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Join thousands of satisfied customers and sellers. Start
                      shopping or selling today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        asChild
                        size="lg"
                        className="shadow-lg"
                      >
                        <Link href="/products">
                          Start Shopping
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="shadow-lg"
                      >
                        <Link href="/signup">
                          Become a Seller
                          <Store className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

