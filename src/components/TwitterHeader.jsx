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
          className="flex items-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-900 mr-6"
          onClick={() => handleOpen("lg")}
        >
          <span className="font-kumbh-sans-medium">
            {feedCreated ? "+ Feed Settings" : "+ Create New Feed"}
          </span>
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