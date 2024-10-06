"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import PricingTier from "@/pricingComponents/PricingTier";
import Footer from "@/components/Footer";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/firebase";
import { Switch } from 'antd';
import { useRouter } from "next/navigation";

const Page = () => {
  const [user, setUser] = useState<User | null>(null);  // Type User | null
  const router = useRouter();
  const auth = getAuth(app);

  const [clicked, setClicked] = useState(true);
  const onChange = () => {
    setClicked(!clicked);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // Set the Firebase user when logged in
      } else {
        router.push("/login");  // Redirect to login if no user is found
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

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
        "2 Instant Reddit Feed Refreshes/month",
        "Follow 3 Twitter Accounts",
        "Email Notifications",
        "Basic Analytics",
      ],
      lemonSqueezyMonthlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/8413ab3b-25e5-4d3b-8a0e-8cdee7987c75?media=0&discount=0&checkout[email]=${userEmail}`,
      lemonSqueezyYearlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/454ef42c-8b02-4af4-96bc-35997e088994?media=0&discount=0&checkout[email]=${userEmail}`,
    },
    {
      name: "Growth",
      monthlyPrice: 99,
      yearlyPrice: 1068,
      popular: true,
      features: [
        "15 Instant Reddit Feed Refreshes/month",
        "Daily Automatic Feed Refresh for Reddit",
        "Follow 10 Twitter Accounts",
        "Email Notifications",
        "Advanced Analytics",
        "Priority Support",
      ],
      lemonSqueezyMonthlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/c9908381-4dac-4539-ae62-d6eadf10bddf?media=0&discount=0&checkout[email]=${userEmail}`,
      lemonSqueezyYearlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/74c9438d-2424-4e0e-920e-f29c5912852b?media=0&discount=0&checkout[email]=${userEmail}`,
    },
    {
      name: "Scale",
      monthlyPrice: 149,
      yearlyPrice: 1668,
      popular: false,
      features: [
        "30 Instant Reddit Feed Refreshes",
        "Daily Automatic Feed Refresh for Reddit",
        "Follow 20 Twitter Accounts",
        "Email Notifications, Slack",
        "Telegram, WhatsApp",
        "Comprehensive Analytics",
        "Dedicated Account Manager",
        "API access",
      ],
      lemonSqueezyMonthlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/e434c319-7b78-4449-8a5c-2514cc1832a6?media=0&discount=0&checkout[email]=${userEmail}`,
      lemonSqueezyYearlyUrl:
        `https://topfeed.lemonsqueezy.com/buy/5e76b568-a6df-4404-af3d-da5137f029aa?media=0&discount=0&checkout[email]=${userEmail}`,
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
