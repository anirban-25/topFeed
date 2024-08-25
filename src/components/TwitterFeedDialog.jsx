import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { X, Loader2 } from "lucide-react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { storeDataInFirestore } from "@/utils/storeTwitterData";

const TwitterFeedDialog = ({ size, handleOpen, onFeedCreated }) => {
  const [newTopic, setNewTopic] = useState("");
  const [twitterUrls, setTwitterUrls] = useState([""]);
  const [errors, setErrors] = useState([]);
  const [saveStatus, setSaveStatus] = useState([]);
  const [loading, setLoading] = useState([]);
  const [topicError, setTopicError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [existingFeedId, setExistingFeedId] = useState(null);
  const [isTopicSaved, setIsTopicSaved] = useState(false);
  const user = auth.currentUser;
      
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthChecked(true);
      if (user) {
        fetchLastTweetFeed(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSaveStatus(Array(twitterUrls.length).fill(null));
    setErrors(Array(twitterUrls.length).fill(""));
    setLoading(Array(twitterUrls.length).fill(false));
  }, [twitterUrls.length]);

  const fetchLastTweetFeed = async (user) => {
    try {
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      const tweetFeedRef = collection(db, "users", user.uid, "tweet_feed");
      const q = query(tweetFeedRef, orderBy("createdAt", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastFeed = querySnapshot.docs[0].data();
        const lastFeedId = querySnapshot.docs[0].id;
        setNewTopic(lastFeed.topic || "");
        setTwitterUrls(lastFeed.twitterUrls || [""]);
        setExistingFeedId(lastFeedId);
        setIsTopicSaved(true);
        setSaveStatus(Array(lastFeed.twitterUrls.length).fill("success"));
        console.log(lastFeed.twitterUrls, lastFeed.topic)
      }
    } catch (error) {
      console.error("Error fetching last tweet feed:", error);
    }
  };

  const handleInputChange = (index, value) => {
    const newUrls = [...twitterUrls];
    newUrls[index] = value;
    setTwitterUrls(newUrls);

    const newSaveStatus = [...saveStatus];
    newSaveStatus[index] = null;
    setSaveStatus(newSaveStatus);
    const newLoading = [...loading];
    newLoading[index] = false;
    setLoading(newLoading);

    const newErrors = [...errors];
    newErrors[index] = "";
    setErrors(newErrors);
  };

  const handleTopicChange = (value) => {
    setNewTopic(value);
    setTopicError("");
    setIsTopicSaved(false);
  };

  const addMore = () => {
    setTwitterUrls([...twitterUrls, ""]);
    setSaveStatus([...saveStatus, null]);
  };

  const removeInput = (index) => {
    const newUrls = twitterUrls.filter((_, i) => i !== index);
    setTwitterUrls(newUrls);
    const newSaveStatus = saveStatus.filter((_, i) => i !== index);
    setSaveStatus(newSaveStatus);
  };

  const handleSave = async (index) => {
    const newLoading = [...loading];
    newLoading[index] = true;
    setLoading(newLoading);

    try {
      const response = await fetch("/api/checktwitterlinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ twitter_url: twitterUrls[index] }),
      });

      const data = await response.json();
      if (data.message === "success") {
        const newSaveStatus = [...saveStatus];
        newSaveStatus[index] = "success";
        setSaveStatus(newSaveStatus);

        const newErrors = [...errors];
        newErrors[index] = "";
        setErrors(newErrors);
      } else {
        const newSaveStatus = [...saveStatus];
        newSaveStatus[index] = "error";
        setSaveStatus(newSaveStatus);

        const newErrors = [...errors];
        newErrors[index] = data.error || "An error occurred";
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error saving URL:", error);
      const newSaveStatus = [...saveStatus];
      newSaveStatus[index] = "error";
      setSaveStatus(newSaveStatus);

      const newErrors = [...errors];
      newErrors[index] = "Network error occurred";
      setErrors(newErrors);
    } finally {
      const newLoading = [...loading];
      newLoading[index] = false;
      setLoading(newLoading);
    }
  };

  const handleSaveTopic = () => {
    if (newTopic.trim()) {
      setIsTopicSaved(true);
      setTopicError("");
    } else {
      setTopicError("Please enter a topic before saving.");
    }
  };

  const handleSubmit = async () => {
    setTopicError("");
    setErrors(Array(twitterUrls.length).fill(""));

    if (!newTopic.trim() || !isTopicSaved) {
      setTopicError("Please enter and save a topic for the feed.");
      return;
    }

    if (twitterUrls.length === 0) {
      alert("Please add at least one Twitter account.");
      return;
    }

    const emptyUrlIndex = twitterUrls.findIndex((url) => !url.trim());
    if (emptyUrlIndex !== -1) {
      const newErrors = [...errors];
      newErrors[emptyUrlIndex] =
        "Please enter a Twitter URL or remove this field.";
      setErrors(newErrors);
      return;
    }

    const allUrlsSaved = saveStatus.every((status) => status === "success");
    if (!allUrlsSaved) {
      alert("Please save all Twitter accounts before saving the feed.");
      return;
    }

    try {
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      if (existingFeedId) {
        await updateDoc(
          doc(db, "users", user.uid, "tweet_feed", existingFeedId),
          {
            topic: newTopic,
            twitterUrls: twitterUrls,
            updatedAt: new Date(),
          }
        );
        console.log("Document updated with ID: ", existingFeedId);
      } else {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "tweet_feed"),
          {
            topic: newTopic,
            twitterUrls: twitterUrls,
            createdAt: new Date(),
          }
        );
        console.log("New document written with ID: ", docRef.id);
        setExistingFeedId(docRef.id);
      }

      await processAndStoreTweets(user.uid, twitterUrls, newTopic);

      onFeedCreated();
      handleOpen(null);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the feed. Please try again.");
    }
  };

  const processAndStoreTweets = async (userId, urls, topic) => {
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ twitterUrls: urls, newTopic: topic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!data.result || !Array.isArray(data.result)) {
        console.error("Received data is not in the expected format:", data);
        return;
      }

      const tweetsArray = data.result;
      console.log("Tweets array:", tweetsArray);

      await storeDataInFirestore(tweetsArray, userId);
      console.log("Data stored in Firestore successfully for user:", userId);
    } catch (error) {
      console.error("Error processing and storing tweets:", error);
    }
  };

  

  return (
    <Dialog
      open={size === "lg"}
      size={size || "md"}
      handler={handleOpen}
      className="max-h-[80%] overflow-scroll"
    >
      <DialogHeader className="font-kumbh-sans-semibold text-xl text-[#0B0B0B]">
        {existingFeedId ? "Update Twitter Feed" : "Add New Twitter Feed"}
      </DialogHeader>
      <DialogBody>
        {!isAuthChecked ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="font-kumbh-sans-medium text-base text-[#0B0B0B]">
                Enter Topic
              </p>
              <p className="font-kumbh-sans-medium text-sm text-[#828282]">
                Try to be very specific for the best results
              </p>

              <div className="mt-4 relative">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newTopic}
                    className={`border w-[50%] rounded-lg p-2 shadow-md font-kumbh-sans-medium text-gray-800 ${
                      topicError ? "border-red-500" : "border-[#CECECE]"
                    }`}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    placeholder="Type here"
                  />

                  <Button
                    color="white"
                    className={`border ${
                      isTopicSaved
                        ? "border-green-500 text-green-500"
                        : "border-[#CECECE]"
                    }`}
                    onClick={handleSaveTopic}
                  >
                    {isTopicSaved ? "Topic Saved" : "Save Topic"}
                  </Button>
                </div>
                {topicError && (
                  <p className="mt-2 text-sm text-red-600">{topicError}</p>
                )}
              </div>
            </div>
            <div className="mt-10 text-[#0B0B0B] text-base">
              <div className="font-kumbh-sans-semibold">
                Daily feed auto refresh time
              </div>
              <div className="flex">
                <div className="flex items-center space-x-2 bg-[#FEF3F2] text-[#B42318] text-xs py-1 p-2 rounded-full border border-[#FECDCA] font-kumbh-sans-medium">
                  <div>
                    <IoIosInformationCircleOutline />
                  </div>
                  <div>
                    Upgrade to our PRO plan to unlock refresh time feature
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-lg mt-5">
              {twitterUrls.map((url, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-[#787878] font-kumbh-sans-medium mb-2">
                    Account {index + 1}
                  </label>
                  <div className="flex relative items-center">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder="https://twitter.com/example"
                      className={`w-full text-black px-3 py-2 pr-10 border ${
                        errors[index] ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button
                      className={`font-kumbh-sans-medium rounded-lg border py-2 px-4 ml-5 cursor-pointer hover:bg-gray-100 transition-all duration-150 ${
                        saveStatus[index] === "success"
                          ? "text-green-500 border-green-500"
                          : "text-[#146EF5] border-[#94BEFF]"
                      } ${
                        loading[index] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleSave(index)}
                      disabled={loading[index]}
                    >
                      {loading[index] ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : saveStatus[index] === "success" ? (
                        "Saved"
                      ) : (
                        "Save"
                      )}
                    </button>
                    {twitterUrls.length > 1 && (
                      <button
                        onClick={() => removeInput(index)}
                        className="absolute top-3 right-28 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <X color="gray" size={18} />
                      </button>
                    )}
                  </div>
                  {errors[index] && (
                    <p className="mt-2 text-sm text-red-600">{errors[index]}</p>
                  )}
                </div>
              ))}
              <div className="mt-4">
                <button
                  onClick={addMore}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  + Add More
                </button>
              </div>
            </div>
          </>
        )}
      </DialogBody>
      <DialogFooter className="space-x-5">
        <button
          className="cursor-pointer border px-4 py-1 rounded-md text-black font-kumbh-sans-semibold border-black"
          onClick={() => handleOpen(null)}
        >
          Cancel
        </button>
        <button
          className={`cursor-pointer border px-4 py-1 rounded-md font-kumbh-sans-semibold ${
            isTopicSaved &&
            twitterUrls.every((url) => url.trim() !== "") &&
            saveStatus.every((status) => status === "success")
              ? "bg-[#146EF5] text-white border-[#146EF5] hover:bg-[#0E5AD7]"
              : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={
            !isTopicSaved ||
            twitterUrls.some((url) => url.trim() === "") ||
            !saveStatus.every((status) => status === "success")
          }
        >
          {existingFeedId ? "Update Feed" : "Generate Feed"}
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default TwitterFeedDialog;
