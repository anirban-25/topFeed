"use client";
import React, { useEffect, useState } from "react";
import CreateFeedPopup from "../components/CreateFeedPopup";
import UserMenu from "../components/UserMenu";
import { db, auth } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { MdOutlineSettings } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";

const DashboardHeader = () => {
  const { redditDataFetch, setRedditDataFetch, feedSetting, setFeedSetting } =
    useAppContext();
  const [open, setOpen] = useState(false);
  const [redditDataExists, setRedditDataExists] = useState(false);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  const [openSidePanel, setOpenSidePanel] = useState(false);
  const openDrawer = () => setOpenSidePanel(true);
  const closeDrawer = () => setOpenSidePanel(false);

  const handleOpen = (value) => setOpen(value);

  useEffect(() => {
    checkRedditData();
  }, [redditDataFetch]);

  useEffect(() => {
    console.log(feedSetting);
    if (feedSetting) {
      setRedditDataExists(true);
    } else {
      setRedditDataExists(false);
    }
  }, [feedSetting]);

  const checkRedditData = async () => {
    if (!user) return;

    try {
      const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      const latestAnalysisRef = doc(userRedditsRef, "latest_analysis");
      console.log(latestAnalysisRef);
      setRedditDataExists(!querySnapshot.empty);
      setFeedSetting(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking Reddit data:", error);
    }
  };

  const handleSubmit = async (cleanedTopics) => {
    try {
      if (!user) throw new Error("User is not authenticated.");

      const userId = user.uid;
      const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      // const querySnapshot = await getDocs(q);
      const latestAnalysisRef = doc(userRedditsRef, "latest_analysis");

      const docSnap = await getDoc(latestAnalysisRef);
      if (!docSnap.exists()) {
        // If the document doesn't exist, create it
        await setDoc(latestAnalysisRef, {
          subreddits: cleanedTopics,
        });
      } else {
        // If the document exists, update it
        await updateDoc(latestAnalysisRef, {
          subreddits: cleanedTopics,
        });
      }
      setFeedSetting(true);
      // Send the POST request to the API
      const response = await fetch(
        "https://us-central1-topfeed-123.cloudfunctions.net/feedAPI/api/reddit/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subreddits: cleanedTopics,
            userId,
          }),
        }
      );

      if (response.status !== 200)
        throw new Error("Failed to fetch data from server");

      console.log("Received response from API:", response.data);

      setOpen(false);
      checkRedditData();
    } catch (error) {
      console.error("Error during feed generation:", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User already");
      checkRedditData();
    }
  }, [user]);

  return (
    <header className="flex justify-between items-center  bg-white shadow-md">
      <h1 className="text-xl text-[#8D8D8D] font-semibold ">
        <button
          onClick={openDrawer}
          className="flex md:hidden  bg-[#4c448a] text-white py-2 text-base ring-2 ring-blue-200  font-kumbh-sans-regular px-4 rounded-r-full "
        >
          Reddit
        </button>
        <div className="ml-2 hidden md:flex">My Reddit Feed</div>
        <Drawer
          open={openSidePanel}
          onClose={closeDrawer}
          className=" bg-transparent w-[10rem]"
        >
          <div className="space-y-10  border-[#4c448a] border-l-[10px] ">
            <div className=" bg-transparent text-center py-8 rounded-r-full text-black font-kumbh-sans-medium "></div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white  border-l-transparent border-4 border-white font-kumbh-sans-regular ">
              <Link href="/dashboard/reddit">Reddit</Link>
            </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
              <Link href="/dashboard/twitter">Twitter</Link>
            </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
              <Link href="/dashboard/notifications">Notification</Link>
            </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
              <Link href="/dashboard/manage-subscription">Subscriptions</Link>
            </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
              <Link href="/pricing">Pricing</Link>
            </div>
          </div>
        </Drawer>
      </h1>
      <div className="flex items-center p-3">
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
