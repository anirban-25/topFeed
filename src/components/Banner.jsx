"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = () => {
  return (
    <div className="mb-10 flex justify-center md:px-20">
      <div className="bg-[#292929] rounded-2xl relative w-full h-[20rem] overflow-hidden z-10  items-center top-0 mx-auto">
        <Image
          src="/images/bg-pattern.svg"
          height={100}
          width={1200}
          alt="bg"
          className="mx-auto absolute top-0 -left-36"
        />
        <Image
          src="/images/ellipse-1.svg"
          height={100}
          width={600}
          alt="bg"
          className="mx-auto absolute left-0 -top-10 "
        />
        <Image
          src="/images/ellipse-2.svg"
          height={100}
          width={300}
          alt="bg"
          className="mx-auto absolute left-0 top-0 blur-md"
        />

        <Image
          src="/images/banner.png"
          height={500}
          width={600}
          className=" w-[300px] md:w-[600px] z-20 absolute right-0 bottom-0"
        />
        <Image
          src="/images/circle.png"
          height={100}
          width={500}
          alt="bg"
          className="mx-auto absolute left-36 top-0 opacity-65 "
        />
        <div className="ml-2 md:ml-20 mt-10">
          <div className="text-xl md:text-5xl max-w-[40rem]  font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFFFFF] via-[#55A3F8] to-[#7567D9]">
              Customize feed&nbsp;
            </span>
            while exploring content.
          </div>
          <div className="mt-5 max-w-[30rem] text-xs md:text-sm text-[#E6E6E6]">
            Wave goodbye to hectic news finding, focus on quality content and
            let TopFeed take care of the rest!
          </div>
          <div>
            <Link href="/pricing" className=" absolute z-40" >
              <button className="bg-[#146EF5] px-2 p-1 mt-10 rounded-md font-semibold">
                Start your free trial
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
