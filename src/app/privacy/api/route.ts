import { NextResponse } from 'next/server'

export interface PrivacyPolicyData {
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

const privacyPolicyData: PrivacyPolicyData = {
  title: "Privacy Policy",
  lastUpdated: "February 2, 2025",
  introduction: "At fastapi_comm, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
  sections: [
    {
      title: "Information We Collect",
      content: [
        "We collect information that you provide directly to us, including your name, email address, phone number, shipping address, and payment information when you create an account, make a purchase, or contact us.",
        "We automatically collect certain information about your device when you access our website, including your IP address, browser type, operating system, and browsing behavior.",
        "We use cookies and similar tracking technologies to track activity on our website and hold certain information."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders and transactions.",
        "To communicate with you about your orders, products, services, and promotional offers.",
        "To improve and personalize your experience on our website.",
        "To detect, prevent, and address technical issues and fraudulent activity.",
        "To comply with legal obligations and enforce our terms and conditions."
      ]
    },
    {
      title: "Information Sharing and Disclosure",
      content: [
        "We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.",
        "We may disclose your information if required by law or in response to valid requests by public authorities.",
        "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        "However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information at any time.",
        "You can opt-out of receiving promotional communications from us by following the unsubscribe instructions in those emails.",
        "You may disable cookies through your browser settings, though this may affect the functionality of our website."
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
      ]
    },
    {
      title: "Changes to This Privacy Policy",
      content: [
        "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date.",
        "You are advised to review this Privacy Policy periodically for any changes."
      ]
    }
  ],
  contact: {
    email: "privacy@fastapi_comm.com",
    description: "If you have any questions about this Privacy Policy, please contact us at"
  }
}

export async function GET() {
  try {
    return NextResponse.json(privacyPolicyData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching privacy policy data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy data' },
      { status: 500 }
    )
  }
}

