"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import CreateFeedPopup from "../components/CreateFeedPopup";
import axios from "axios";

import { IoSearch } from "react-icons/io5";
import RedditMasonryLayout from "./MasonryLayoutReddit";
import { useAppContext } from "@/contexts/AppContext";

const RedditComponent = () => {
  const { redditDataFetch, setRedditDataFetch } = useAppContext();
  const [redditData, setRedditData] = useState(null);
  const [loaderInitial, setLoaderInitial] = useState(true);
  const [subreddits, setSubreddits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = (value) => setOpen(value);

  const handleSubmit = async (cleanedTopics) => {
    await handleRefresh(cleanedTopics);
    handleOpen(false);
  };

  const handleRefresh = async (cleanedTopics) => {
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      throw new Error("User is not authenticated.");
    }
    const userId = user.uid;
    const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
    const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      setSubreddits(docData.subreddits || []);
      const response = await axios.post("https://us-central1-topfeed-123.cloudfunctions.net/feedAPI/api/reddit/process", {
        subreddits: docData.subreddits,
        userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      
        timeout: 240000, // Timeout in milliseconds (5000ms = 5 seconds)
      });

      if (response.status !== 200) {
        setLoading(false);
        throw new Error("Failed to fetch data from server");
      }

      console.log("Received response from API:", response.data);

      await fetchLatestRedditData();
    } else {
      const response = await axios.post("/api/reddit", {
        subreddits: cleanedTopics,
        userId,
      },
      {
        timeout: 240000, // Timeout in milliseconds (5000ms = 5 seconds)
      });

      if (response.status !== 200) {
        setLoading(false);
        throw new Error("Failed to fetch data from server");
      }

      console.log("Received response from API:", response.data);

      await fetchLatestRedditData();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchLatestRedditData = async () => {
    setLoading(true);
    if (!user) return;
    try {
      console.log("Fetching data for user:", user.uid);
      const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const latestDoc = querySnapshot.docs[0];
        const data = latestDoc.data();
        console.log("Fetched data:", data);

        const analysisData = data.analysis || [];
        console.log("Analysis data:", analysisData);

        setRedditData(analysisData);
      } else {
        console.log("No documents found in user_reddits");
        setRedditData([]);
      }
    } catch (err) {
      console.error("Error fetching Reddit data:", err);
      setError(err.message);
    } finally {
      setLoaderInitial(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLatestRedditData();
    }
  }, [user]);
  useEffect(() => {
    import("ldrs").then(({ cardio }) => {
      cardio.register();
    });
    import("ldrs").then(({ lineSpinner }) => {
      lineSpinner.register();
    });
  }, []);
  const filteredData = redditData?.filter(
    (item) =>
      item.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sub_headings?.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.points.some((point) =>
            point.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.points?.some((point) =>
        point.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  useEffect(() => {
    if (redditDataFetch) {
      setLoading(redditDataFetch);
    } else {
      fetchLatestRedditData();

    }
  }, [redditDataFetch]);
  
  if (loaderInitial) {
    return (
      <div className="flex items-center justify-center min-h-[90%]">
        <l-line-spinner
          size="40"
          stroke="3"
          speed="1"
          color="black"
        ></l-line-spinner>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90%]">
        <div className=" text-center">
          <div>
            <l-cardio size="80" stroke="4" speed="2" color="black"></l-cardio>{" "}
          </div>
          <div>We are generating your feed!</div>
        </div>
        {/* Loader content */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-kumbh-sans-medium flex flex-col items-center justify-center p-8">
        Error: {error}
      </div>
    );
  }

  if (!redditData || redditData.length === 0) {
    return (
      <div className="font-kumbh-sans-medium flex flex-col items-center justify-center p-8">
        <Image
          src="/images/reddit.png"
          alt="Reddit Feed"
          width={457}
          height={270}
        />
        <div className="text-center mb-8 mt-8">
          <h1 className="font-kumbh-sans-Bold text-3xl font-bold mb-4">
            Create your Reddit TopFeed
          </h1>
          <div className="max-w-lg mx-auto">
            <p className="font-kumbh-sans-medium text-gray-600 mb-8">
              No Reddit data available. Click the button below to create a new
              feed.
            </p>
          </div>
          <button
            className="bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
            onClick={() => handleOpen(true)}
          >
            + Create New Feed
          </button>
        </div>
        <CreateFeedPopup
          open={open}
          handleOpen={handleOpen}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="font-kumbh-sans-Medium px-3 py-8 md:p-8">
      <div className=" w-full flex justify-items-center md:justify-end mb-6">
        <div className="relative flex items-center">
          <IoSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search in feed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border border-[#CECECE] rounded-lg px-4 py-2"
          />
        </div>
        <button
          className="bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg ml-4"
          onClick={() => handleRefresh(null)}
        >
          <div className="hidden md:block">Update Instant Refresh</div>
          <div className="md:hidden">Refresh</div>
        </button>
      </div>

      <RedditMasonryLayout filteredRedditData={filteredData} />
    </div>
  );
};

const formatTitle = (title) => {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default RedditComponent;
