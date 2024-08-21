import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";

const RelevanceSelector = ({ tweets, onRelevanceChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRelevance, setSelectedRelevance] = useState([
    { label: "High Relevancy", value: "high", selected: true },
    { label: "Medium Relevancy", value: "medium", selected: true },
    { label: "Low Relevancy", value: "low", selected: true },
  ]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleRelevance = (index) => {
    const updatedRelevance = selectedRelevance.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    );
    setSelectedRelevance(updatedRelevance);
    onRelevanceChange(
      updatedRelevance.filter((item) => item.selected).map((item) => item.value)
    );
  };

  const getRelevanceCount = (relevance) => {
    return tweets.filter((tweet) => tweet.relevancy.toLowerCase() === relevance)
      .length;
  };

  const selectedCount = selectedRelevance.filter(
    (item) => item.selected
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-sm font-kumbh-sans-medium text-black bg-white border border-[#CECECE] rounded-md hover:bg-gray-50 focus:outline-none"
      >
        <span className="flex items-center">
          <Image
            src="/images/relevancy-icon.png"
            height={15}
            width={15}
            className="mr-2"
            alt="relevancy-icon"
          />
          Relevance
          {selectedCount > 0 && selectedCount < 3 && (
            <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
              {selectedCount}
            </span>
          )}
          <ChevronDown size={16} color="gray" className="ml-1" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {selectedRelevance.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleRelevance(index)}
              >
                <div
                  className={`w-4 h-4 mr-2 border rounded ${
                    item.selected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {item.selected && <Check size={12} color="white" />}
                </div>
                <span className="flex-grow">{item.label}</span>
                <span className="text-gray-500">
                  {getRelevanceCount(item.value).toString().padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelevanceSelector;