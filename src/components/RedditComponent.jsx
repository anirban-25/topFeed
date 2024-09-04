"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { storeDataInFirestore } from "@/utils/storeRedditData";
import { db, auth } from "../firebase";
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { getUserNotificationSettings, sendTelegramMessage } from "@/utils/notificationUtils";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import CreateFeedPopup from "../components/CreateFeedPopup";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { IoSearch } from "react-icons/io5";
import RedditMasonryLayout from "./MasonryLayoutReddit";
import { useAppContext } from "@/contexts/AppContext";

const RedditComponent = () => {
  const { redditDataFetch, setRedditDataFetch } = useAppContext();
  const [redditData, setRedditData] = useState(null);
  const [loaderInitial, setLoaderInitial] = useState(true)
  const [subreddits, setSubreddits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const lambdaClient = new LambdaClient({
    region: 'us-east-2', // Replace with your AWS region
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
  });
  const handleOpen = (value) => setOpen(value);

  const handleSubmit = async (cleanedTopics) => {
    await handleRefresh(cleanedTopics);
    handleOpen(false);
  };
  async function processRedditData(subreddits, userId) {
    console.log("Subreddits:", subreddits);
    console.log("User ID:", userId);
    console.log("-------------------------------------------");
  
    const eventPayload = {
      body: JSON.stringify({ subreddits }),
    };
  
    const params = {
      FunctionName: "chatgpt",
      Payload: JSON.stringify(eventPayload),
    };
  
    try {
      const command = new InvokeCommand(params);
      const lambdaResponse = await lambdaClient.send(command);
      console.log("Lambda response:", lambdaResponse);
  
      if (lambdaResponse.StatusCode === 200 && lambdaResponse.Payload) {
        const responseBuffer = lambdaResponse.Payload instanceof Uint8Array 
          ? lambdaResponse.Payload 
          : new Uint8Array(lambdaResponse.Payload);
        const parsedResponse = JSON.parse(Buffer.from(responseBuffer).toString());
  
        if (parsedResponse.statusCode === 400) {
          throw new Error(parsedResponse.body);
        }
  
        const parsedBody = JSON.parse(parsedResponse.body);
        const analysisData = parsedBody;
  
        console.log("Analysis data to store in Firestore:", analysisData);
  
        if (!analysisData) {
          throw new Error("No analysis data found in the Lambda response.");
        }
  
        // Store the processed data, subreddits, and increment the refresh count in Firestore
        await storeDataInFirestore(analysisData, userId, subreddits);
  
        return analysisData;
      } else {
        throw new Error("Failed to invoke Lambda function");
      }
    } catch (error) {
      console.error("Error invoking Lambda:", error);
      throw error;
    }
  }

  const handleRefresh = async (cleanedTopics) => {
    setLoading(true);
  
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      const userId = user.uid;
      const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
  
      let subredditsToUse;
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        subredditsToUse = docData.subreddits || [];
        setSubreddits(subredditsToUse);
      } else {
        subredditsToUse = cleanedTopics;
      }
  
      const analysisData = await processRedditData(subredditsToUse, userId);
      console.log("Received analysis data:", analysisData);
  
      await fetchLatestRedditData();
    } catch (error) {
      console.error("Error in handleRefresh:", error);
      setError(error.message);
    } finally {
      setLoading(false);
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
      setLoaderInitial(false)
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
    if(redditDataFetch){
      setLoading(redditDataFetch);
    }else{
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
    <div className="font-kumbh-sans-Medium p-8">
      <div className="flex justify-end mb-6">
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
          Update Instant Refresh
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
