"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { XCircle, Home, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PaymentFailedPage() {
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
              className="absolute inset-0 -z-10 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-pink-500/20 rounded-full blur-3xl"
            />

            <Card className="relative border-2 border-destructive/20 shadow-2xl overflow-hidden">
              {/* Decorative Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-destructive/10 pointer-events-none" />
              
              <CardContent className="p-8 md:p-12 text-center space-y-8 relative">
                {/* Failed Icon with Animation */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
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
                      className="absolute inset-0 rounded-full bg-destructive/30"
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
                      className="absolute inset-0 rounded-full bg-destructive/20"
                    />
                    
                    {/* Main Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative bg-destructive/10 rounded-full p-6"
                    >
                      <XCircle className="h-20 w-20 md:h-24 md:w-24 text-destructive" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Floating Alert Icons */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute"
                    style={{
                      left: `${15 + i * 20}%`,
                      top: `${25 + (i % 2) * 30}%`,
                    }}
                  >
                    <AlertTriangle className="h-5 w-5 text-destructive/60" />
                  </motion.div>
                ))}

                {/* Failure Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Payment Failed
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Unfortunately, your payment could not be processed. This could be due to insufficient funds, incorrect card details, or a network issue.
                  </p>
                </motion.div>

                {/* Error Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Card className="bg-secondary/50 border-destructive/20">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div className="text-left space-y-2">
                          <p className="font-semibold text-foreground">What went wrong?</p>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Insufficient funds in your account</li>
                            <li>Incorrect card information</li>
                            <li>Network connectivity issues</li>
                            <li>Card expired or blocked</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-destructive/20">
                        <p className="text-sm text-muted-foreground">
                          Don't worry, your items are still in your cart. Please try again or contact support if the issue persists.
                        </p>
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
                  <Button asChild size="lg" variant="destructive" className="group">
                    <Link href="/cart">
                      Try Again
                      <RefreshCw className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
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

