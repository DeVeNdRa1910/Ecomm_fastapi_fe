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
  Globe
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: ShoppingBag,
    title: "Wide Selection",
    description: "Browse through thousands of quality products from trusted sellers",
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Your transactions are protected with industry-leading security",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to get your products to you fast",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer service team is always here to help you",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "We ensure all products meet our high quality standards",
    color: "from-yellow-500 to-amber-600"
  },
  {
    icon: TrendingUp,
    title: "Best Prices",
    description: "Competitive pricing with regular deals and discounts",
    color: "from-pink-500 to-rose-600"
  }
]

const stats = [
  { value: "10K+", label: "Happy Customers", icon: Users },
  { value: "50K+", label: "Products Available", icon: ShoppingBag },
  { value: "500+", label: "Trusted Sellers", icon: Shield },
  { value: "99%", label: "Satisfaction Rate", icon: Heart }
]

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Your satisfaction is our top priority. We go above and beyond to ensure you have the best shopping experience."
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We continuously improve our platform with the latest technology to make shopping easier and more enjoyable."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connecting buyers and sellers from around the world, making commerce accessible to everyone."
  }
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1" data-scroll-section>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 md:py-32">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-blue-500/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent"
                >
                  About fastapi_comm
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
                >
                  Your trusted e-commerce platform for quality products and exceptional service.
                  We're committed to making online shopping simple, secure, and enjoyable.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                    Our Story
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    Founded with a vision to revolutionize online shopping, fastapi_comm has grown from a small startup 
                    into a trusted e-commerce platform serving thousands of customers worldwide.
                  </p>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    We believe that shopping online should be effortless, secure, and enjoyable. That's why we've built 
                    a platform that combines cutting-edge technology with exceptional customer service.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our mission is to connect buyers with quality products from trusted sellers, creating a seamless 
                    shopping experience that you can rely on.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="h-32 w-32 text-white opacity-50" />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30"></div>
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-blue-500/10">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                  Our Impact
                </h2>
                <p className="text-lg text-muted-foreground">
                  Numbers that speak for themselves
                </p>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-2xl transition-all duration-300 text-center">
                        <CardContent className="p-6">
                          <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                            className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent"
                          >
                            {stat.value}
                          </motion.div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                  Why Choose Us
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need for a great shopping experience
                </p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-2xl transition-all duration-300 h-full group">
                        <CardContent className="p-6">
                          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
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
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-blue-500/10">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                  Our Values
                </h2>
                <p className="text-lg text-muted-foreground">
                  The principles that guide everything we do
                </p>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="shadow-lg border-border hover:shadow-2xl transition-all duration-300 h-full text-center">
                        <CardContent className="p-8">
                          <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                              <Icon className="h-10 w-10 text-white" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-semibold mb-4">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 p-12 md:p-16 text-center"
              >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                  >
                    Ready to Start Shopping?
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                  >
                    Explore our wide selection of quality products and discover amazing deals today.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button asChild size="lg" variant="secondary" className="shadow-lg">
                      <Link href="/products">
                        Browse Products
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-lg">
                      <Link href="/categories">
                        View Categories
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

