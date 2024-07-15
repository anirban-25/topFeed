import Image from "next/image";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="hidden lg:block mt-32">
      <div className="px-20 flex justify-between">
        <div>
          <div>
            <Image src="/images/logo.svg" height={100} width={100} alt="logo" />
          </div>
          <div className="text-sm font-gilroy-light mt-5">
            Experience a smooth, simple and hassle free experience.
          </div>
        </div>
        <div>
          <div className="font-gilroy-bold">Sellers</div>
          <div className="mt-5 space-y-3">
            <div className="text-sm font-gilroy-light">List your startup</div>
            <div className="text-sm font-gilroy-light">Pricing</div>
            <div className="text-sm font-gilroy-light">Get help Selling</div>
          </div>
        </div>
        <div>
          <div className="font-gilroy-bold">Buyers</div>
          <div className="mt-5 space-y-3">
            <div className="text-sm font-gilroy-light">Browse Startups</div>
            <div className="text-sm font-gilroy-light">Pricing</div>
            <div className="text-sm font-gilroy-light">
              Instant Slack Alerts
            </div>
          </div>
        </div>
        <div>
          <div className="font-gilroy-bold">Company</div>
          <div className="mt-5 space-y-3">
            <div className="text-sm font-gilroy-light">About Us</div>
            <div className="text-sm font-gilroy-light">Testimonials</div>
            <div className="text-sm font-gilroy-light">Legal</div>
          </div>
        </div>
        <div>
          <div className="font-gilroy-bold">Resources</div>
          <div className="mt-5 space-y-3">
            <div className="text-sm font-gilroy-light">Help Center</div>
            <div className="text-sm font-gilroy-light">Blog</div>
          </div>
        </div>
        <div>
          <div className="font-gilroy-bold">Contact Us</div>
          <div className="mt-5 space-y-3">
            <div className="text-sm font-gilroy-light ">
              support@ecomswap.com
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 px-20">
        <div className="border-[#A7A5A9] border-[1px]" />
        <div className="flex justify-between items-center mt-5 mb-5">
          <div className="text-[#A7A5A9] text-sm">
            © 2077 Untitled UI. All rights reserved.
          </div>
          <div className="text-[#A7A5A9] flex space-x-4">
            <div className=" hover:text-black cursor-pointer hover:scale-105 transition ease-in">
              <FaXTwitter size={21} />
            </div>
            <div className=" hover:text-black cursor-pointer hover:scale-105 transition ease-in">
              <FaLinkedin size={23} />
            </div>
            <div className=" hover:text-black cursor-pointer hover:scale-105 transition ease-in">
              <FaFacebook size={24}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
