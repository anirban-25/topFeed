"use client";
import React, { useState } from "react";
import CreateFeedPopup from "../components/CreateFeedPopup";
import UserMenu from "../components/UserMenu";
import { auth } from "@/firebase";
import axios from "axios";

const DashboardHeader = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = (value) => setOpen(value);

  const handleSubmit = async (cleanedTopics) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;

    const response = await axios.post("/api/reddit", {
      subreddits: cleanedTopics,
      userId,
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch data from server");
    }

    console.log("Received response from API:", response.data);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl text-[#8D8D8D] font-semibold ml-2">
        My Reddit Feed
      </h1>
      <div className="flex items-center">
        <button
          className="flex items-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-800 transition-all duration-200 mr-6"
          onClick={() => handleOpen(true)}
        >
          + Create New Feed
        </button>
        <div>
          <UserMenu />
        </div>
      </div>
      <CreateFeedPopup open={open} handleOpen={handleOpen} handleSubmit={handleSubmit} />
    </header>
  );
};

export default DashboardHeader;
