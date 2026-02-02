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
    examples?: string[]
  }[]
  contact: {
    email: string
    description: string
  }
}

const cookiePolicyData: CookiePolicyData = {
  title: "Cookie Policy",
  lastUpdated: "February 2, 2025",
  introduction: "This Cookie Policy explains how fastapi_comm ('we', 'us', or 'our') uses cookies and similar technologies to recognize you when you visit our website at fastapi_comm.com. It explains what these technologies are and why we use them, as well as your rights to control our use of them. In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.",
  sections: [
    {
      title: "1. What Are Cookies",
      content: [
        "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.",
        "Cookies set by the website owner (in this case, fastapi_comm) are called 'first-party cookies'. Cookies set by parties other than the website owner are called 'third-party cookies'. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).",
        "The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites. We use both first-party and third-party cookies for several reasons.",
        "Cookies can be 'persistent' or 'session' cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser."
      ]
    },
    {
      title: "2. Why We Use Cookies",
      content: [
        "We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as 'essential' or 'strictly necessary' cookies.",
        "Other cookies enable us to track and target the interests of our users and to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes. This is described in more detail below.",
        "The specific types of first and third-party cookies served through our website and the purposes they perform are described in the table below. Please note that the specific cookies served may vary depending on the specific online properties you visit."
      ]
    },
    {
      title: "3. Types of Cookies We Use",
      content: [
        "We use different types of cookies for different purposes. Essential cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.",
        "Performance cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
        "Functionality cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
        "Targeting cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device."
      ]
    },
    {
      title: "4. Third-Party Cookies",
      content: [
        "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on. These third-party cookies are used to provide us with analytics and advertising services.",
        "We use Google Analytics to help us understand how our customers use the site. You can read more about how Google uses your personal information here: https://www.google.com/intl/en/policies/privacy/. You can also opt-out of Google Analytics here: https://tools.google.com/dlpage/gaoptout.",
        "We may use Facebook Pixel and other advertising cookies to deliver advertisements, to make them more relevant and meaningful to consumers, and to track the efficiency of our advertising campaigns. These cookies may track your browsing habits and allow us to show you advertising while you are browsing other websites.",
        "We do not control these third-party cookies. If you would like to learn more about this practice or know your choices about not having this information used by these companies, please visit the Network Advertising Initiative or the Digital Advertising Alliance."
      ]
    },
    {
      title: "5. How to Control Cookies",
      content: [
        "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser settings. Most web browsers allow some control of most cookies through the browser settings.",
        "To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org. To opt out of being tracked by Google Analytics across all websites, visit http://tools.google.com/dlpage/gaoptout.",
        "Please note that if you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.",
        "In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit http://www.aboutads.info/choices/ or http://www.youronlinechoices.com."
      ]
    },
    {
      title: "6. Mobile Device Identifiers",
      content: [
        "We may use mobile device identifiers (such as Apple's Identifier for Advertising (IDFA) or Google's Advertising ID) to help us deliver personalized ads and measure the effectiveness of our advertising campaigns.",
        "You can opt out of personalized advertising on mobile devices by adjusting your device settings. For iOS devices, go to Settings > Privacy > Advertising and enable 'Limit Ad Tracking'. For Android devices, go to Google Settings > Ads and enable 'Opt out of Ads Personalization'."
      ]
    },
    {
      title: "7. Do Not Track Signals",
      content: [
        "Some browsers include a 'Do Not Track' (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. As a result, many websites, including ours, do not currently respond to DNT signals.",
        "We will continue to monitor developments around DNT browser technology and the implementation of a standard."
      ]
    },
    {
      title: "8. Updates to This Cookie Policy",
      content: [
        "We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.",
        "The date at the top of this Cookie Policy indicates when it was last updated. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the 'Last Updated' date.",
        "Your continued use of our website after any changes to this Cookie Policy will constitute your acceptance of such changes."
      ]
    },
    {
      title: "9. More Information",
      content: [
        "If you would like more information about cookies and how they are used, you can visit the following websites:",
        "• All About Cookies: http://www.allaboutcookies.org",
        "• Network Advertising Initiative: http://www.networkadvertising.org",
        "• Digital Advertising Alliance: http://www.aboutads.info"
      ]
    }
  ],
  cookieTypes: [
    {
      name: "Essential Cookies",
      description: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.",
      purpose: "They enable core functionality such as security, network management, and accessibility. Without these cookies, services you have asked for cannot be provided.",
      examples: ["Session management", "Security authentication", "Load balancing", "Shopping cart functionality"]
    },
    {
      name: "Performance Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
      purpose: "They help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.",
      examples: ["Page views", "Time spent on pages", "Error messages", "Traffic sources"]
    },
    {
      name: "Functionality Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      purpose: "They remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.",
      examples: ["Language preferences", "Region selection", "User interface customization", "Remembered login information"]
    },
    {
      name: "Targeting/Advertising Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
      purpose: "They do not store directly personal information, but are based on uniquely identifying your browser and internet device. They help us deliver relevant advertising and measure campaign effectiveness.",
      examples: ["Interest-based advertising", "Campaign tracking", "Conversion tracking", "Retargeting"]
    },
    {
      name: "Social Media Cookies",
      description: "These cookies are set by social media services that we have added to our site to enable you to share our content with your friends and networks.",
      purpose: "They are capable of tracking your browser across other sites and building up a profile of your interests. This may impact the content and messages you see on other websites you visit.",
      examples: ["Facebook sharing", "Twitter integration", "LinkedIn sharing", "Social login"]
    }
  ],
  contact: {
    email: "privacy@fastapi_comm.com",
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

