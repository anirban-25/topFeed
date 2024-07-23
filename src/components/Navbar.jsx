import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className=" w-full  items-center py-7 text-white">
      <div className=" w-full flex items-center justify-between">
        <div className="flex items-center space-x-3 font-gilroy-bold text-lg">
          <Image src="/images/logo.svg" height={60} width={120} alt="logo" />

          
        </div>
        <div className=" items-center flex space-x-5 md:space-x-20 font-semibold text-sm">
          <div>HOME</div>
          <div className="text-[#8D8D8D]">MY FEED</div>
          <div className="text-[#8D8D8D]">PRICING</div>
        </div>
        <div>
          <div className=" bg-[#2A2A2A] text-sm p-2 ring-1 ring-[#3D3D3D] px-4 rounded-md">Login</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
