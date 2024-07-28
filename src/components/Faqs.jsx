// components/FAQ.js
"use client";
import { useState } from 'react';
import clsx from 'clsx';
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
const questions = [
  {
    question: 'How does TopFeed AI help me stay updated? ',
    answer: 'TopFeed AI aggregates and summarizes the most relevant discussions from Reddit and the latest Tweets from Twitter based on your preferences. This helps you stay informed about the latest trends and conversations in your niche without having to manually search for updates.',
  },
  {
    question: 'Can I customize the sources and topics I follow',
    answer: 'Yes, you can personalize your feed by selecting specific subreddits and Twitter accounts to follow. Additionally, you can set preferences for the types of topics you are interested in, ensuring you only receive the most relevant updates.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, TopFeed AI offers a free plan that includes 2 instant Reddit feed refreshes per month and allows you to follow up to 3 Twitter accounts. This lets you experience the basic features of our platform without any cost.',
  },
  {
    question: 'How often are the feeds refreshed?',
    answer: 'The frequency of feed refreshes depends on the plan you choose. The free plan includes 2 instant Reddit feed refreshes per month, while the Basic, Pro, and Advanced plans offer daily automatic feed refreshes and a varying number of instant refreshes.',
  },
  {
    question: 'What kind of notifications can I receive?',
    answer: 'Depending on your plan, you can receive notifications via email, Slack, Telegram, and WhatsApp. These notifications keep you updated with the latest discussions and tweets in real-time, ensuring you never miss important updates.',
  },
  {
    question: 'How do I upgrade my plan?',
    answer: 'Upgrading your plan is simple. Just log into your TopFeed AI account, navigate to the pricing page, and select the plan that best fits your needs. Follow the prompts to complete the upgrade process, and you’ll have immediate access to the additional features and benefits.',
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
    'transition-opacity duration-300 text-sm text-[#CCCCCC]',
    visibleIndex === index ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
  )}
  style={{
    transform: visibleIndex === index ? 'translateY(0)' : 'translateY(-0.5rem)',
    transition: 'opacity 0.3s, max-height 0.3s, transform 0.3s',
  }}
>
  <p>{item.answer}</p>
</div>

        </div>
      ))}
    </div>
  );
}
