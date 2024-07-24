import React from "react";
import { PiStarFourFill } from "react-icons/pi";
const HeroSection = () => {
  return (
    <div>
      <h1 className="flex text-xl md:text-6xl text-center justify-center font-kumbh-sans-bold mt-10 text-white ">
        <div className="">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #FFFFFF 0%, #55A3F8 18.22%, #7567D9 40.94%)",
            }}
          >
            Take control&nbsp;
          </span>
          <span>of your news feed</span>
        </div>
      </h1>
      <div className="flex justify-center items-center mt-3 text-sm text-center">
        <h3 className="text-xs md:max-w-[42rem] md:text-base text-[#E6E6E6]">
          Stay ahead of the curve with our AI-driven platform, real-time updates
          and deep insights on the latest SaaS trends, all tailored to your
          business needs.
        </h3>
      </div>
      <div className="flex justify-center mt-16 space-x-4">
        <button className="bg-[#146EF5] text-white text-sm px-3 md:px-6 py-2 rounded-md">
          Get Started
        </button>
        <button className="bg-[#3D3D3D] text-white text-sm px-3 md:px-6 py-2 rounded-md">
          Learn More
        </button>
      </div>
      <div className="text-center text-[#8D8D8D] text-xs md:text-sm mt-4 flex justify-center space-x-3 items-center">
        No credit card required &nbsp;
        <span>
          <PiStarFourFill color="white" />
        </span>
        &nbsp;FREE 14-day trial
      </div>
    </div>
  );
};

export default HeroSection;
