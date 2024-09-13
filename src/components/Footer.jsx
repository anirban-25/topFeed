import Link from "next/link";
import React from "react";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-white py-8 px-3  md:px-20 md:pl-5">
      <div className="container mx-auto">
        <div className="flex flex-col w-full md:flex-row justify-between items-start mb-20">
          <div className="mb-6 md:mb-0">
            <h2 className="text-base md:text-xl font-bold mb-4">Stay up to date</h2>
            <form className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-black px-2  md:px-4 py-1  md:py-2 rounded-md w-48  md:w-64"
              />
              <button
                type="submit"
                className="bg-[#146EF5] text-white  px-2 md:px-4 py-2 rounded-md"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div>
              <h3 className="font-bold mb-2">Learn More</h3>
              <ul className="space-y-2">
                <li className="text-[#B8B8B8] text-sm hover:text-white hover:shadow-md shadow-white">
                  <a href="/privacy">Privacy</a>
                </li>
                <li className="text-[#B8B8B8] text-sm  hover:text-white hover:shadow-md shadow-white">
                  <a href="/terms">Terms</a>
                </li>
                <li className="text-[#B8B8B8] text-sm hover:text-white hover:shadow-md shadow-white">
                  <a href="/contact-us">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gradient-3 pt-4  flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#B8B8B8] text-sm mt-5">
            © 2024 TOPFEED. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <div className="p-1 border-white/[0.4] border-[1px] hover:text-[#202123] transition hover:bg-white">
              <Link href="https://www.facebook.com/topfeedai" target="_blank">
                <FaFacebookF className="h-5 w-5" />
              </Link>
            </div>

            <div className="p-1 border-white/[0.4] border-[1px] hover:text-[#202123] transition hover:bg-white">
              <Link
                href="https://www.linkedin.com/company/topfeedai/"
                target="_blank"
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
