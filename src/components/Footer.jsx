import React from "react";

const Footer = () => {
  return (
    <footer className=" text-white py-8 px-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">Stay up to date</h2>
            <form className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-black px-4 py-2 rounded-md w-64"
              />
              <button
                type="submit"
                className="bg-[#146EF5] text-white px-4 py-2 rounded-md"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div>
              <h3 className="font-bold mb-2">Learn More</h3>
              <ul className="space-y-2">
                <li className="text-[#B8B8B8] text-sm">Privacy</li>
                <li className="text-[#B8B8B8] text-sm">Terms</li>
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
            <a href="#" className="text-[#B8B8B8] hover:underline">
              Terms
            </a>
            <a href="#" className="text-[#B8B8B8] hover:underline">
              Privacy
            </a>
            <a href="#" className="text-[#B8B8B8] hover:underline">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
