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
        <p className="text-gray-400 font-kumbh-sans-medium">{content}</p>
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
        "TopFeed AI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
    },
    {
      title: "Information We Collect",
      content:
        "We collect personal information, usage data, device information, and use cookies and tracking technologies.",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use your information to provide and improve our services, process transactions, communicate with you, and prevent fraud.",
    },
    {
      title: "Sharing Your Information",
      content:
        "We may share your information with service providers, for business transfers, and with your consent.",
    },
    {
      title: "Security of Your Information",
      content:
        "We use administrative, technical, and physical security measures to protect your personal information.",
    },
    {
      title: "Your Data Protection Rights",
      content:
        "Depending on your location, you may have rights to access, rectify, erase, restrict processing, object to processing, and request data portability.",
    },
    {
      title: "Children's Privacy",
      content:
        "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.",
    },
    {
      title: "Changes to This Privacy Policy",
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
    },
    {
      title: "Contact Information",
      content:
        "For questions about this Privacy Policy, contact us at support@topfeed.ai.",
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
          Effective from August 28, 2024
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
