"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth, app } from "../firebase";
import { AiOutlineInfoCircle } from "react-icons/ai";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import CreateFeedPopup from "../components/CreateFeedPopup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import RedditMasonryLayout from "./MasonryLayoutReddit";
import { useAppContext } from "@/contexts/AppContext";

const RedditComponent = () => {
  const { redditDataFetch, setRedditDataFetch, feedSetting, setFeedSetting, redditLoading, setRedditLoading } =
    useAppContext();
  const [redditData, setRedditData] = useState([]);
  const [loaderInitial, setLoaderInitial] = useState(true);
  const [subreddits, setSubreddits] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [plan, setPlan] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [isRefreshCount, setIsRefreshCount] = useState(0);
  const [remainingRefreshes, setRemainingRefreshes] = useState(0);
  const [showInfoButton, setShowInfoButton] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Set the Firebase user when logged in

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          setPlan(userData.plan);

          //console.log("plan", userData.plan);
        } else {
          console.error("No user document found in Firestore");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleOpen = (value) => setOpen(value);

  const handleSubmit = async (cleanedTopics) => {
    await handleRefresh(cleanedTopics);
    handleOpen(false);
  };

  const fetchIsRefreshCount = async () => {
    if (!user) return 0;
    const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
    const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      return docData.isRefresh || 0; // Fetch isRefresh from the most recent document in user_reddits
    } else {
      return 0; // Default value if no documents found
    }
  };

  useEffect(() => {
    if (!user) return;
    // Create a reference to the user's document
    const userDocRef = doc(db, "users", user.uid);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          // Check if redditLoading is false
          if (data.redditLoading === false) {
            fetchLatestRedditData();
          }
        }
      },
      (error) => {
        console.error("Error listening to document:", error);
      }
    );
    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, [user]);


  
  const handleRefresh = async (cleanedTopics) => {
    setRedditLoading(true);

    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update the "redditLoading" field to true
      await updateDoc(userDocRef, {
        redditLoading: true,
      });
    }

    if (!user) {
      setRedditLoading(false);
      throw new Error("User is not authenticated.");
    }

    const isRefreshCount = await fetchIsRefreshCount();
    setIsRefreshCount(isRefreshCount);

    const userPlan = plan;

    const planLimits = {
      free: 10,
      Starter: 20,
      Growth: 50,
      Scale: 80,
    };

    if (isRefreshCount >= planLimits[userPlan]) {
      alert(`You have reached the refresh limit for your ${userPlan} plan.`);
      setRedditLoading(false);
      return;
    }

    setShowInfoButton(true);

    const userId = user.uid;
    const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
    const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    const latestAnalysisRef = doc(userRedditsRef, "latest_analysis");

    const docSnap = await getDoc(latestAnalysisRef);
    if (!docSnap.exists()) {
      console.log("hi")
      // If the document doesn't exist, create it
      await setDoc(latestAnalysisRef, {
        subreddits: cleanedTopics,
      });
    } else {
      console.log("not hi")
      // If the document exists, update it
    }
    console.log("setting feed setting to true");
    setFeedSetting(true);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      setSubreddits(docData.subreddits || []);

      const response = await axios.post(
        "https://us-central1-topfeed-123.cloudfunctions.net/feedAPI/api/reddit/process",

        {
          subreddits: docData.subreddits,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },

          timeout: 240000, // Timeout in milliseconds (5000ms = 5 seconds)
        }
      );

      if (response.status !== 200) {
        setRedditLoading(false);
        throw new Error("Failed to fetch data from server");
      }

      console.log("Received response from API:", response.data);

      await fetchLatestRedditData();
    } else {
      const response = await axios.post(
        "https://us-central1-topfeed-123.cloudfunctions.net/feedAPI/api/reddit/process",
        {
          subreddits: cleanedTopics,
          userId,
        },
        {
          timeout: 240000, // Timeout in milliseconds (5000ms = 5 seconds)
        }
      );

      if (response.status !== 200) {
        // setRedditLoading(false);
        throw new Error("Failed to fetch data from server");
      }

      console.log("Received response from API:", response.data);

      await fetchLatestRedditData();
    }
  };

  const fetchLatestRedditData = async () => {
    setRedditLoading(true);
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
        const isRefreshCount = await fetchIsRefreshCount();
        setIsRefreshCount(isRefreshCount);
        const planLimits = {
          free: 10,
          Starter: 20,
          Growth: 50,
          Scale: 80,
        };

        setRemainingRefreshes(plan ? planLimits[plan] - isRefreshCount : 0);

        console.log("sfnskfns", remainingRefreshes);

        setRedditData(analysisData);
      } else {
        console.log("No documents found in user_reddits");
        setRedditData([]);
      }
    } catch (err) {
      console.error("Error fetching Reddit data:", err);
      setError(err.message);
    } finally {
      setRedditLoading(false);
    }
  };

  useEffect(() => {
    // Create an async function inside useEffect
    const checkLoadingStatus = async () => {
      if (!user || !plan) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.redditLoading === true) {
            setLoaderInitial(false);
            setRedditLoading(true);
          } else {
            await fetchLatestRedditData();
            setLoaderInitial(false);
          }
        }
      } catch (error) {
        console.error("Error checking loading status:", error);
      }
    };

    checkLoadingStatus();
  }, [user, plan]); // Dependencies stay the same

  useEffect(() => {
    import("ldrs").then(({ cardio }) => {
      cardio.register();
    });
    import("ldrs").then(({ lineSpinner }) => {
      lineSpinner.register();
    });
  }, []);
  const filteredData = Array.isArray(redditData)
    ? redditData.filter(
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
      )
    : [];

  // useEffect(() => {
  //   if (redditDataFetch) {
  //     setRedditLoading(redditDataFetch);
  //   } else {
  //     fetchLatestRedditData();
  //   }
  // }, [redditDataFetch]);

  const handleReset = async () => {
    try {
      // Get the latest reddit document
      const userRedditsRef = collection(db, "users", user.uid, "user_reddits");
      const q = query(userRedditsRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docData = querySnapshot.docs[0].data();
        
        // Update isRefresh count
        const newRefreshCount = (docData.isRefresh || 0) - 1;
        await updateDoc(docRef, {
          isRefresh: Math.max(0, newRefreshCount) // Ensure it doesn't go below 0
        });
      }

      // Update redditLoading status
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        redditLoading: false
      });
    } catch (error) {
      console.error("Error resetting loader:", error);
    }
  };

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
  if (redditLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[90%]">
      <div className="mb-8 text-center">
        <button 
          onClick={handleReset}
          className="text-blue-600 hover:text-blue-800 underline text-sm font-kumbh-sans-medium"
        >
          Stuck in the loader for more than 3-4 mins? Click here to reset
        </button>
      </div>
      <div className="text-center">
        <div>
          <l-cardio size="80" stroke="4" speed="2" color="black"></l-cardio>
        </div>
        <div>We are generating your feed!</div>
      </div>
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
        <div className=" w-full flex justify-items-center md:justify-end mb-6 items-center gap-x-4 ">
          <div className="relative flex items-center">
            <IoSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search in feed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border border-[#CECECE] text-sm rounded-lg px-4 py-2"
            />
          </div>
          <button
            className="bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg ml-4"
            onClick={() => handleRefresh(null)}
          >
            <div className="hidden text-sm md:block font-kumbh-sans-medium">
              Update Instant Refresh
            </div>
            <div className="md:hidden font-kumbh-sans-medium">Refresh</div>
          </button>

          <div className="relative inline-block">
            <button
              className="text-gray-500 hover:text-blue-500"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <AiOutlineInfoCircle size={24} />
            </button>
            {hovered && (
              <div className="absolute bg-gray-800 text-white text-sm rounded p-2 shadow-lg top-0 left-5 z-10 whitespace-nowrap transform -translate-x-full -translate-y-full font-kumbh-sans-medium">
                {remainingRefreshes} refreshes left
              </div>
            )}
          </div>
        </div>

      <RedditMasonryLayout filteredRedditData={filteredData} />
    </div>
  );
};

export default RedditComponent;
