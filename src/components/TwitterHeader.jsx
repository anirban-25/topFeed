"use client";
import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
const TwitterHeader = () => {
  const [newTopic, setNewTopic] = useState("");
  // const handleAddTopic = (suggestion) => {
  //   if (newTopic) {
  //     setTopics([...topics, suggestion]);
  //     setNewTopic("");
  //   }
  // };
  const [twitterUrls, setTwitterUrls] = useState(["https://x.com/rustybrick"]); // State for storing URLs
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
      console.log(data.result); // Handle the response data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOpen = (value) => setSize(value);
  return (
    <header className="font-KumbhSans-Medium flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="font-KumbhSans-Bold text-xl text-[#8D8D8D] font-semibold ml-2">
        My Twitter Feed
      </h1>
      <div className="flex items-center">
        <button className="flex items-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-900 mr-6">
          <span
            className="font-KumbhSans-Medium"
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
      <Dialog open={size === "lg"} size={size || "md"} handler={handleOpen}>
        <DialogHeader className=" font-kumbh-sans-semibold text-xl text-[#0B0B0B]">
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
                    className=" border w-[50%] rounded-lg p-2 shadow-md font-kumbh-sans-medium text-gray-800 border-[#CECECE]"
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Type here"
                  />
                )}
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
          <div className=" border border-black mt-5 ">
            {inputs.map((value, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setInputs(
                      inputs.map((val, i) =>
                        i === index ? e.target.value : val
                      )
                    )
                  }
                  placeholder={`Enter Twitter URL ${index + 1}`}
                />
                <button onClick={() => addUrl(index)}>
                  Add URL {index + 1}
                </button>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="blue" onClick={handleOpen}>
            Cancel
          </Button>
          <Button color="blue" onClick={() => handleSubmit()}>
            Generate Feed
          </Button>
        </DialogFooter>
      </Dialog>
    </header>
  );
};

export default TwitterHeader;
