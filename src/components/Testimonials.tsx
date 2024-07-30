"use client";
import Star from "@/utils/Star";
import Image from "next/image";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type Props = {};
const reviews = [
  {
    description:
      "TopFeed AI has revolutionized the way I stay updated with the latest trends in my industry. The ability to customize my feed with specific subreddits and Twitter accounts has saved me so much time. The real-time notifications ensure I never miss out on important discussions. Highly recommend the Growth plan for its advanced analytics and priority support!",
    stars: 5,
    author: " Alex M.",
    position: "Digital Marketing Specialist",
  },
  {
    description:
      "As a content writer, TopFeed AI has become an essential tool for me. The daily automatic feed refreshes and instant Reddit summaries keep me informed and inspired for my next articles. The integration with Slack and WhatsApp is a game-changer, making it easy to stay connected on the go. Excellent value for money with the Scale plan.",
    stars: 5,
    author: "Maya S.",
    position: "Content Head",
  },
  
];

const Testimonials = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };
  const calculateOpacity = (index: number) => {
    const distance = Math.abs(currentIndex - index);
    return 1 - distance * 0.65; // Opacity decreases by 25% per card distance
  };
  return (
    <div className="relative md:flex">
      <div className="overflow-hidden mb-5 md:mb-0 md:w-[60%]">
        <div
          className="flex space-x-6 transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * 300}px)`,
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#292929] min-w-[300px] max-w-[300px] border-gradient p-5 space-y-3"
              style={{
                opacity: calculateOpacity(index),
              }}
            >
              <Star stars={5} />
              <Image
                src="/images/review-icon.svg"
                height={60}
                width={60}
                alt="review icon"
                className="pt-2"
              />
              <div className="text-sm">{review.description}</div>
              <div className="mt-4">
                <div className="text-xs">{review.author}</div>
                <div className="text-xs text-[#B3B3B3]">{review.position}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="tracking-widest text-xs mb-5 text-[#8D8D8D]">
          TESTIMONIALS
        </div>
        <div className="text-xl text-left md:text-4xl max-w-[30rem] font-bold">
          We are the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#55A3F8] to-[#7567D9]">
            talk of the town!
          </span>
        </div>
        <div className="text-left mb-2 mt-2 max-w-[34rem] text-[#B8B8B8] text-sm">
          These are the stories of some of our very early customers about their
          experience of using Newsly.
        </div>
        <div className="flex space-x-6 mt-10">
          <div
            className="bg-[#2A2A2A] border border-[#3D3D3D] p-4 rounded-full"
            onClick={handlePrev}
          >
            <FaArrowLeft />
          </div>
          <div className="bg-blue-600 p-4 rounded-full" onClick={handleNext}>
            <FaArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
