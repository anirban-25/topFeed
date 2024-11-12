"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import PricingTier from "@/pricingComponents/PricingTier";
import Footer from "@/components/Footer";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/firebase";
import { Switch } from 'antd';


const Page = () => {
  
  const [user, setUser] = useState<User | null>(null);  // Type User | null
  
  const auth = getAuth(app);

  const [clicked, setClicked] = useState(true);
  const onChange = () => {
    setClicked(!clicked);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  // Use user?.uid and user?.email to safely access these properties
  const userId = user?.uid;
  const userEmail = user?.email;

  const tiers = [
    {
      name: "Starter",
      monthlyPrice: 59,
      yearlyPrice: 588,
      popular: false,
      features: [
        "20 Instant Reddit Feed Refreshes/month",
        "Add 5 Twitter Accounts",
        "30 mins Twitter Autorefresh",
        "Email Notifications",
        "Basic Analytics",
      ],
      lemonSqueezyMonthlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/a54ebde8-f028-45c2-a293-26714a5b7019?media=0&discount=0&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`,
      lemonSqueezyYearlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/2c1bc123-9fe6-47f3-95ea-c9bafe7a25a3?media=0&discount=0&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`,
    },
    {
      name: "Growth",
      monthlyPrice: 99,
      yearlyPrice: 1068,
      popular: true,
      features: [
        "50 Instant Reddit Feed Refreshes/month",
        "Add 7 Twitter Accounts",
        "15 mins Twitter Autorefresh",
        "Email Notifications",
        "Advanced Analytics",
        "Priority Support",
      ],
      lemonSqueezyMonthlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/7dd2f8a0-34a3-4dab-ab3d-ca5de3c8dd20?media=0&discount=0&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`,
      lemonSqueezyYearlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/66d7da57-953d-437f-85b9-2e55a6722075?media=0&discount=0&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`,
    },
    {
      name: "Scale",
      monthlyPrice: 149,
      yearlyPrice: 1668,
      popular: false,
      features: [
        "80 Instant Reddit Feed Refreshes",    
        "Add 15 Twitter Accounts",
        "15 mins Twitter Autorefresh",
        "Email, Slack Notifications",
        "Telegram, WhatsApp Notifications",
        "Comprehensive Analytics",
      ],
      lemonSqueezyMonthlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/ba505bd4-e8c9-4d01-8216-044c15646e99?media=0&discount=0&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`,
      lemonSqueezyYearlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/2fe0fd80-da90-4d99-b2a7-d534f47c2954?media=0&discount=0&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`,
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
          className="mx-auto absolute left-0 -top-10"
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
          className="mx-auto absolute w-[234px] md:w-[800px] top-10 left-20 md:left-36 md:top-0"
        />
      </div>
      <div className="px-5 md:px-20">
        <Navbar />
      </div>
      <div className="mt-10 text-white px-3">
        <div className="text-center text-xl md:text-4xl font-kumbh-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFFFFF] via-[#55A3F8] to-[#7567D9]">
            Your gateway
          </span>{" "}
          to affordable AI news feed
        </div>
        <div className="text-center text-[#E6E6E6] text-xs md:text-base font-kumbh-sans-light mt-5">
          Whether you&apos;re just getting started or are a large enterprise, we
          have a plan for you.
        </div>
      </div>
      <div>
        <div className="flex justify-center mt-20 mb-5 font-kumbh-sans-light text-xs md:text-sm text-[#B5B5B5] space-x-3">
          <div>Pay Monthly</div>
          <Switch defaultChecked onChange={onChange} />
          <div>Pay Yearly</div>
        </div>
        <div className="flex items-center justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            {tiers.map((tier, index) => (
              <PricingTier
                key={index}
                name={tier.name}
                price={!clicked ? tier.monthlyPrice : (tier.yearlyPrice / 12)}
                yearlyPrice={clicked ? tier.yearlyPrice : 0}
                popular={tier.popular}
                features={tier.features}
                lemonSqueezyMonthlyUrl={tier.lemonSqueezyMonthlyUrl}
                lemonSqueezyYearlyUrl={tier.lemonSqueezyYearlyUrl}
                clicked={clicked}
                user={user}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="border-gradient-2 mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Page;