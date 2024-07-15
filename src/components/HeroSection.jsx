import React from "react";

const HeroSection = () => {
  return (
    <div className="flex text-5xl font-sans font-bold mt-10 space-x-3 text-white ">
      <div
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #FFFFFF 0%, #55A3F8 18.22%, #7567D9 40.94%)",
        }}
      >
        Take control
      </div>
      <div>of your news feed</div>
    </div>
  );
};

export default HeroSection;
