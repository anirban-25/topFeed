"use client";
import React, { useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import { auth, db } from "../firebase";
import TwitterFeedDialog from "./TwitterFeedDialog";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { useAppContext } from "@/contexts/AppContext";
import { MdOutlineSettings } from "react-icons/md";

const TwitterHeader = () => {
  const { twitterLoader, setTwitterLoader } = useAppContext();
  const [loaderTwitter, setLoaderTwitter] = useState(false)
  const [feedCreated, setFeedCreated] = useState(false);
  const [user] = useAuthState(auth);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (user) {
      checkExistingFeed();
    }
  }, [user]);
  useEffect(() => {
    checkExistingFeed();
  }, [twitterLoader]);
  
  const checkExistingFeed = async () => {
    try {
      const q = query(
        collection(db, "users", user.uid, "tweet_feed"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      setFeedCreated(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking existing feed: ", error);
    }
  };

  const handleOpen = (value) => setSize(value);

  const handleFeedCreated = () => {
    setFeedCreated(true);
    handleOpen(null); // Close the dialog
  };

  return (
    <header className="font-kumbh-sans-medium flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="font-kumbh-sans-bold text-xl text-[#8D8D8D] font-semibold ml-2">
        My Twitter Feed
      </h1>
      <div className="flex items-center">
      <button
      className={`flex items-center px-4 py-2 text-md rounded-xl border transition-all duration-200 mr-6 ${
        feedCreated
          ? "bg-white text-black hover:bg-gray-200 border-gray-300"
          : "bg-[#146EF5] text-white hover:bg-blue-800 border-transparent"
      }`}
      onClick={() => handleOpen("lg")}
    >
      {feedCreated ? (
        <>
          <MdOutlineSettings className="mr-2 text-xl" onClick={() => handleOpen("lg")}/> Feed Settings
        </>
      ) : (
        "+ Create New Feed"
      )}
    </button>
        <div>
          <UserMenu />
        </div>
      </div>
      <TwitterFeedDialog
        size={size}
        handleOpen={handleOpen}
        onFeedCreated={handleFeedCreated}
      />
    </header>
  );
};

export default TwitterHeader;