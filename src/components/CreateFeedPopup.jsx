"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const CreateFeedPopup = ({ open, handleOpen, handleSubmit }) => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isAddingTopic, setIsAddingTopic] = useState(false); // State to toggle input field

  useEffect(() => {
    if (newTopic) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `https://www.reddit.com/subreddits/search.json?q=${newTopic}`
          );
          setSuggestions(
            response.data.data.children.map(
              (child) => child.data.display_name_prefixed
            )
          );
        } catch (error) {
          console.error("Error fetching subreddit suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [newTopic]);

  const handleAddTopic = (suggestion) => {
    if (suggestion) {
      setTopics([...topics, suggestion]);
      setNewTopic("");
      setIsAddingTopic(false); // Hide input field after adding a topic
      console.log("Added topic:", suggestion);
    }
  };

  const cleanSubredditName = (name) => {
    return name.startsWith("r/") ? name.slice(2) : name;
  };

  const removeSubReddit = (topic) => {
    setTopics(topics.filter((t) => t !== topic));
    console.log("Removed topic:", topic);
  };

  const handleGenerateFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      const cleanedTopics = topics.map(cleanSubredditName);
      await handleSubmit(cleanedTopics); // Call the submit function passed from the parent
    } catch (err) {
      console.error("Error during feed generation:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} size="lg" handler={handleOpen}>
      <DialogHeader className="font-kumbh-sans-semibold text-xl text-[#0B0B0B]">
        Add New Reddit Feed
      </DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <p className="font-kumbh-sans-medium text-base text-[#0B0B0B]">
            Subreddits
          </p>
          <p className="font-kumbh-sans-light text-sm text-[#0B0B0B]">
            TopFeed will track these subreddits and analyze new posts against
            your description to help you identify potential leads.
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <div
                key={index}
                value={topic}
                className="mr-2 mt-3 flex bg-[#F5F9FF] border border-[#94BEFF] rounded-full text-sm text-[#146EF5] font-kumbh-sans-medium px-3 items-center space-x-2 py-1"
              >
                <div>{topic}</div>
                <div className="cursor-pointer">
                  <RxCross2 onClick={() => removeSubReddit(topic)} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 relative">
            <div className="flex space-x-3">
              <Button
                color="white"
                onClick={() => setIsAddingTopic(!isAddingTopic)} // Toggle input field
                className="border border-[#CECECE]"
              >
                + Add SubReddit
              </Button>
              {isAddingTopic && ( // Render input field conditionally
                <input
                  type="text"
                  value={newTopic}
                  className="border w-[50%] rounded-lg p-2 shadow-md font-kumbh-sans-medium text-gray-800 border-[#CECECE]"
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Type here"
                />
              )}
            </div>
            {suggestions.length > 0 && newTopic && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleAddTopic(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-10 text-[#0B0B0B] text-base">
          <div className="font-kumbh-sans-semibold">Daily feed auto refresh</div>
          <div className="flex">
            <div className="flex items-center space-x-2 bg-[#FEF3F2] text-[#B42318] text-xs py-1 p-2 rounded-full border border-[#FECDCA] font-kumbh-sans-medium">
              <div>
                <IoIosInformationCircleOutline />
              </div>
              <div>Upgrade to our PRO plan to unlock daily auto refresh</div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-4">
        <Button
          color="white"
          text="black"
          onClick={() => handleOpen(null)}
          className="border border-[#CECECE]"
        >
          Cancel
        </Button>
        <Button color="blue" onClick={handleGenerateFeed} disabled={loading}>
          {loading ? "Generating Feed..." : "Generate Feed"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CreateFeedPopup;