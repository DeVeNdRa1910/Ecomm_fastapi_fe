"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, Home, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4" data-scroll-section>
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            {/* Animated Background Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 -z-10 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
            />

            <Card className="relative border-2 border-primary/20 shadow-2xl overflow-hidden">
              {/* Decorative Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
              
              <CardContent className="p-8 md:p-12 text-center space-y-8 relative">
                {/* Success Icon with Animation */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className="relative"
                  >
                    {/* Pulsing Ring */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full bg-primary/30"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                      className="absolute inset-0 rounded-full bg-primary/20"
                    />
                    
                    {/* Main Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative bg-primary/10 rounded-full p-6"
                    >
                      <CheckCircle2 className="h-20 w-20 md:h-24 md:w-24 text-primary" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Floating Sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 200 - 100,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-primary/60" />
                  </motion.div>
                ))}

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Payment Successful!
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Your payment has been processed successfully. Your order is being prepared and you'll receive a confirmation email shortly.
                  </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Card className="bg-secondary/50 border-primary/20">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Order Status</span>
                        <span className="font-semibold text-primary">Confirmed</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-semibold">Online Payment</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Delivery</span>
                        <span className="font-semibold">3-5 Business Days</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                >
                  <Button asChild size="lg" className="group">
                    <Link href="/products">
                      Continue Shopping
                      <ShoppingBag className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="group">
                    <Link href="/">
                      Back to Home
                      <Home className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

