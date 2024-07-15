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
        <div className=" tracking-wider">of your news feed</div>
      </div>
      <div className="flex justify-center items-center mt-3 text-sm text-center ">
        <div className="max-w-[42rem] text-[#E6E6E6]">
          Stay ahead of the curve with our AI-driven platform, real-time updates
          and deep insights on the latest SaaS trends, all tailored to your
          business needs.
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
