import Image from "next/image";
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FormTemplates from "@/components/FormTemplates";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
const page = () => {
  return (
    <div>
      <div className="relative w-full -z-10 flex justify-center items-center top-0 mx-auto">
        <Image
          src="/images/bg-pattern.svg"
          height={100}
          width={1200}
          alt="bg"
          className="mx-auto absolute top-0"
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
          width={500}
          alt="bg"
          className="mx-auto absolute left-0 top-0 blur-md"
        />

        <Image
          src="/images/circle.png"
          height={100}
          width={800}
          alt="bg"
          className="mx-auto absolute w-[234px] md:w-[800px] top-10 left-20 md:left-36 md:top-0 "
        />
      </div>
      <div className="px-5 md:px-20">
        <div className="w-full flex justify-center items-center">
          <Navbar />
        </div>
        <div className=" w-full  justify-center items-center">
          <HeroSection />
        </div>
        <div className="mt-20 block">
          {/* <FormTemplates /> */}
          <FeaturesSection />
        </div>
      </div>
      <div className=" w-full border-gradient-2 mt-44" />
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default page;
