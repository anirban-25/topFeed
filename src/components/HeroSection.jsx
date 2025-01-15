"use client";
import React, { useEffect }  from "react";
import { PiStarFourFill } from "react-icons/pi";
import Link from "next/link";
import Image from "next/image";
const HeroSection = () => {
  useEffect(() => {
    // Load the chatbot script dynamically
    const script = document.createElement("script");
    script.src = "https://chatclient.ai/api/embed";
    script.defer = true;
    script.id = "chatbot-widget-script";

    // Add chatbot config to the window object
    window.chatBotConfig = {
      chatbotId: "fac36407-8109-4d3a-9628-e5c3402f0742",
    };

    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className=" relative">
      <div id="chatbot-container"></div>
      <h1 className="flex text-2xl md:text-6xl text-center justify-center font-kumbh-sans-bold mt-10 text-white ">
        <div className="">
          <span>All The </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #FFFFFF 0%, #55A3F8 18.22%, #7567D9 40.94%)",
            }}
          >
            Trending Topics&nbsp;
          </span>
          <span>in One Place</span>
        </div>
      </h1>
      <div className="flex justify-center items-center mt-3 text-sm text-center">
        <h3 className="text-xs md:max-w-[42rem] md:text-base text-[#E6E6E6]">
          TopFeed AI allows you to summarize the latest Reddit discussion and
          provide the latest Tweets from X which is really ‘relevant’ to you.
        </h3>
      </div>
      
      <div className="flex justify-center mt-16 space-x-4">
        <Link href="/login">
          <button className="bg-[#146EF5] text-white text-sm px-3 md:px-6 py-2 rounded-md">
            Get Started
          </button>
        </Link>
      </div>
      <div className="text-center text-[#8D8D8D] text-xs md:text-sm mt-4 flex justify-center space-x-3 items-center">
        No credit card required &nbsp;
        <span>
          <PiStarFourFill color="white" />
        </span>
        &nbsp;FREE 14-day trial
      </div>
      <div className=" w-full h-full mx-auto flex justify-center mt-10">
        <Image src="/images/mainSection(1).png" height={1300} width={1300} />
      </div>

      <div className="">
        <Image
          src="/images/globe.png"
          className="w-28 md:w-44 -z-10 absolute -bottom-20 overflow-x-hidden -right-4 md:-right-20"
          height={250}
          width={250}
        />
      </div>
      <div className="">
        <Image
          src="/images/globeL.png"
          className="w-28 md:w-44 absolute -z-10 -bottom-28 -left-4  md:-left-20"
          height={250}
          width={250}
        />
      </div>
    </div>
  );
};

export default HeroSection;
