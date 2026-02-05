import { NextResponse } from 'next/server'

export interface TermsOfServiceData {
  title: string
  lastUpdated: string
  introduction: string
  sections: {
    title: string
    content: string[]
  }[]
  contact: {
    email: string
    description: string
  }
}

const termsOfServiceData: TermsOfServiceData = {
  title: "Terms of Service",
  lastUpdated: "February 2, 2025",
  introduction: "Welcome to Fastkart. These Terms of Service govern your access to and use of our website and services. By accessing or using our services, you agree to be bound by these terms.",
  sections: [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Fastkart, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service."
      ]
    },
    {
      title: "Use License",
      content: [
        "Permission is granted to temporarily access the materials on Fastkart's website for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the website; or remove any copyright or other proprietary notations from the materials."
      ]
    },
    {
      title: "User Accounts",
      content: [
        "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.",
        "You agree to accept responsibility for all activities that occur under your account or password.",
        "We reserve the right to refuse service, terminate accounts, or remove or edit content at our sole discretion."
      ]
    },
    {
      title: "Products and Services",
      content: [
        "We reserve the right to limit the quantities of any products or services that we offer.",
        "All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion.",
        "We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations."
      ]
    },
    {
      title: "Payment Terms",
      content: [
        "All prices are in the currency specified on the website and are subject to change without notice.",
        "Payment must be received by us before we accept an order.",
        "We reserve the right to refuse or cancel any order at any time for reasons including but not limited to product availability, errors in pricing, or suspected fraudulent activity."
      ]
    },
    {
      title: "Prohibited Uses",
      content: [
        "You may not use our service: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information; or to upload or transmit viruses or any other type of malicious code."
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "The service and its original content, features, and functionality are and will remain the exclusive property of Fastkart and its licensors.",
        "The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "In no event shall Fastkart, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service."
      ]
    },
    {
      title: "Termination",
      content: [
        "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
        "If you wish to terminate your account, you may simply discontinue using the service."
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These Terms shall be interpreted and governed by the laws of the jurisdiction in which Fastkart operates, without regard to its conflict of law provisions.",
        "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
      ]
    }
  ],
  contact: {
    email: "legal@Fastkart.com",
    description: "If you have any questions about these Terms of Service, please contact us at"
  }
}

export async function GET() {
  try {
    return NextResponse.json(termsOfServiceData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching terms of service data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch terms of service data' },
      { status: 500 }
    )
  }
}

