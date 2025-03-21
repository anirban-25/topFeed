"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { db, auth } from "@/firebase";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppContext } from "@/contexts/AppContext";

const CreateFeedPopup = ({ open, handleOpen, handleSubmit }) => {
  const REDDIT_CLIENT_ID = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID;
  const REDDIT_CLIENT_SECRET = process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET;

  const { setRedditDataFetch, feedSetting } = useAppContext();
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isAddingTopic, setIsAddingTopic] = useState(false); // State to toggle input field

  const [user] = useAuthState(auth);
  const fetchLastUpdatedSubreddits = async () => {
    try {
      if (user) {
        // Directly reference the 'latest_analysis' document in the 'user_reddits' collection
        const latestAnalysisRef = doc(
          db,
          "users",
          user.uid,
          "user_reddits",
          "latest_analysis"
        );

        const retryFetch = async (retries = 5) => {
          const docSnapshot = await getDoc(latestAnalysisRef);

          if (docSnapshot.exists()) {
            const docData = docSnapshot.data();
            console.log(docData.subreddits);
            console.log("hey");
            setTopics(docData.subreddits || []);
          } else if (retries > 0) {
            console.log(`Retrying... (${5 - retries + 1})`);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
            await retryFetch(retries - 1);
          } else {
            console.log("No data found in 'latest_analysis' after 10 seconds");
          }
        };

        await retryFetch();
      }
    } catch (error) {
      console.error("Error fetching subreddits from 'latest_analysis':", error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchLastUpdatedSubreddits();
    }
  }, [user]);

  useEffect(() => {
    console.log(feedSetting);
    fetchLastUpdatedSubreddits();
  }, [feedSetting]);
  const getRedditAccessToken = async () => {
    const auth = Buffer.from(
      `${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`
    ).toString("base64");

    try {
      const response = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error("Error getting Reddit access token:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (newTopic) {
      const fetchSuggestions = async () => {
        try {
          // Get access token
          const accessToken = await getRedditAccessToken();

          // Use the access token to make the API request
          const response = await axios.get(
            `https://oauth.reddit.com/subreddits/search.json?q=${newTopic}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                // Removed User-Agent header since it causes browser warning
              },
            }
          );

          setSuggestions(
            response.data.data.children.map(
              (child) => child.data.display_name_prefixed
            )
          );
        } catch (error) {
          console.error("Error fetching subreddit suggestions:", error);
          setSuggestions([]); // Clear suggestions on error
        }
      };

      // Add debounce to prevent too many API calls
      const timeoutId = setTimeout(fetchSuggestions, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [newTopic]);

  const handleAddTopic = (suggestion) => {
    if (suggestion) {
      setTopics([...topics, suggestion]);
      setNewTopic("");
      setIsAddingTopic(false);
      console.log("Added topic:", suggestion);
    }
  };

  const cleanSubredditName = (name) => {
    return name.startsWith("r/") ? name.slice(2) : name;
  };

  const removeSubReddit = (topic) => {
    setTopics(topics.filter((t) => t !== topic));
    console.log("Removed topic:", topic);
  };

  const handleGenerateFeed = async () => {
    handleOpen(null);
    console.log(feedSetting);
    if (feedSetting) {
      const cleanedTopics = topics.map(cleanSubredditName);
      const user = auth.currentUser;
      const userId = user.uid;
      const latestAnalysisRef = doc(
        db,
        "users",
        userId,
        "user_reddits",
        "latest_analysis"
      );

      try {
        await updateDoc(latestAnalysisRef, {
          subreddits: cleanedTopics,
        });

        setLoading(false);
        console.log("Document successfully updated");
      } catch (error) {
        console.error("Error updating document: ", error);
        setLoading(false);
      }
    } else {
      setError(null);
      setRedditDataFetch(true);
      setLoading(true);
      try {
        const cleanedTopics = topics.map(cleanSubredditName);
        await handleSubmit(cleanedTopics);
        await fetchLastUpdatedSubreddits();
      } catch (err) {
        console.error("Error during feed generation:", err);
        setError("An error occurred while processing your request.");
      } finally {
        setRedditDataFetch(false);
        setLoading(false);
        await fetchLastUpdatedSubreddits();
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} size="lg" handler={handleOpen}>
      <DialogHeader className="font-kumbh-sans-semibold text-xl text-[#0B0B0B]">
        Add New Reddit Feed
      </DialogHeader>
      <DialogBody>
        <div className="mb-4">
          <p className="font-kumbh-sans-medium text-base text-[#0B0B0B]">
            Subreddits
          </p>
          <p className="font-kumbh-sans-light text-sm text-[#0B0B0B]">
            TopFeed will track these subreddits and analyze new posts against
            your description to help you identify potential leads.
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <div
                key={index}
                value={topic}
                className="mr-2 mt-3 flex bg-[#F5F9FF] border border-[#94BEFF] rounded-full text-sm text-[#146EF5] font-kumbh-sans-medium px-3 items-center space-x-2 py-1"
              >
                <div>{topic}</div>
                <div className="cursor-pointer">
                  <RxCross2 onClick={() => removeSubReddit(topic)} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 relative">
            <div className="flex space-x-3">
              <Button
                color="white"
                onClick={() => setIsAddingTopic(!isAddingTopic)} // Toggle input field
                className="border border-[#CECECE]"
              >
                + Add SubReddit
              </Button>
              {isAddingTopic && ( // Render input field conditionally
                <input
                  type="text"
                  value={newTopic}
                  className="border w-[50%] rounded-lg p-2 shadow-md font-kumbh-sans-medium text-gray-800 border-[#CECECE]"
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Type here"
                />
              )}
            </div>
            {suggestions.length > 0 && newTopic && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleAddTopic(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-10 text-[#0B0B0B] text-base">
          <div className="font-kumbh-sans-semibold">
            Daily feed auto refresh
          </div>
          <div className="flex">
            <div className="flex items-center space-x-2 bg-[#FEF3F2] text-[#B42318] text-xs py-1 p-2 rounded-full border border-[#FECDCA] font-kumbh-sans-medium">
              <div>
                <IoIosInformationCircleOutline />
              </div>
              <div>Upgrade to our PRO plan to unlock daily auto refresh</div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-4">
        <Button
          color="white"
          text="black"
          onClick={() => handleOpen(null)}
          className="border border-[#CECECE]"
        >
          Cancel
        </Button>
        <Button color="blue" onClick={handleGenerateFeed}>
          {feedSetting ? "Update Feed" : "Generate Feed"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CreateFeedPopup;
