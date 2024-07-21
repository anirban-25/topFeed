import React from "react";
const HeroSection = () => {
  return (
    <div>
      <div className="flex text-5xl text-center justify-center font-sans font-bold mt-10 text-white ">
        <div
          className="bg-clip-text text-transparent tracking-wider"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #FFFFFF 0%, #55A3F8 18.22%, #7567D9 40.94%)",
          }}
        >
          Take control&nbsp;
        </div>
        <div className="tracking-wider">of your news feed</div>
      </div>
      <div className="flex justify-center items-center mt-3 text-sm text-center">
        <div className="max-w-[42rem] text-[#E6E6E6]">
          Stay ahead of the curve with our AI-driven platform, real-time updates
          and deep insights on the latest SaaS trends, all tailored to your
          business needs.
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <button className="bg-[#146EF5] text-white px-6 py-2 rounded-md">Get Started</button>
        <button className="bg-[#3D3D3D] text-white px-6 py-2 rounded-md">Learn More</button>
      </div>
      <div className="text-center text-[#8D8D8D] text-sm mt-4">
        No credit card required • FREE 14-day trial
      </div>
    </div>
  );
};

export default HeroSection;