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
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { storeDataInFirestore } from "@/utils/storeTwitterData";
import { useAppContext } from "@/contexts/AppContext";

const TwitterFeedDialog = ({ size, handleOpen, onFeedCreated }) => {
  const { twitterLoader, setTwitterLoader } = useAppContext();
  const [newTopic, setNewTopic] = useState("");
  
  const [tags, setTags] = useState([]);
  
  const [inputValue, setInputValue] = useState("");
  const [twitterUrls, setTwitterUrls] = useState([""]);
  const [errors, setErrors] = useState([]);
  const [saveStatus, setSaveStatus] = useState([]);
  const [loading, setLoading] = useState([]);
  const [topicError, setTopicError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [existingFeedId, setExistingFeedId] = useState(null);
  const [isTopicSaved, setIsTopicSaved] = useState(false);

  const [userPlan, setUserPlan] = useState("free");
  const [maxAccounts, setMaxAccounts] = useState(3);

  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthChecked(true);
      if (user) {
        fetchLastTweetFeed(user);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    fetchLastTweetFeed(user);
  }, [user, twitterLoader]);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const plan = userDoc.data().plan;
          setUserPlan(plan);
          setMaxAccounts(getMaxAccountsForPlan(plan));
        }
      }
    };

    fetchUserPlan();
  }, [user]);

  const getMaxTagsForPlan = (plan) => {
    switch (plan) {
      case "free":
      case "starter":
        return 3;
      case "Growth":
      case "Scale":
        return 5;
      case "Test":
        return 99;
      default:
        return 3;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const maxTags = getMaxTagsForPlan(userPlan);
      if (tags.length < maxTags) {
        if (!tags.includes(inputValue.trim())) {
          setTags([...tags, inputValue.trim()]);
          setInputValue("");
          setIsTopicSaved(false);
        }
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setIsTopicSaved(false);
  };

  const handleSaveTopic = () => {
    if (tags.length > 0) {
      setIsTopicSaved(true);
      setTopicError("");
    } else {
      setTopicError("Please add at least one tag before saving.");
    }
  };
  const getMaxAccountsForPlan = (plan) => {
    console.log("plan is " + plan);
    switch (plan) {
      case "free":
        return 3;
      case "starter":
        return 5;
      case "Growth":
        return 7;
      case "Scale":
        return 10;
      case "Test":
        return 99;
      default:
        console.log("i am defolt");
        return 3;
    }
  };

  const fetchLastTweetFeed = async (user) => {
    try {
      if (!user) return;

      const tweetFeedRef = collection(db, "users", user.uid, "tweet_feed");
      const q = query(tweetFeedRef, orderBy("createdAt", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastFeed = querySnapshot.docs[0].data();
        const lastFeedId = querySnapshot.docs[0].id;
        setTags(lastFeed.tags || []);
        setTwitterUrls(lastFeed.twitterUrls || [""]);
        setExistingFeedId(lastFeedId);
        setIsTopicSaved(true);
        setSaveStatus(Array(lastFeed.twitterUrls.length).fill("success"));
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

  const addInput = () => {
    if (twitterUrls.length < maxAccounts) {
      setTwitterUrls([...twitterUrls, ""]);
      setErrors([...errors, ""]);
      setSaveStatus([...saveStatus, null]);
      setLoading([...loading, false]);
    }
  };

  const removeInput = (index) => {
    const newUrls = [...twitterUrls];
    const newSaveStatus = [...saveStatus];
    const newLoading = [...loading];
    const newErrors = [...errors];

    newUrls.splice(index, 1);
    newSaveStatus.splice(index, 1);
    newLoading.splice(index, 1);
    newErrors.splice(index, 1);

    setTwitterUrls(newUrls);
    setSaveStatus(newSaveStatus);
    setLoading(newLoading);
    setErrors(newErrors);
  };

  const handleSave = async (index) => {
    setLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;
      return newLoading;
    });

    try {
      const response = await fetch("/api/checktwitterlinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          twitter_url: twitterUrls[index],
        }),
      });

      const data = await response.json();

      setSaveStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = data.status === 200 ? "success" : "error";
        return newStatus;
      });
    } catch (error) {
      setSaveStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = "error";
        return newStatus;
      });
    } finally {
      setLoading((prevLoading) => {
        const newLoading = [...prevLoading];
        newLoading[index] = false;
        return newLoading;
      });
    }
  };
  const handleTopicChange = (value) => {
    setNewTopic(value);
    setTopicError("");
    setIsTopicSaved(false);
  };

  const handleSubmit = async () => {
    setTopicError("");
    setErrors(Array(twitterUrls.length).fill(""));

    if (tags.length === 0) {
      setTopicError("Please add and save at least one tag.");
      return;
    }

    if (twitterUrls.length === 0) {
      alert("Please add at least one Twitter account.");
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

      // Convert tags array to comma-separated string for API
      const topicString = tags.join(", ");

      if (existingFeedId) {
        await updateDoc(
          doc(db, "users", user.uid, "tweet_feed", existingFeedId),
          {
            tags: tags,
            twitterUrls: twitterUrls,
            updatedAt: new Date(),
          }
        );
      } else {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "tweet_feed"),
          {
            tags: tags,
            twitterUrls: twitterUrls,
            createdAt: new Date(),
          }
        );
        setExistingFeedId(docRef.id);
        await processAndStoreTweets(user.uid, twitterUrls, topicString);
      }

      handleOpen(null);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the feed. Please try again.");
    }
  };

  const processAndStoreTweets = async (userId, urls, topic) => {
    localStorage.setItem("TwitterLoader", true);
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update the "redditLoading" field to true
      await updateDoc(userDocRef, {
        twitterLoading: true,
      });
    }
    setTwitterLoader(true);
    onFeedCreated();
    handleOpen(null);
    try {
      const response = await fetch(
        "https://us-central1-topfeed-123.cloudfunctions.net/feedAPI/api/feed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            twitterUrls: urls,
            newTopic: topic,
            userId: userId,
          }),
        }
      );

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

      // await storeDataInFirestore(tweetsArray, userId);
    } catch (error) {
      console.error("Error processing and storing tweets:", error);
    } finally {
      setTwitterLoader(false);
      localStorage.setItem("TwitterLoader", false);
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
                Enter Topics
              </p>
              <p className="font-kumbh-sans-medium text-sm text-[#828282]">
                Press Enter after each topic (Max {getMaxTagsForPlan(userPlan)}{" "}
                tags)
              </p>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span className="mr-1">{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`border w-[50%] rounded-lg p-2 shadow-md font-kumbh-sans-medium text-gray-800 ${
                      topicError ? "border-red-500" : "border-[#CECECE]"
                    }`}
                    placeholder="Type and press Enter"
                    disabled={tags.length >= getMaxTagsForPlan(userPlan)}
                  />

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
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Twitter Accounts ({twitterUrls.length}/{maxAccounts})
                </h2>
                {twitterUrls.map((url, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-[#787878] font-kumbh-sans-medium mb-2">
                      Account {index + 1}
                    </label>
                    <div className="flex relative items-center">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
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
                    {saveStatus[index] === "error" && (
                      <p className="mt-2 text-sm text-red-600">
                        Error proccessing the link
                      </p>
                    )}
                  </div>
                ))}
                {twitterUrls.length < maxAccounts && (
                  <button
                    onClick={addInput}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Add Another Account
                  </button>
                )}
                {twitterUrls.length >= maxAccounts && (
                  <p className="mt-4 text-sm text-red-600">
                    You&apos;ve reached the maximum number of accounts for your{" "}
                    {userPlan} plan.
                  </p>
                )}
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
             
            twitterUrls.every((url) => url.trim() !== "") &&
            saveStatus.every((status) => status === "success")
              ? "bg-[#146EF5] text-white border-[#146EF5] hover:bg-[#0E5AD7]"
              : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
          }`}
          onClick={handleSubmit}
          disabled={
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
