import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div>
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
            className="mx-auto absolute left-36 top-0 "
          />
        </div>
        <div className="px-20">
          <Navbar />
        </div>
      </div>
      {/* Contact Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">Contact Us</h2>
        <p className="mt-4 text-lg text-center text-gray-500">
          We'd love to hear from you! Please fill out the form below and we'll get in touch with you as soon as possible.
        </p>

        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <form className=" shadow-lg rounded-lg p-8">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 bg-white bg-opacity-15 text-white focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white  text-white  bg-opacity-15 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows ={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-opacity-15 bg-white text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className=" shadow-lg shadow-gray-900  bg-gradient-to-r from-gray-500/[0.1] to-gray-800/[0.1] bg-opacity-5 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-300">Our Contact Information</h3>
              <p className="mt-3 text-sm text-gray-400">
                If you have any questions, feel free to reach out to us using the following contact details:
              </p>
              <ul className="mt-4 text-sm text-gray-400">
                <li className="mt-2">
                  <strong>Email:</strong> support@favtutor.com
                </li>
                <li className="mt-2">
                  <strong>Phone:</strong> +1(786) 231-3819
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default page;
