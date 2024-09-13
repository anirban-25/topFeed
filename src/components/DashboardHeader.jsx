"use client";
import React, { useEffect, useState } from "react";
import CreateFeedPopup from "../components/CreateFeedPopup";
import UserMenu from "../components/UserMenu";
import { db, auth } from "@/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import axios from "axios";
import { MdOutlineSettings } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppContext } from "@/contexts/AppContext";

const DashboardHeader = () => {
  const { redditDataFetch, setRedditDataFetch } = useAppContext();
  const [open, setOpen] = useState(false);
  const [redditDataExists, setRedditDataExists] = useState(false);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  const handleOpen = (value) => setOpen(value);

  useEffect(() => {
    checkRedditData();
  }, [redditDataFetch]);

  const checkRedditData = async () => {
    if (!user) return;

    try {
      const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      setRedditDataExists(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking Reddit data:", error);
    }
  };

  const handleSubmit = async (cleanedTopics) => {
    try {
      if (!user) throw new Error("User is not authenticated.");

      const userId = user.uid;

      // Send the POST request to the API
      const response = await axios.post(
        "/api/reddit",
        { subreddits: cleanedTopics, userId },
        { headers: { 'Content-Type': 'application/json' }, timeout: process.env.NEXT_PUBLIC_TIMEOUT || 30000, }
      );

      if (response.status !== 200) throw new Error("Failed to fetch data from server");

      console.log("Received response from API:", response.data);

      setOpen(false);
      checkRedditData();
    } catch (error) {
      console.error("Error during feed generation:", error);
    }
  };
  

  useEffect(() => {
    if (user) checkRedditData();
  }, [user]);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl text-[#8D8D8D] font-semibold ml-2">My Reddit Feed</h1>
      <div className="flex items-center">
        <button
          className={`flex items-center px-4 py-2 text-md rounded-xl border transition-all duration-200 mr-6 ${
            redditDataExists
              ? "bg-white text-black hover:bg-gray-200 border-gray-300"
              : "bg-[#146EF5] text-white hover:bg-blue-800 border-transparent"
          }`}
          onClick={() => handleOpen(true)}
        >
          {redditDataExists ? (
            <>
              <MdOutlineSettings className="mr-2 text-xl" /> Feed Settings
            </>
          ) : (
            "+ Create New Feed"
          )}
        </button>
        <div>
          <UserMenu />
        </div>
      </div>
      <CreateFeedPopup
        open={open}
        handleOpen={handleOpen}
        handleSubmit={handleSubmit}
      />
    </header>
  );
};

export default DashboardHeader;
