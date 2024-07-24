// components/FAQ.js
"use client";
import { useState } from 'react';
import clsx from 'clsx';
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
const questions = [
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible. Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can change your plan at any time. Just go to your account settings and select the plan you want to switch to.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'You can cancel your subscription at any time. If you cancel within the first 30 days, you will receive a full refund.',
  },
  {
    question: 'Can other info be added to an invoice?',
    answer: 'Yes, you can add additional information to your invoice during the checkout process or by contacting our support team.',
  },
  {
    question: 'How does billing work?',
    answer: 'Billing is done on a monthly basis. You will be charged on the same day each month based on the date you subscribed.',
  },
  {
    question: 'How do I change my account email?',
    answer: 'To change your account email, go to your account settings and update your email address. A verification email will be sent to your new email address.',
  },
];

export default function FAQ() {
  const [visibleIndex, setVisibleIndex] = useState(null);

  const toggleVisibility = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  return (
    <div className="md:p-6 rounded-lg shadow-lg">
      {questions.map((item, index) => (
        <div
          key={index}
          className={clsx(
            ' border-b border-[#3D3D3D] rounded p-4 transition-colors duration-300',
            visibleIndex === index ? 'bg-[#1A1A1A] text-white' : 'bg-transparent text-gray-300' ,index === 0? ' rounded-t-2xl': 'rounded-none', index === 5? "rounded-b-2xl border-none": "rounded-none"
          )}
        >
          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleVisibility(index)}>
            <h2 className="text-base md:text-lg ">{item.question}</h2>
            <button
              className={clsx(" text-white font-bold  ", visibleIndex === index? 'text-[#146EF5]': 'text-[#98A2B3]')}
            >
              {visibleIndex === index ? <CiCircleMinus size={20} color='#146EF5'/> : <CiCirclePlus size={20} />}
            </button>
          </div>
          <div
            className={clsx(
              'transition-all duration-300 text-sm transform text-[#CCCCCC]',
              visibleIndex === index ? 'opacity-100 max-h-40 translate-y-0' : 'opacity-0 max-h-0 -translate-y-2 overflow-hidden'
            )}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
