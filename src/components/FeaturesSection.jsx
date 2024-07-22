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
      <hr className="relative border-0 border-t border-solid border-[#B3B3B380] w-1568 h-0 m-0 p-0"></hr>
      <div className="flex justify-between items-center mb-10 mt-10">
        <Image
          src="/images/proofsection.svg"
          width={1700}
          height={1500}
          alt="social proof section"
          className="rounded-lg"
        />
      </div>

      <hr className="relative border-0 border-t border-solid border-[#B3B3B380] w-1568 h-0 m-0 p-0 mb-10"></hr>

      <div className="text-center mb-10 mt-32">
        <div className="text-[#8D8D8D] text-sm mb-5 tracking-widest">
          A COMPLETE NEWS GUIDE PLATFORM
        </div>
        <h2 className="text-4xl font-bold mb-2 relative">
          Follow all your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">
            favorite news
          </span>
        </h2>
        <h2 className="text-4xl font-bold">in one place</h2>
      </div>
      <div className="px-20">
        <div className="flex justify-between space-x-32 items-center mb-10 mt-10">
          <div className="relative w-1/2">
            <div className="relative p-4 bg-gray-800 rounded-lg">
              <Image
                src="/images/followimage.png"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className="rounded-lg filter grayscale"
              />
            </div>
          </div>

          <div className="ml-10 text-lg">
            <div className="flex items-center mb-4">
              <FaClock className="text-blue-500 mr-2" size={24} />
              <h3 className="text-3xl font-bold">Real-Time Updates</h3>
            </div>
            <p className="mb-4">
              Stay informed with instant updates on the latest news and trends.
            </p>
            <ul className="list-none">
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Unlimited blog sites
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Custom domain for each site
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Analytics for each site
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Pricing based on page views
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center mb-10 space-x-32 mt-10">
          <div className="ml-10 text-lg">
            <div className="flex items-center mb-4">
              <FaClock className="text-blue-500 mr-2" size={24} />
              <h3 className="text-3xl font-bold">Real-Time Updates</h3>
            </div>
            <p className="mb-4">
              Stay informed with instant updates on the latest news and trends.
            </p>
            <ul className="list-none">
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Unlimited blog sites
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Custom domain for each site
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Analytics for each site
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Pricing based on page views
              </li>
            </ul>
          </div>
          <div className="relative w-1/2">
            <div className="relative p-4 bg-gray-800 rounded-lg">
              <Image
                src="/images/followimage.png"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className="rounded-lg filter grayscale"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center space-x-32 mb-10 mt-10">
          <div className="relative w-1/2">
            <div className="relative p-4 bg-gray-800 rounded-lg">
              <Image
                src="/images/followimage.png"
                width={650}
                height={450}
                alt="Real-Time Updates"
                className="rounded-lg filter grayscale"
              />
            </div>
          </div>

          <div className="ml-10 text-lg">
            <div className="flex items-center mb-4">
              <FaClock className="text-blue-500 mr-2" size={24} />
              <h3 className="text-3xl font-bold">Real-Time Updates</h3>
            </div>
            <p className="mb-4">
              Stay informed with instant updates on the latest news and trends.
            </p>
            <ul className="list-none">
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Unlimited blog sites
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Custom domain for each site
              </li>
              <li className="flex items-center mb-2">
                <GiCheckMark className="text-blue-500 mr-2" size={20} />
                Analytics for each site
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
        <div className="text-[#8D8D8D] text-sm mb-5 tracking-widest">
          HOW IT WORKS
        </div>
        <h3 className="text-4xl font-bold mb-2 relative">
          Launch your feed in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">
            4 easy steps
          </span>
        </h3>

        <p className="mb-4 ">
          From easy-to-manage Topfeed pages, to a professional, SEO-optimized
          news in 4 simple steps
        </p>
      </div>

      <div className="mt-12 ">
        <div className="flex justify-around text-white p-8 items-center ">
          <div className="text-left ">
            <div className="relative">
              <Image
                src="/images/step-1.svg"
                alt="Set Preferences"
                width={64}
                height={64}
                className="relative  z-10"
              />
              <div className="z-0 absolute left-0 right-0 h-px bg-[#4D4D4D] top-1/2 transform -translate-y-1/2"></div>
            </div>
            <div className="mt-4 text-[#8D8D8D]">01</div>
            <h2 className="text-lg mt-2 font-bold">Set Preferences</h2>
            <p className="mt-2 text-sm text-[#8D8D8D]">
              Customize your dashboard and notification settings to receive
              updates that are most relevant to you.
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
            <h2 className="text-lg mt-2 font-bold">Personalize feed</h2>
            <p className="mt-2 text-[#8D8D8D] text-sm">
              Use category filters and tags to browse specific topics or find
              articles related to particular subjects.
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
            <h2 className="text-lg mt-2 font-bold">Interact</h2>
            <p className="mt-2 text-sm text-[#8D8D8D]">
              Like, comment, and share articles. Participate in discussions and
              engage with other users to gain different perspectives.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 mb-32">
        <Testimonials />
      </div>
      <div className=" flex justify-center mb-20 mt-12">
        <div className="w-[50rem] text-center">
          <div className="text-sm mb-5 text-[#8D8D8D]">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <div className="text-3xl font-semibold ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#55A3F8]  to-[#7567D9]">
              Everything
            </span>{" "}
            you need to know about our product
          </div>
        </div>
      </div>
      <div className="px-20">
        <Faqs />
      </div>
      <div className="mt-20">
        <Banner />
      </div>
    </div>
  );
};

export default FeaturesSection;
