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
import UserMenu from "../components/UserMenu";
import { auth, db, app } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { storeDataInFirestore } from "@/utils/storeRedditData";
const DashboardHeader = () => {
  const timezones = [
    { value: "Pacific/Midway", label: "(GMT-11:00) Midway Island" },
    { value: "Pacific/Honolulu", label: "(GMT-10:00) Hawaii" },
    { value: "America/Anchorage", label: "(GMT-09:00) Alaska" },
    {
      value: "America/Los_Angeles",
      label: "(GMT-08:00) Pacific Time (US & Canada)",
    },
    {
      value: "America/Denver",
      label: "(GMT-07:00) Mountain Time (US & Canada)",
    },
    {
      value: "America/Chicago",
      label: "(GMT-06:00) Central Time (US & Canada)",
    },
    {
      value: "America/New_York",
      label: "(GMT-05:00) Eastern Time (US & Canada)",
    },
    { value: "America/Caracas", label: "(GMT-04:30) Caracas" },
    { value: "America/Halifax", label: "(GMT-04:00) Atlantic Time (Canada)" },
    { value: "America/Sao_Paulo", label: "(GMT-03:00) Brasilia" },
    { value: "Atlantic/South_Georgia", label: "(GMT-02:00) Mid-Atlantic" },
    { value: "Atlantic/Azores", label: "(GMT-01:00) Azores" },
    {
      value: "Europe/London",
      label:
        "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",
    },
    {
      value: "Europe/Berlin",
      label: "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    },
    {
      value: "Europe/Helsinki",
      label: "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
    },
    {
      value: "Europe/Moscow",
      label: "(GMT+03:00) Moscow, St. Petersburg, Volgograd",
    },
    { value: "Asia/Dubai", label: "(GMT+04:00) Abu Dhabi, Muscat" },
    {
      value: "Asia/Karachi",
      label: "(GMT+05:00) Islamabad, Karachi, Tashkent",
    },
    { value: "Asia/Dhaka", label: "(GMT+06:00) Almaty, Novosibirsk" },
    { value: "Asia/Jakarta", label: "(GMT+07:00) Bangkok, Hanoi, Jakarta" },
    {
      value: "Asia/Shanghai",
      label: "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
    },
    { value: "Asia/Tokyo", label: "(GMT+09:00) Osaka, Sapporo, Tokyo" },
    {
      value: "Australia/Sydney",
      label: "(GMT+10:00) Canberra, Melbourne, Sydney",
    },
    {
      value: "Pacific/Noumea",
      label: "(GMT+11:00) Solomon Is., New Caledonia",
    },
    { value: "Pacific/Auckland", label: "(GMT+12:00) Auckland, Wellington" },
    { value: "Pacific/Chatham", label: "(GMT+13:00) Nuku alofa" },
  ];
  const [topics, setTopics] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [open, setOpen] = useState(false);
  const handleChange = (event) => {
    setSelectedTimezone(event.target.value);
  };
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [size, setSize] = useState(null);

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
    if (newTopic) {
      setTopics([...topics, suggestion]);
      setNewTopic("");
      console.log("Added topic:", suggestion);
    }
  };

  const cleanSubredditName = (name) => {
    return name.startsWith("r/") ? name.slice(2) : name;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const cleanedTopics = topics.map(cleanSubredditName);
      console.log(cleanedTopics);
      const user = auth.currentUser; // Get the current user from Firebase
  
      if (!user) {
        throw new Error("User is not authenticated.");
      }
  
      let token;
      try {
        token = await user.getIdToken(); // Get the Firebase ID token
      } catch (tokenError) {
        throw new Error("Failed to retrieve authentication token.");
      }
  
      const response = await axios.post("/api/reddit", {
        subreddits: cleanedTopics,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Firebase token
        },
      });
  
      if (response.status !== 200) {
        console.error("Failed to fetch data from API:", response.status);
        setError("Failed to fetch data from server");
        return;
      }
  
      console.log("Received response from API:", response.data);
      // No need to store in Firestore here, as the backend is handling it
  
    } catch (err) {
      console.error("Error during API call:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };
    

  const removeSubReddit = (topic) => {
    setTopics(topics.filter((t) => t !== topic));
    console.log("Removed topic:", topic);
  };

  const handleOpen = (value) => setSize(value);
  
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl text-[#8D8D8D] font-semibold ml-2">
        My Reddit Feed
      </h1>
      <div className="flex items-center">
        <button
          className="flex items-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-800 transition-all duration-200 mr-6"
          onClick={() => handleOpen("lg")}
        >
          + Create New Feed
        </button>
        <div>
          <UserMenu />
        </div>
      </div>
      <Dialog open={size === "lg"} size={size || "md"} handler={() => setSize(null)}>
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
                  <div className=" cursor-pointer">
                    <RxCross2 onClick={() => removeSubReddit(topic)} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 relative">
              <div className="flex space-x-3">
                <Button
                  color="white"
                  onClick={() => setOpen(!open)}
                  className="border border-[#CECECE]"
                >
                  + Add SubReddit
                </Button>
                {open && (
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
            <div className="font-kumbh-sans-semibold">
              Daily feed auto refresh time
            </div>
            <div className="flex">
              <div className="flex items-center space-x-2 bg-[#FEF3F2] text-[#B42318] text-xs py-1 p-2 rounded-full border border-[#FECDCA] font-kumbh-sans-medium">
                <div>
                  <IoIosInformationCircleOutline />
                </div>
                <div>
                  Upgrade to our PRO plan to unlock refresh time feature
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-4">
          <Button
            color="white"
            text="black"
            onClick={() => setSize(null)}
            className="border border-[#CECECE]"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating Feed..." : "Generate Feed"}
          </Button>
        </DialogFooter>
      </Dialog>
    </header>
  );
};

export default DashboardHeader;
