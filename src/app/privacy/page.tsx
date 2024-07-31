"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Section {
  title: string;
  content: string;
}

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onClick,
}) => {
  return (
    <div className=" border-b border-gray-600 space-y-3 mb-10">
      
        <div className="flex items-center justify-between">
          <span className="text-lg font-kumbh-sans-semibold text-white">{title}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      <div className="px-6 pb-4">
        <p className="text-gray-400 font-kumbh-sans-medium preserve-whitespace">{content}</p>
      </div>
    </div>
  );
};

const Page = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const sections: Section[] = [
    {
      title: "Introduction",
      content:
        `TopFeed AI ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By accessing or using TopFeed AI, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the website or use our services.`,
    },
    {
      title: "Information We Collect",
      content: `We may collect and store the following types of information: 

  • Personal Information: When you register for an account, subscribe to our services, or contact us, we may collect personal information such as your name, email address, payment information, and other contact details.
  • Usage Data: We collect information about your interactions with our services, including the pages you visit, the links you click, and other actions you take.
  • Device Information: We may collect information about the device you use to access our services, including the hardware model, operating system, IP address, and browser type.
  • Cookies and Tracking Technologies: We use cookies and similar tracking technologies to collect and use personal information about you, including to serve interest-based advertising.`,
      
    
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect for various purposes, including to:

• Provide, operate, and maintain our services
• Improve, personalize, and expand our services
• Understand and analyze how you use our services
• Process your transactions and manage your subscriptions
• Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other 
 `
    },
    {
      title: "Sharing Your Information",
      content:
        `We may share your information in the following situations:

         • With Service Providers: We may share your information with third-party service providers to perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
         • For Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
         • With Your Consent: We may disclose your personal information for any other purpose with your consent.

        `,
    },
    {
      title: "Security of Your Information",
      content:
        "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
    },
    {
      title: "Your Data Protection Rights",
      content:
        `Depending on your location, you may have the following rights regarding your personal information:
        
• Access: You have the right to request copies of your personal information.
• Rectification: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
• Erasure: You have the right to request that we erase your personal information, under certain conditions.
• Restrict Processing: You have the right to request that we restrict the processing of your personal information, under certain conditions.
• Object to Processing: You have the right to object to our processing of your personal information, under certain conditions.
• Data Portability: You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.

If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at support@topfeed.ai.
`,
    },
    {
      title: "Children's Privacy",
      content:
        "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.",
    },
    {
      title: "Changes to This Privacy Policy", 
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
    },
    {
      title: "Contact Information",
      content:
        `If you have any questions about this Privacy Policy, please contact us:

TopFeed AI
5-E-120, Jai Narayan Colony
Bikaner, Rajasthan
India
Email: support@topfeed.ai

By using TopFeed AI, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
`,
    },
  ];
  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div>
      <div>
        <div className="relative w-full -z-10 flex justify-center items-center top-0 mx-auto">
          <Image
            src="/images/bg-pattern.svg"
            height={100}
            width={1200}
            alt="bg"
            className="mx-auto absolute top-0"
          />
          <Image
            src="/images/ellipse-1.svg"
            height={100}
            width={600}
            alt="bg"
            className="mx-auto absolute left-0 -top-10 "
          />
          <Image
            src="/images/ellipse-2.svg"
            height={100}
            width={500}
            alt="bg"
            className="mx-auto absolute left-0 top-0 blur-md"
          />
          <Image
            src="/images/circle.png"
            height={100}
            width={800}
            alt="bg"
            className="mx-auto absolute left-36 top-0 "
          />
        </div>
        <div className="px-20">
          <Navbar />
        </div>
      </div>

      {/* Privacy Policy Section */}
      <section className="py-16 px-4 md:px-20">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">
          Privacy Policy
        </h2>
        <p className="text-base  text-gray-400 mt-2 mb-6 text-center">
          Effective from July 28, 2024
        </p>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <AccordionItem
              key={index}
              title={section.title}
              content={section.content}
              isOpen={openSection === index}
              onClick={() => toggleSection(index)}
            />
          ))}
        </div>

        <p className="mt-20 text-sm text-gray-600 text-center">
          By using TopFeed AI, you acknowledge that you have read, understood,
          and agree to be bound by this Privacy Policy.
        </p>
      </section>
    </div>
  );
};

export default Page;
