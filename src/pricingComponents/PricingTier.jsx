import React from "react";
import { FaStar } from "react-icons/fa6";
import { LuRocket } from "react-icons/lu";
const PricingTier = ({ name, price, yearlyPrice, popular, features, lemonSqueezyMonthlyUrl, lemonSqueezyYearlyUrl, clicked   }) => {
  const handleCheckout = () => {
    const checkoutUrl = clicked ? lemonSqueezyYearlyUrl : lemonSqueezyMonthlyUrl;
    window.location.href = checkoutUrl; 
  };
  const monthlyEquivalent = clicked ? (yearlyPrice / 12) : price;
  return (
    <div
      className={`bg-[#292929] rounded-lg p-6 flex flex-col h-full ${
        popular
          ? "border-2 border-blue-500 shadow-[0_5px_60px_-15px_rgba(0,0,0,0.3)] shadow-blue-900"
          : ""
      }`}
    >
      <div className=" items-center mb-4">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-kumbh-sans-semibold flex items-center space-x-2 text-white">
              <div className="text-[#146EF5]">
                <LuRocket />
              </div>
              <div>{name}</div>
            </h2>
            {popular && (
              <div className=" text-white bg-gradient-to-r from-[#F79009] to-[#F56334] items-center text-xs  px-2 py-1 rounded-full font-kumbh-sans-bold flex space-x-1 ">
                <div>
                  <FaStar />
                </div>
                <div>Most Popular</div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-9">
            <div className="text-3xl font-bold text-white">
              ${clicked ? (yearlyPrice / 12) : price}
              <span className="text-sm font-normal">/mo</span>
            </div>
            {clicked && yearlyPrice>0 && (
              <div className="text-sm text-gray-400">
                billed <span className="text-white">${yearlyPrice}</span> yearly
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className={`w-full py-2 rounded-md mb-6  ${
          popular
            ? "bg-blue-500 text-white"
            : "bg-[#3D3D3D] text-white border-[#8F8F8F] border"
        }`}
        onClick={handleCheckout}
      >
        Start a FREE trial
      </button>
      <div className="text-sm text-gray-300 flex-grow border-t border-gradient-3">
        <p className="font-semibold mb-2 mt-5 text-[#8D8D8D] text-xs font-kumbh-sans-light">
          INCLUDES
        </p>
        <ul>
          {features.map((feature, index) => (
            <li key={index} className="flex items-start mb-2">
              <svg
                className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingTier;
