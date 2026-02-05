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
  introduction: "At Fastkart, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or make a purchase from us. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.",
  sections: [
    {
      title: "1. Information We Collect",
      content: [
        "We collect information that you provide directly to us when you create an account, make a purchase, subscribe to our newsletter, participate in surveys, contact customer support, or otherwise communicate with us. This may include your name, email address, phone number, postal address, payment information (credit card numbers, billing address), and any other information you choose to provide.",
        "When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site.",
        "We collect information using cookies, web beacons, pixel tags, and similar tracking technologies. Cookies are small data files stored on your device that help us improve our services and your experience, see which areas and features of our services are popular, and count visits.",
        "If you make a purchase or attempt to make a purchase through the site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as 'Order Information'."
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you, screen our orders for potential risk or fraud, and when in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.",
        "We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our site (for example, by generating analytics about how our customers browse and interact with the site, and to assess the success of our marketing and advertising campaigns).",
        "We use your personal information to send you marketing communications, if you have opted in to receive them. You can opt out of receiving marketing emails from us by clicking the unsubscribe link in the email or by contacting us directly.",
        "We use your information to provide, maintain, and improve our services, to process transactions, to send you technical notices, updates, security alerts, and support and administrative messages, and to respond to your comments, questions, and requests.",
        "We may use your information to personalize your experience, to provide targeted advertisements, and to measure the effectiveness of our advertising campaigns."
      ]
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: [
        "We do not sell, trade, or rent your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.",
        "We may share your information with payment processors, shipping companies, and other service providers necessary to fulfill your orders and provide our services. These third parties are contractually obligated to protect your information and use it only for the purposes for which it was disclosed.",
        "We may disclose your information if required by law or in response to valid requests by public authorities (e.g., a court or a government agency). We may also disclose your information when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.",
        "In the event of a merger, acquisition, reorganization, bankruptcy, or other sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.",
        "We may share aggregated, non-personally identifiable information with third parties for marketing, advertising, research, or similar purposes."
      ]
    },
    {
      title: "4. Data Security",
      content: [
        "We implement appropriate technical and organizational security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure socket layer (SSL) technology, firewalls, and regular security assessments.",
        "We use industry-standard security protocols to protect sensitive information, such as payment card data. All payment transactions are processed through secure payment gateways that comply with PCI DSS standards.",
        "However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. You are responsible for maintaining the confidentiality of your account password and for any activities that occur under your account.",
        "If we learn of a security breach, we will notify you and the relevant authorities as required by applicable law. We will make reasonable efforts to notify affected users within 72 hours of becoming aware of the breach."
      ]
    },
    {
      title: "5. Your Rights and Choices",
      content: [
        "You have the right to access, update, or delete your personal information at any time. You can do this by logging into your account settings or by contacting us directly. We will respond to your request within 30 days.",
        "You can opt-out of receiving promotional communications from us by following the unsubscribe instructions in those emails or by contacting us. Even if you opt out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations.",
        "You may have the right to request that we restrict the processing of your personal information, object to processing, or request data portability, depending on your jurisdiction.",
        "You may disable cookies through your browser settings. However, if you disable cookies, some features of our website may not function properly, and you may not be able to access certain areas of the site.",
        "If you are located in the European Economic Area (EEA) or the United Kingdom, you have certain data protection rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict processing, object to processing, and data portability."
      ]
    },
    {
      title: "6. Data Retention",
      content: [
        "We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.",
        "When you place an order through the site, we will maintain your Order Information for our records unless and until you ask us to delete this information. We may retain certain information for legitimate business purposes, such as preventing fraud and abuse, improving our services, complying with legal obligations, or resolving disputes.",
        "If you request deletion of your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or legitimate business purposes."
      ]
    },
    {
      title: "7. International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country.",
        "We ensure that appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy. When we transfer personal information from the EEA or UK to other countries, we use standard contractual clauses approved by the European Commission or other appropriate legal mechanisms.",
        "By using our services, you consent to the transfer of your information to countries outside your country of residence."
      ]
    },
    {
      title: "8. Children's Privacy",
      content: [
        "Our services are not intended for individuals under the age of 18 (or the age of majority in your jurisdiction). We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.",
        "If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to remove that information from our servers. If you believe we might have any information from or about a child, please contact us."
      ]
    },
    {
      title: "9. Third-Party Links and Services",
      content: [
        "Our website may contain links to third-party websites, applications, or services that are not owned or controlled by us. This Privacy Policy does not apply to such third-party services, and we are not responsible for the privacy practices of these third parties.",
        "We encourage you to review the privacy policies of any third-party services you access. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
        "We may use third-party services for analytics, advertising, payment processing, and other functions. These services may collect information about your use of our website and other websites to provide targeted advertising and analytics."
      ]
    },
    {
      title: "10. Changes to This Privacy Policy",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date.",
        "We may also notify you of significant changes via email or through a notice on our website. Your continued use of our services after such modifications constitutes your acknowledgment of the modified Privacy Policy and agreement to abide and be bound by the modified Privacy Policy.",
        "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
      ]
    },
    {
      title: "11. California Privacy Rights",
      content: [
        "If you are a California resident, you have certain rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete personal information we have collected, the right to opt-out of the sale of personal information (we do not sell personal information), and the right to non-discrimination for exercising your privacy rights.",
        "California residents may request, up to twice per year, information about the categories and specific pieces of personal information we have collected, the categories of sources from which we collected it, the business purposes for collecting it, and the categories of third parties with whom we share it.",
        "To exercise your California privacy rights, please contact us using the information provided in the Contact section below."
      ]
    }
  ],
  contact: {
    email: "privacy@Fastkart.com",
    description: "If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at"
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

