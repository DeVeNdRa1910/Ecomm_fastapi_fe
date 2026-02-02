"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mail, Calendar } from "lucide-react"
import type { PrivacyPolicyData } from "./api/route"

export default function PrivacyPolicyPage() {
  const [data, setData] = useState<PrivacyPolicyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/privacy-policy/api')
        if (response.ok) {
          const policyData = await response.json()
          setData(policyData)
        }
      } catch (error) {
        console.error('Failed to fetch privacy policy data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fallback data
  const policyData = data || {
    title: "Privacy Policy",
    lastUpdated: "February 2, 2025",
    introduction: "At fastapi_comm, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
    sections: [],
    contact: {
      email: "privacy@fastapi_comm.com",
      description: "If you have any questions about this Privacy Policy, please contact us at"
    }
  }

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
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent"
                >
                  {policyData.title}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Last Updated: {policyData.lastUpdated}</span>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-12 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="shadow-lg border-border mb-8">
                  <CardContent className="p-8">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {policyData.introduction}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  {policyData.sections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="shadow-lg border-border">
                        <CardContent className="p-8">
                          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                            {section.title}
                          </h2>
                          <div className="space-y-4">
                            {section.content.map((paragraph, pIndex) => (
                              <p
                                key={pIndex}
                                className="text-muted-foreground leading-relaxed"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-12"
                >
                  <Card className="shadow-lg border-border bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-blue-500/10">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground mb-2">
                        {policyData.contact.description}
                      </p>
                      <a
                        href={`mailto:${policyData.contact.email}`}
                        className="text-xl font-semibold text-primary hover:underline"
                      >
                        {policyData.contact.email}
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

