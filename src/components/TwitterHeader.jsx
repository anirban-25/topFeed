"use client";
import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { auth } from "../firebase";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { X } from "lucide-react";
import { storeDataInFirestore } from "../utils/storeData";
const TwitterHeader = () => {
  const [newTopic, setNewTopic] = useState("");
  const [twitterUrls, setTwitterUrls] = useState([""]);
  const [errors, setErrors] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (isSaved) {
      setErrors(Array(twitterUrls.length).fill(""));
    }
  }, [isSaved, twitterUrls.length]);
  const validateUrl = (url) => {
    const regex = /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/;
    return regex.test(url);
  };

  const handleInputChange = (index, value) => {
    const newUrls = [...twitterUrls];
    newUrls[index] = value;
    setTwitterUrls(newUrls);
    setIsSaved(false);
  };

  const addMore = () => {
    setTwitterUrls([...twitterUrls, ""]);
    setIsSaved(false);
  };

  const handleSave = () => {
    const newErrors = twitterUrls.map((url) =>
      url.trim() === "" ? "" : validateUrl(url) ? "" : "Invalid Twitter URL"
    );
    setErrors(newErrors);

    if (newErrors.every((error) => error === "")) {
      console.log("Saved Twitter URLs:", twitterUrls);
      setIsSaved(true);
    }
  }; // State for storing URLs
  const removeInput = (index) => {
    const newUrls = twitterUrls.filter((_, i) => i !== index);
    setTwitterUrls(newUrls);
    setErrors(errors.filter((_, i) => i !== index));
    setIsSaved(false);
  };
  const [inputs, setInputs] = useState(["", ""]);
  const [size, setSize] = useState(null);
  const addUrl = (index) => {
    if (inputs[index]) {
      // Ensure the input is not empty
      setTwitterUrls([...twitterUrls, inputs[index]]);
      setInputs(inputs.map((value, i) => (i === index ? "" : value))); // Clear the input box
    }
  };
  const handleSubmit = async () => {
    if(!isSaved){
      alert("Please save the accounts");
      return;
    }
    console.log(twitterUrls);
    console.log(inputs);
    console.log(newTopic);

    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ twitterUrls, newTopic }), // Send the topics array inside an object
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      const tweetsArray = JSON.parse(data.result);
      console.log("Parsed tweets array:", tweetsArray);

      // Check if the parsed result is an array
      if (!Array.isArray(tweetsArray)) {
        console.error("Parsed result is not an array:", tweetsArray);
        return;
      }

      // Get the authenticated user's ID
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("User is not authenticated.");
        return;
      }

      // Store the parsed data in Firestore under the authenticated user's subcollection
      await storeDataInFirestore(tweetsArray, userId);
      console.log("Data stored in Firestore successfully for user:", userId); // Handle the response data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = (value) => setSize(value);
  return (
    <header className="font-kumbh-sans-Medium flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="font-kumbh-sans-bold text-xl text-[#8D8D8D] font-semibold ml-2">
        My Twitter Feed
      </h1>
      <div className="flex items-center">
        <button className="flex items-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-900 mr-6">
          <span
            className="font-kumbh-sans-Medium"
            onClick={() => handleOpen("lg")}
            variant="gradient"
          >
            + Create New Feed
          </span>
        </button>
        <button className="mr-5">
          <RxAvatar size={32} />
        </button>
      </div>
      <Dialog
        open={size === "lg"}
        size={size || "md"}
        handler={handleOpen}
        className=" max-h-[80%] overflow-scroll"
      >
        <DialogHeader className=" font-kumbh-sans-semibold text-xl text-[#0B0B0B]">
          Add New Twitter Feed
        </DialogHeader>
        <DialogBody>
          <div className="mb-4">
            <p className="font-kumbh-sans-medium text-base text-[#0B0B0B]">
              Enter Topic
            </p>
            <p className="font-kumbh-sans-medium text-sm text-[#828282]">
              Try to be very specific for the best results
            </p>

            <div className="mt-4 relative">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newTopic}
                  className=" border w-[50%] rounded-lg p-2 shadow-md font-kumbh-sans-medium text-gray-800 border-[#CECECE]"
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Type here"
                />

                <Button color="white" className="border border-[#CECECE]">
                  + Add topic
                </Button>
              </div>
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
          <div className="max-w-lg  mt-5 ">
            {twitterUrls.map((url, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-[#787878] font-kumbh-sans-medium mb-2">
                  Account {index + 1}
                </label>
                <div className="flex relative items-center">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="https://twitter.com/example"
                    className={`w-full text-black px-3 py-2 pr-10 border ${
                      errors[index] ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {twitterUrls.length > 1 && (
                    <button
                      onClick={() => removeInput(index)}
                      className="absolute top-3 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <X color="black" size={18} />
                    </button>
                  )}
                </div>
                {errors[index] && (
                  <p className="mt-1 text-xs text-red-500">{errors[index]}</p>
                )}
              </div>
            ))}
            <div className="mt-4">
              <button
                onClick={addMore}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                + Add More
              </button>
              <button
                onClick={handleSave}
                className={`ml-4 px-4 py-2 text-sm font-medium text-white ${
                  isSaved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-5">
          <buttop  className=" cursor-pointer border px-4 py-1 rounded-md text-black font-kumbh-sans-semibold border-black" onClick={handleOpen}>
            Cancel
          </buttop>
          <button className=" cursor-pointer border border-[#146EF5] px-4 py-1 rounded-md text-white font-kumbh-sans-semibold bg-[#146EF5] " onClick={() => handleSubmit()}>
            Generate Feed
          </button>
        </DialogFooter>
      </Dialog>
    </header>
  );
};

export default TwitterHeader;
