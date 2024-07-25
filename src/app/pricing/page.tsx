"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";
import PricingTier from "@/pricingComponents/PricingTier";
import Footer from "@/components/Footer";

import { Switch } from 'antd';
const page = () => {
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };
  const tiers = [
    {
      name: "Starter",
      price: 39,
      yearlyPrice: 468,
      popular: false,
      features: [
        "1 chatbot",
        "Upto 4k messages per month",
        "Upto 200 training web pages",
        "10 file uploads",
        "Upto 10 MB per file",
      ],
    },
    {
      name: "Growth",
      price: 79,
      yearlyPrice: 948,
      popular: true,
      features: [
        "2 chatbots",
        "Upto 10k messages per month",
        "Upto 2,000 training web pages",
        "100 file uploads",
        "Upto 10 MB per file",
        "Unlimited integrations",
        "4 members",
        "API access",
      ],
    },
    {
      name: "Scale",
      price: 259,
      yearlyPrice: 3108,
      popular: false,
      features: [
        "5 chatbots",
        "Upto 40k messages per month",
        "Upto 10,000 training web pages",
        "500 file uploads",
        "Upto 10 MB per file",
        "Unlimited integrations",
        "10 members",
        "API access",
        "Webhook support",
      ],
    },
  ];
  return (
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
          className="mx-auto absolute w-[234px] md:w-[800px] top-10 left-20 md:left-36 md:top-0 "
        />
        
      </div>
      <div className="px-20">
        <Navbar />
      </div>
      <div className="mt-10 text-white">
        <div className=" text-center text-4xl font-kumbh-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFFFFF] via-[#55A3F8] to-[#7567D9]">
            Your gateway
          </span>{" "}
          to affordable AI news feed
        </div>
        <div className="text-center text-[#E6E6E6] font-kumbh-sans-light mt-5">
          Whether you're just getting started or are a large enterprise, we have
          a plan for you.
        </div>
      </div>
      <div>
        <div className="flex justify-center mt-20 mb-5 font-kumbh-sans-light text-sm text-[#B5B5B5] space-x-3">
          <div>Pay Monthly</div>
          <Switch defaultChecked onChange={onChange} />
          <div>Pay Yearly</div>

        </div>
        <div className="  flex items-center justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            {tiers.map((tier, index) => (
              <PricingTier key={index} {...tier} />
            ))}
          </div>
        </div>
      </div>
      <div className="border-gradient-2 ">
        <Footer />
      </div>
    </div>
  );
};

export default page;
