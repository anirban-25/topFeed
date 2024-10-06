"use client";
import React, { useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import { auth, db } from "../firebase";
import TwitterFeedDialog from "./TwitterFeedDialog";
import { useAuthState } from "react-firebase-hooks/auth";

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useAppContext } from "@/contexts/AppContext";
import { MdOutlineSettings } from "react-icons/md";
import { Drawer } from "@material-tailwind/react";
import Link from "next/link";

const TwitterHeader = () => {
  const { twitterLoader, setTwitterLoader } = useAppContext();
  const [loaderTwitter, setLoaderTwitter] = useState(false);
  const [feedCreated, setFeedCreated] = useState(false);
  const [user] = useAuthState(auth);
  const [size, setSize] = useState(null);

  const [openSidePanel, setOpenSidePanel] = useState(false);
  const openDrawer = () => setOpenSidePanel(true);
  const closeDrawer = () => setOpenSidePanel(false);
  useEffect(() => {
    if (user) {
      checkExistingFeed();
    }
  }, [user]);
  useEffect(() => {
    checkExistingFeed();
  }, [twitterLoader]);
  // useEffect(() => {
  //   checkExistingFeed();
  // }, []);

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
    <header className="font-kumbh-sans-medium flex justify-between items-center bg-white shadow-md">
      <h1 className="font-kumbh-sans-bold text-xl text-[#8D8D8D] font-semibold ">
        <button
          onClick={openDrawer}
          className="flex md:hidden  bg-[#4c448a] text-white py-2 text-base ring-2 ring-blue-200  font-kumbh-sans-regular px-4 rounded-r-full  "
        >
          Twitter
        </button>
        <div className="hidden md:flex ml-2">My Twitter Feed</div>
        <Drawer
          open={openSidePanel}
          onClose={closeDrawer}
          className=" bg-transparent w-[10rem]"
        >
          <div className="space-y-10  border-[#4c448a] border-l-[10px] ">
            <div className=" bg-transparent text-center py-8 rounded-r-full text-black font-kumbh-sans-medium "></div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/dashboard/reddit" >
                Reddit
                </Link>
              </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white  border-l-transparent border-4 border-white font-kumbh-sans-regular ">
            <Link href="/dashboard/twitter">
                Twitter
                </Link>
              </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/dashboard/notification">
                Notification
                </Link>
              </div>
            <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/dashboard/support">
                Support
                </Link>
              </div>
          </div>
        </Drawer>
      </h1>
      <div className="flex items-center p-3">
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
              <MdOutlineSettings
                className="mr-2 text-xl"
                onClick={() => handleOpen("lg")}
              />{" "}
              Feed Settings
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
