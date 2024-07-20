"use client";
import Star from "@/utils/Star";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};
const reviews = [
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
];

const Testimonials = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };
  const calculateOpacity = (index: number) => {
    const distance = Math.abs(currentIndex - index);
    return 1 - distance * 0.35; // Opacity decreases by 25% per card distance
  };
  return (
    <div className="relative flex">
      <div className="overflow-hidden w-[60%]">
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
              />
              <div className="text-sm">{review.description}</div>
              <div className="mt-4">
                <div className="text-xs">{review.author}</div>
                <div className="text-xs text-[#B3B3B3]">
                  {review.position}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2"
      >
        Next
      </button>
    </div>
  );
};

export default Testimonials;
