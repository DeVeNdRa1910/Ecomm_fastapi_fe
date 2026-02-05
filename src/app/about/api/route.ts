import { NextResponse } from 'next/server'

export interface AboutPageData {
  hero: {
    title: string
    subtitle: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  stats: {
    value: string
    label: string
    icon: string
  }[]
  features: {
    title: string
    description: string
    icon: string
    color: string
  }[]
  values: {
    title: string
    description: string
    icon: string
  }[]
  cta: {
    title: string
    description: string
    primaryButton: {
      text: string
      link: string
    }
    secondaryButton: {
      text: string
      link: string
    }
  }
}

// Static data - can be replaced with database queries later
const aboutData: AboutPageData = {
  hero: {
    title: "About Fastkart",
    subtitle: "Your trusted e-commerce platform for quality products and exceptional service. We're committed to making online shopping simple, secure, and enjoyable."
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Founded with a vision to revolutionize online shopping, Fastkart has grown from a small startup into a trusted e-commerce platform serving thousands of customers worldwide.",
      "We believe that shopping online should be effortless, secure, and enjoyable. That's why we've built a platform that combines cutting-edge technology with exceptional customer service.",
      "Our mission is to connect buyers with quality products from trusted sellers, creating a seamless shopping experience that you can rely on."
    ]
  },
  stats: [
    { value: "10K+", label: "Happy Customers", icon: "Users" },
    { value: "50K+", label: "Products Available", icon: "ShoppingBag" },
    { value: "500+", label: "Trusted Sellers", icon: "Shield" },
    { value: "99%", label: "Satisfaction Rate", icon: "Heart" }
  ],
  features: [
    {
      title: "Wide Selection",
      description: "Browse through thousands of quality products from trusted sellers",
      icon: "ShoppingBag",
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Secure Shopping",
      description: "Your transactions are protected with industry-leading security",
      icon: "Shield",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Fast Delivery",
      description: "Quick and reliable shipping to get your products to you fast",
      icon: "Truck",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "24/7 Support",
      description: "Our customer service team is always here to help you",
      icon: "Headphones",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Quality Guaranteed",
      description: "We ensure all products meet our high quality standards",
      icon: "Award",
      color: "from-yellow-500 to-amber-600"
    },
    {
      title: "Best Prices",
      description: "Competitive pricing with regular deals and discounts",
      icon: "TrendingUp",
      color: "from-pink-500 to-rose-600"
    }
  ],
  values: [
    {
      title: "Customer First",
      description: "Your satisfaction is our top priority. We go above and beyond to ensure you have the best shopping experience.",
      icon: "Heart"
    },
    {
      title: "Innovation",
      description: "We continuously improve our platform with the latest technology to make shopping easier and more enjoyable.",
      icon: "Zap"
    },
    {
      title: "Global Reach",
      description: "Connecting buyers and sellers from around the world, making commerce accessible to everyone.",
      icon: "Globe"
    }
  ],
  cta: {
    title: "Ready to Start Shopping?",
    description: "Explore our wide selection of quality products and discover amazing deals today.",
    primaryButton: {
      text: "Browse Products",
      link: "/products"
    },
    secondaryButton: {
      text: "View Categories",
      link: "/categories"
    }
  }
}

export async function GET() {
  try {
    // In the future, you can fetch from database here
    // const aboutData = await db.about.findFirst()
    
    return NextResponse.json(aboutData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching about page data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about page data' },
      { status: 500 }
    )
  }
}

