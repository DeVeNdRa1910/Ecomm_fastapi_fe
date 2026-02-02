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
  introduction: "Welcome to fastapi_comm. These Terms of Service ('Terms') govern your access to and use of our website, mobile application, and services (collectively, the 'Service') operated by fastapi_comm ('us', 'we', or 'our'). Please read these Terms carefully before using our Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using fastapi_comm, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        "These Terms constitute a legally binding agreement between you and fastapi_comm. Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.",
        "We reserve the right to update, change, or replace any part of these Terms by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes."
      ]
    },
    {
      title: "2. Use License",
      content: [
        "Permission is granted to temporarily access the materials on fastapi_comm's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials;",
        "• Use the materials for any commercial purpose or for any public display (commercial or non-commercial);",
        "• Attempt to reverse engineer any software contained on the website;",
        "• Remove any copyright or other proprietary notations from the materials; or",
        "• Transfer the materials to another person or 'mirror' the materials on any other server.",
        "This license shall automatically terminate if you violate any of these restrictions and may be terminated by fastapi_comm at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format."
      ]
    },
    {
      title: "3. User Accounts and Registration",
      content: [
        "To access certain features of the Service, you may be required to create an account. When you create an account, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.",
        "You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions. You must immediately notify us of any unauthorized use of your account.",
        "We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion. We may suspend or terminate your account if you violate these Terms or engage in any fraudulent, abusive, or illegal activity.",
        "You may not use a false email address, impersonate any person or entity, or otherwise mislead as to the origin of any content. You may not use the Service to transmit any worms or viruses or any code of a destructive nature."
      ]
    },
    {
      title: "4. Products and Services",
      content: [
        "We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.",
        "We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.",
        "Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.",
        "We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service. Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.",
        "We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate."
      ]
    },
    {
      title: "5. Payment Terms",
      content: [
        "All prices are in the currency specified on the website and are subject to change without notice. Payment must be received by us before we accept an order. We accept various forms of payment, including credit cards, debit cards, and other payment methods as indicated on our website.",
        "You represent and warrant that you have the legal right to use any payment method you provide. By providing payment information, you authorize us to charge the payment method for all amounts due.",
        "We reserve the right to refuse or cancel any order at any time for reasons including but not limited to: product availability, errors in pricing, errors in product descriptions, suspected fraudulent activity, or violation of these Terms.",
        "If your payment method is declined, we may attempt to process the charge again. If payment cannot be processed, your order will be cancelled. You are responsible for any fees charged by your financial institution in connection with your use of the Service.",
        "All sales are final unless otherwise stated. Refunds, if applicable, will be processed according to our Refund Policy."
      ]
    },
    {
      title: "6. Shipping and Delivery",
      content: [
        "We will arrange for shipment of products to you. Shipping costs and delivery times will be calculated and displayed at checkout. We are not responsible for delays caused by shipping carriers or customs.",
        "Risk of loss and title for products purchased from us pass to you upon delivery of the products to the carrier. You are responsible for filing any claims with carriers for damaged or lost shipments.",
        "We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies, or errors in product or pricing information, or problems identified by our credit and fraud avoidance department.",
        "Estimated delivery times are provided for informational purposes only and are not guaranteed. We are not liable for any delays in delivery."
      ]
    },
    {
      title: "7. Returns and Refunds",
      content: [
        "Our Return Policy, which also governs your use of the Service, can be found on our website. By placing an order, you agree to our Return Policy.",
        "To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Some products may not be eligible for return due to their nature (e.g., digital products, perishable goods).",
        "To complete your return, we require a receipt or proof of purchase. Please do not send your purchase back to the manufacturer. Refunds, if applicable, will be processed to the original method of payment within a reasonable timeframe.",
        "We reserve the right to refuse returns that do not meet our return policy requirements."
      ]
    },
    {
      title: "8. Prohibited Uses",
      content: [
        "You may not use our service:",
        "• For any unlawful purpose or to solicit others to perform unlawful acts;",
        "• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances;",
        "• To infringe upon or violate our intellectual property rights or the intellectual property rights of others;",
        "• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;",
        "• To submit false or misleading information;",
        "• To upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet;",
        "• To collect or track the personal information of others;",
        "• To spam, phish, pharm, pretext, spider, crawl, or scrape;",
        "• For any obscene or immoral purpose; or",
        "• To interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet."
      ]
    },
    {
      title: "9. Intellectual Property",
      content: [
        "The Service and its original content, features, and functionality are and will remain the exclusive property of fastapi_comm and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.",
        "All content included on the site, such as text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of fastapi_comm or its content suppliers and is protected by international copyright laws.",
        "You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as follows:",
        "• Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials;",
        "• You may store files that are automatically cached by your web browser for display enhancement purposes;",
        "• You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution."
      ]
    },
    {
      title: "10. User Content",
      content: [
        "Our Service may allow you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material ('User Content'). You are responsible for User Content that you post to the Service, including its legality, reliability, and appropriateness.",
        "By posting User Content on or through the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such User Content on and through the Service. You retain any and all of your rights to any User Content you submit, post, or display on or through the Service.",
        "You represent and warrant that: (i) the User Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your User Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.",
        "We reserve the right to remove any User Content that violates these Terms or is otherwise objectionable in our sole discretion."
      ]
    },
    {
      title: "11. Disclaimer of Warranties",
      content: [
        "THE SERVICE IS PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS. FASTAPI_COMM AND ITS SUPPLIERS AND LICENSORS HEREBY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.",
        "We do not warrant that the Service will be available at any particular time or location, that any defects or errors will be corrected, or that the Service is free of viruses or other harmful components.",
        "We do not warrant, endorse, guarantee, or assume responsibility for any product or service advertised or offered by a third party through the Service or any hyperlinked website or service, and we will not be a party to or in any way monitor any transaction between you and third-party providers of products or services."
      ]
    },
    {
      title: "12. Limitation of Liability",
      content: [
        "IN NO EVENT SHALL FASTAPI_COMM, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.",
        "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRIOR TO THE ACTION GIVING RISE TO THE LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.",
        "Some jurisdictions do not allow the exclusion of certain warranties or the exclusion or limitation of liability for consequential or incidental damages, so the limitations above may not apply to you."
      ]
    },
    {
      title: "13. Indemnification",
      content: [
        "You agree to defend, indemnify, and hold harmless fastapi_comm and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:",
        "• Your use and access of the Service, by you or any person using your account and password;",
        "• Your violation of any term of these Terms;",
        "• Your violation of any third party right, including without limitation any copyright, property, or privacy right; or",
        "• Any claim that your User Content caused damage to a third party."
      ]
    },
    {
      title: "14. Termination",
      content: [
        "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
        "If you wish to terminate your account, you may simply discontinue using the Service or contact us to delete your account.",
        "All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
        "Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service."
      ]
    },
    {
      title: "15. Governing Law and Dispute Resolution",
      content: [
        "These Terms shall be interpreted and governed by the laws of the jurisdiction in which fastapi_comm operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.",
        "If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.",
        "Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the arbitration association in our jurisdiction, except where prohibited by law. You agree to waive any right to a jury trial and to participate in class action lawsuits."
      ]
    },
    {
      title: "16. Changes to Terms",
      content: [
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
        "By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service."
      ]
    },
    {
      title: "17. Contact Information",
      content: [
        "If you have any questions about these Terms of Service, please contact us through the contact information provided on our website or at the email address listed in the Contact section below."
      ]
    }
  ],
  contact: {
    email: "legal@fastapi_comm.com",
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

