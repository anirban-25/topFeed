"use client";
import React, { useEffect, useState } from "react";
import CreateFeedPopup from "../components/CreateFeedPopup";
import UserMenu from "../components/UserMenu";
import { db, auth } from "@/firebase";

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import axios from "axios";
import { MdOutlineSettings } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppContext } from "@/contexts/AppContext";
import { storeDataInFirestore } from "@/utils/storeRedditData";

const DashboardHeader = () => {
  const { redditDataFetch,setRedditDataFetch } = useAppContext();
  const [open, setOpen] = useState(false);
  const [redditDataExists, setRedditDataExists] = useState(false);
  const [error, setError] = useState(null);
  const [subreddits, setSubreddits] = useState(null);
  
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const lambdaClient = new LambdaClient({
    region: 'us-east-2', // Replace with your AWS region
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
  });
  const handleOpen = (value) => setOpen(value);
  useEffect(() => {
    checkRedditData();
  }, [redditDataFetch])
  
  const checkRedditData = async () => {
    if (!user) return;

    const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
    const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    setRedditDataExists(!querySnapshot.empty);
    // setRedditDataFetch(!querySnapshot.empty);
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
  const handleSubmit = async (cleanedTopics) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      const userId = user.uid;
      // const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      // const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      // const querySnapshot = await getDocs(q);
  
      // let subredditsToUse;
      // if (!querySnapshot.empty) {
      //   const docData = querySnapshot.docs[0].data();
      //   subredditsToUse = docData.subreddits || [];
      //   setSubreddits(subredditsToUse);
      // } else {
      //   subredditsToUse = cleanedTopics;
      // }
       const subredditsToUse = cleanedTopics;
  
      const analysisData = await processRedditData(subredditsToUse, userId);
      console.log("Received analysis data:", analysisData);
  
    } catch (error) {
      console.error("Error in handleRefresh:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user) {
      checkRedditData();
    }
  }, [user]);



  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl text-[#8D8D8D] font-semibold ml-2">
        My Reddit Feed
      </h1>
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