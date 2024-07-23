import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className=" w-full  items-center py-7 text-white">
      <div className=" w-full flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-3 font-gilroy-bold text-lg">
            <Image src="/images/logo.png" height={120} width={120} alt="logo" />
          </div>
        </Link>
        <div className=" items-center flex space-x-5 md:space-x-20 font-semibold text-sm">
          <div>HOME</div>
          <div className="text-[#8D8D8D]">MY FEED</div>
          <div className="text-[#8D8D8D]">PRICING</div>
        </div>
        <div>
          <Link href="/login">
            <div className=" bg-[#2A2A2A] text-sm p-2 ring-1 hover:bg-[#1d1d1d] hover:scale-105 transition-all duration-200  cursor-pointer ring-[#3D3D3D] px-4 rounded-md">
              Login
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
