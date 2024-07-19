import React from 'react';
import Image from 'next/image';
import { FaClock, FaCheck } from 'react-icons/fa';
import { GiCheckMark } from "react-icons/gi";


const FeaturesSection = () => {

  return (
    <div className="mt-20 text-white">
      <hr className="relative border-0 border-t border-solid border-[#B3B3B380] w-1568 h-0 m-0 p-0">
      </hr>
      <div className="flex justify-between items-center mb-10 mt-10">
        <Image 
          src="/images/proofsection.svg" 
          width={1700}
          height={1500}
          alt="social proof section"
          className="rounded-lg"
        />
      </div>

      <hr className="relative border-0 border-t border-solid border-[#B3B3B380] w-1568 h-0 m-0 p-0 mb-10">
      </hr>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 relative">
          Follow all your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">favorite news</span>
        </h2>
        <h2 className="text-4xl font-bold">in one place</h2>
      </div>

      <div className="flex justify-between items-center mb-10 mt-10">
        <div className="relative w-1/2">
          
          <div className="relative p-4 bg-gray-800 rounded-lg">
            <Image 
              src="/images/followimage.png" 
              width={650}
              height={450}
              alt="Real-Time Updates"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="ml-10 text-lg">
          <div className="flex items-center mb-4">
            <FaClock className="text-blue-500 mr-2" size={24} />
            <h3 className="text-3xl font-bold">Real-Time Updates</h3>
          </div>
          <p className="mb-4">Stay informed with instant updates on the latest news and trends.</p>
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

      <div className="flex justify-between items-center mb-10 mt-10">
        

        <div className="ml-10 text-lg">
          <div className="flex items-center mb-4">
            <FaClock className="text-blue-500 mr-2" size={24} />
            <h3 className="text-3xl font-bold">Real-Time Updates</h3>
          </div>
          <p className="mb-4">Stay informed with instant updates on the latest news and trends.</p>
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
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10 mt-10">
        <div className="relative w-1/2">
          
          <div className="relative p-4 bg-gray-800 rounded-lg">
            <Image 
              src="/images/followimage.png" 
              width={650}
              height={450}
              alt="Real-Time Updates"
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="ml-10 text-lg">
          <div className="flex items-center mb-4">
            <FaClock className="text-blue-500 mr-2" size={24} />
            <h3 className="text-3xl font-bold">Real-Time Updates</h3>
          </div>
          <p className="mb-4">Stay informed with instant updates on the latest news and trends.</p>
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

      <div className="text-center mb-10">
        <h3 className="text-4xl font-bold mb-2 relative">
        Launch your feed in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">4 easy steps</span>
        </h3>
        
        <p className="mb-4 ">From easy-to-manage Topfeed pages, to a professional, SEO-optimized news in 4 simple steps</p>
      </div>

      
    </div>
  );
};

export default FeaturesSection;
