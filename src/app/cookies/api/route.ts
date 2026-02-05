import { NextResponse } from 'next/server'

export interface CookiePolicyData {
  title: string
  lastUpdated: string
  introduction: string
  sections: {
    title: string
    content: string[]
  }[]
  cookieTypes: {
    name: string
    description: string
    purpose: string
  }[]
  contact: {
    email: string
    description: string
  }
}

const cookiePolicyData: CookiePolicyData = {
  title: "Cookie Policy",
  lastUpdated: "February 2, 2025",
  introduction: "This Cookie Policy explains how Fastkart uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.",
  sections: [
    {
      title: "What Are Cookies",
      content: [
        "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.",
        "Cookies set by the website owner (in this case, Fastkart) are called 'first-party cookies'. Cookies set by parties other than the website owner are called 'third-party cookies'."
      ]
    },
    {
      title: "Why We Use Cookies",
      content: [
        "We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as 'essential' or 'strictly necessary' cookies.",
        "Other cookies enable us to track and target the interests of our users and to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes."
      ]
    },
    {
      title: "How to Control Cookies",
      content: [
        "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser settings.",
        "Please note that if you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.",
        "Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org."
      ]
    },
    {
      title: "Third-Party Cookies",
      content: [
        "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.",
        "These third-party cookies are used to provide us with analytics and advertising services. We do not control these third-party cookies."
      ]
    },
    {
      title: "Updates to This Policy",
      content: [
        "We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.",
        "Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies."
      ]
    }
  ],
  cookieTypes: [
    {
      name: "Essential Cookies",
      description: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features.",
      purpose: "They enable core functionality such as security, network management, and accessibility."
    },
    {
      name: "Performance Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
      purpose: "They help us understand how visitors interact with our website by collecting and reporting information anonymously."
    },
    {
      name: "Functionality Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization.",
      purpose: "They may be set by us or by third-party providers whose services we have added to our pages."
    },
    {
      name: "Targeting Cookies",
      description: "These cookies may be set through our site by our advertising partners.",
      purpose: "They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites."
    }
  ],
  contact: {
    email: "privacy@Fastkart.com",
    description: "If you have any questions about our use of cookies or other technologies, please contact us at"
  }
}

export async function GET() {
  try {
    return NextResponse.json(cookiePolicyData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching cookie policy data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cookie policy data' },
      { status: 500 }
    )
  }
}

