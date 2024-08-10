import React from "react";
import Image from "next/image";
import { FaClock, FaCheck } from "react-icons/fa";
import Faqs from "@/components/Faqs";
import Banner from "@/components/Banner";
import { GiCheckMark } from "react-icons/gi";
import Testimonials from "./Testimonials";
const FeaturesSection = () => {
  return (
    <div className="mt-20 text-white">
      

      <div className="text-center mb-10 mt-32">
        <div className="text-[#8D8D8D] text-xs md:text-sm mb-5 tracking-widest">
        MADE FOR MARKETERS AND CONTENT WRITERS
        </div>
        <h2 className="text-xl md:text-4xl font-bold mb-2 relative">
        Follow What People Are Talking About on 
          
        </h2>
        <h2 className="text-xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">Twitter & Reddit</h2>
      </div>
      <div className="md:px-20 mt-20">
        <div className="md:flex justify-between md:space-x-32 items-center mb-10 mt-10">
          <div className="relative md:w-1/2 mb-5 md:mb-0">
            <div className="relative flex justify-center rounded-lg">
              <Image
                src="/images/followimage.svg"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className=" w-72 md:w-full rounded-lg "
                unoptimized={true}
              />
            </div>
          </div>

          <div className="md:w-1/2 md:max-w-1/2   text-lg">
            <div className="flex items-center mb-4">
              <FaClock
                className="text-blue-500 mr-2 w-[19px] md:w-[24px]"
                size={24}
              />
              <h3 className="text-lg md:text-3xl font-bold ">
              Reddit TopSummarizer
              </h3>
            </div>
            <p className="mb-1 md:mb-4 text-base md:text-lg">This tool allows you to summarize discussions happening in your favorite subreddits and break them down into different topics.
            </p>
            <ul className="text-sm md:text-lg list-none">
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Find out what people are discussing
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Get ideas for the next articles
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Updated once per 24 hours
              </li>
            </ul>
          </div>
        </div>

        <div className="md:flex md:justify-between items-center md:mb-10  mt-10">
          <div className="block md:hidden relative mb-5 md:mb-0">
            <div className="relative flex justify-center  rounded-lg">
              <Image
                src="/images/followimage2.svg"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className="rounded-lg w-72 md:w-full"
                
              />
            </div>
          </div>
          <div className=" md:w-1/2 md:max-w-1/2 flex space-x-32">
            <div className=" text-lg">
              <div className="flex items-center mb-4">
                <FaClock
                  className="text-blue-500 mr-2 w-[19px] md:w-[24px]"
                  size={24}
                />
                <h3 className="text-lg md:text-3xl font-bold ">
                X TopFeed
                </h3>
              </div>
              <p className="mb-1 md:mb-4 text-base md:text-lg">
              This tool is great for getting tweets from your favorite X (Twitter) account in one single feed with a “relevancy” score to filter the best ones out of them.
              </p>
              <ul className="text-sm md:text-lg list-none">
                <li className="flex items-center mb-2">
                  <GiCheckMark className="text-blue-500 mr-2" size={20} />
                  Filter tweets with high to low relevancy
                </li>
                <li className="flex items-center mb-2">
                  <GiCheckMark className="text-blue-500 mr-2" size={20} />
                  Saves time to find the latest news
                </li>
                <li className="flex items-center mb-2">
                  <GiCheckMark className="text-blue-500 mr-2" size={20} />
                  Add up to 50 Twitter accounts
                </li>
                
              </ul>
            </div>
          </div>
          <div className="hidden md:block relative w-1/2">
            <div className="relative md:ml-10  rounded-lg">
              <Image
                src="/images/followimage2.svg"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className="rounded-lg "                
              />
            </div>
          </div>
        </div>

        <div className="md:flex justify-between md:space-x-32 items-center mb-10 mt-10">
          <div className="relative md:w-1/2 mb-5 md:mb-0">
            <div className="relative flex justify-center rounded-lg">
              <Image
                src="/images/followimage3.svg"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className="rounded-lg w-72 md:w-full"
                
              />
            </div>
          </div>

          <div className=" md:w-1/2 md:max-w-1/2 md:ml-10 text-lg">
            <div className="flex items-center mb-4">
              <FaClock
                className="text-blue-500 mr-2 w-[19px] md:w-[24px]"
                size={24}
              />
              <h3 className="text-lg md:text-3xl font-bold ">
              X TopNotifications
              </h3>
            </div>
            <p className="mb-1 md:mb-4 text-base md:text-lg">
            This tool sends you instant notifications about the latest tweets from your favorite X accounts, so you don&apos;t miss out on any of it.
            </p>
            <ul className="text-sm md:text-lg list-none">
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Connects with WhatsApp & Telegram
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Get notifications directly in your inbox
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                You don&apos;t have to scroll X all day
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Pricing based on page views
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mb-10 mt-24">
        <div className="text-[#8D8D8D] text-xs md:text-sm mb-5 tracking-widest">
          HOW IT WORKS
        </div>
        <h3 className="text-xl md:text-4xl font-bold mb-2 relative">
        Just do these&nbsp;
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">
          3 Steps
          </span>
        </h3>

        <p className="mb-4 text-sm md:text-base ">
        All our tools require 3 simple steps to follow, and when you do it, you will never be out of any trending news.
        </p>
      </div>

      <div className="mt-12 hidden md:flex justify-center">
        <div className=" w-4/5 flex justify-around text-white  ">
          <div className="text-left ">
            <div className="relative">
              <Image
                src="/images/step-1.svg"
                alt="Set Preferences"
                width={64}
                height={64}
                className="relative  z-10"
              />
              <div className="z-0 absolute left-0 right-0 h-px  bg-[#4D4D4D] top-1/2 transform -translate-y-1/2"></div>
            </div>
            <div className="mt-4 text-[#8D8D8D]">01</div>
            <h2 className="text-lg mt-2 font-bold">Personalize Feed</h2>
            <p className="mt-2 text-sm text-[#8D8D8D] max-w-64">Enter only the subreddits and X accounts you want to follow.
            </p>
          </div>
          <div className="text-left ml-5">
            <div className="relative">
              <Image
                src="/images/personalized_feed.svg"
                alt="Personalize Feed"
                width={64}
                height={64}
                className="relative z-10"
              />
              <div className="z-0 absolute left-0 right-0 h-px bg-[#4D4D4D] top-1/2 transform -translate-y-1/2"></div>
            </div>

            <div className="mt-4 text-[#8D8D8D]">02</div>
            <h2 className="text-lg mt-2 font-bold">Filter Content</h2>
            <p className="mt-2 text-[#8D8D8D] text-sm max-w-64">Tell us which topics you are looking to follow, and we will filter only the best news for you.
            </p>
          </div>
          <div className="text-left ml-5">
            <Image
              src="/images/chat.svg"
              alt="Interact"
              width={64}
              height={64}
            />

            <div className="mt-4 text-[#8D8D8D]">03</div>
            <h2 className="text-lg mt-2 font-bold">Set Preferences</h2>
            <p className="mt-2 text-sm text-[#8D8D8D] max-w-64">Tell us when and how you want to get notified to get the latest news from X and Reddit.
            </p>
          </div>
        </div>
      </div>
      <div className="md:hidden mt-12 flex justify-center">
        <div className="w-full space-y-7 text-white">
          <div className="items-center flex justify-between text-center relative">
            <div className="relative">
              <Image
                src="/images/step-1.svg"
                alt="Set Preferences"
                width={64}
                height={64}
                className="relative w-[54px] z-10 mb-3"
              />
            </div>
            <div>
              <div className="mt-4 text-sm text-[#8D8D8D]">01</div>
              <h2 className="text-base mt-2 font-bold">Set Preferences</h2>
              <p className="mt-2 text-xs text-[#8D8D8D] max-w-64">
                Customize your dashboard and notification settings to receive
              </p>
            </div>
            <div className="absolute left-[27px] top-[54px] w-[1px] h-[calc(100%+28px)] bg-gray-600 -z-10"></div>
          </div>
          <div className="items-center flex justify-between text-center relative">
            <div className="relative">
              <Image
                src="/images/personalized_feed.svg"
                alt="Personalize Feed"
                width={64}
                height={64}
                className="relative w-[54px] z-10"
              />
            </div>
            <div>
              <div className="mt-4 text-sm text-[#8D8D8D]">02</div>
              <h2 className="text-base mt-2 font-bold">Personalize feed</h2>
              <p className="mt-2 text-[#8D8D8D] text-xs max-w-64">
                Use category filters and tags to browse specific topics or find
              </p>
            </div>
            <div className="absolute left-[27px] top-[54px] w-[1px] h-[calc(100%+28px)] bg-gray-600 -z-10"></div>
          </div>
          <div className="items-center flex justify-between text-center">
            <Image
              src="/images/chat.svg"
              alt="Interact"
              width={64}
              height={64}
              className="relative w-[54px] z-10 mt-4"
            />
            <div>
              <div className="mt-4 text-sm text-[#8D8D8D]">03</div>
              <h2 className="mt-2 text-base font-bold">Interact</h2>
              <p className="mt-2 text-xs text-[#8D8D8D] max-w-64">
                Like, comment, and share articles. Participate in discussions
                and
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 mb-20 md:mb-32">
        <Testimonials />
      </div>
      <div className=" flex justify-center mb-20 mt-12">
        <div className="w-[50rem] text-center">
          <div className="text-xs md:text-sm mb-5 text-[#8D8D8D]">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <div className="text-xl md:text-3xl font-semibold ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#55A3F8]  to-[#7567D9]">
              Everything
            </span>{" "}
            you need to know about our TopFeed AI
          </div>
        </div>
      </div>
      <div className="md:px-20">
        <Faqs />
      </div>
      <div className="mt-10 md:mt-20">
        <Banner />
      </div>
    </div>
  );
};

export default FeaturesSection;
