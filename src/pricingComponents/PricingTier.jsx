import React from "react";

const PricingTier = ({ name, price, yearlyPrice, popular, features }) => {
  return (
    <div className={`bg-[#292929] rounded-lg p-6 flex flex-col h-full ${popular ? 'border-2 border-blue-500' : ''}`}>
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-bold text-white">{name}</h2>
        <p className="text-3xl font-bold text-white">${price}<span className="text-sm font-normal">/mo</span></p>
        <p className="text-sm text-gray-400">billed ${yearlyPrice} yearly</p>
      </div>
      {popular && (
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">Most Popular</span>
      )}
    </div>
    <button className={`w-full py-2 rounded-md mb-6 ${popular ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white border-[#8F8F8F] border'}`}>
      Start a FREE trial
    </button>
    <div className="text-sm text-gray-300 flex-grow">
      <p className="font-semibold mb-2">INCLUDES</p>
      <ul>
        {features.map((feature, index) => (
          <li key={index} className="flex items-start mb-2">
            <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
