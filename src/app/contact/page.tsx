"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  Send,
  CheckCircle2
} from "lucide-react"

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/Fastkart",
    color: "from-blue-600 to-blue-700"
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/Fastkart",
    color: "from-sky-500 to-sky-600"
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/Fastkart",
    color: "from-pink-500 via-purple-500 to-orange-500"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/company/Fastkart",
    color: "from-blue-700 to-blue-800"
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@Fastkart",
    color: "from-red-600 to-red-700"
  }
]

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    content: "support@Fastkart.com",
    link: "mailto:support@Fastkart.com",
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567",
    link: "tel:+15551234567",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: MapPin,
    title: "Address",
    content: "123 Commerce Street, Business City, BC 12345",
    link: "#",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: "Mon - Fri: 9:00 AM - 6:00 PM",
    link: "#",
    color: "from-orange-500 to-red-600"
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call - in future, this will call the contact API
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent"
                >
                  Get in Touch
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
                >
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </motion.p>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 pb-20">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Information Cards */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon
                      return (
                        <motion.div
                          key={info.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className="shadow-lg border-border hover:shadow-2xl transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} shrink-0`}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold mb-1">{info.title}</h3>
                                  {info.link !== "#" ? (
                                    <a 
                                      href={info.link}
                                      className="text-muted-foreground hover:text-primary transition-colors break-all"
                                    >
                                      {info.content}
                                    </a>
                                  ) : (
                                    <p className="text-muted-foreground">{info.content}</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Social Media Links */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl bg-gradient-to-br ${social.color} text-white shadow-lg hover:shadow-2xl transition-all duration-300`}
                          aria-label={social.name}
                        >
                          <Icon className="h-6 w-6" />
                        </motion.a>
                      )
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Contact Form and Chatbot */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Card className="shadow-lg border-border">
                    <CardHeader>
                      <CardTitle className="text-3xl">Send us a Message</CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll get back to you as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12"
                        >
                          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                          <p className="text-muted-foreground">
                            Thank you for contacting us. We'll get back to you soon.
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                disabled={isSubmitting}
                                className="shadow-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                disabled={isSubmitting}
                                className="shadow-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">
                              Subject <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="subject"
                              name="subject"
                              type="text"
                              required
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="What's this about?"
                              disabled={isSubmitting}
                              className="shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">
                              Message <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                              id="message"
                              name="message"
                              required
                              rows={6}
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Tell us more about your inquiry..."
                              disabled={isSubmitting}
                              className="shadow-sm resize-none"
                            />
                          </div>
                          <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full shadow-lg bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-600 hover:via-indigo-600 hover:to-blue-600 text-white"
                          >
                            {isSubmitting ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Chatbot Placeholder */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card className="shadow-lg border-border bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-blue-500/10">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">AI Chatbot</CardTitle>
                          <CardDescription>
                            Coming soon - Get instant answers to your questions
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-8 border-2 border-dashed border-muted-foreground/30">
                        <div className="text-center space-y-4">
                          <div className="inline-flex p-4 rounded-full bg-muted">
                            <MessageSquare className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Chatbot Coming Soon</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                              Our AI-powered chatbot will be available here soon to help you with instant answers, 
                              product recommendations, and 24/7 customer support.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center mt-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              AI-Powered
                            </span>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              24/7 Available
                            </span>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              Instant Responses
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  )
}

