import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Script from "next/script";
import { RefreshCw, ChevronDown } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import AuthorSelectionDropdown from "./AuthorSelectionDropdown";
import RelevanceSelector from "./RelevanceSelector";
import TwitterFeedDialog from "./TwitterFeedDialog";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import MasonryLayout from "./MasonryLayout";

const TwitterComponent = () => {
  const router = useRouter();
  const { twitterLoader, setTwitterLoader } = useAppContext();
  const [loaderTwitter, setLoaderTwitter] = useState(false);
  const [user] = useAuthState(auth);
  const [tweets, setTweets] = useState([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const authorDropdownRef = useRef(null);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedRelevance, setSelectedRelevance] = useState([
    "high",
    "medium",
    "low",
  ]);
  const [size, setSize] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState({});
  const prevSelectedAuthorsRef = useRef({});

  const loadTwitterWidgets = useCallback(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  useEffect(() => {
    fetchUserTweets();
  }, [user]);

  useEffect(() => {
    console.log("FILTERED CHanged........");
    loadTwitterWidgets();
  }, [filteredTweets]);

  useEffect(() => {
    console.log("Tweets Changed........");
  }, [tweets]);

  useEffect(() => {
    if (scriptLoaded) {
      loadTwitterWidgets();
    }
  }, [tweets, scriptLoaded, loadTwitterWidgets]);

  const deepEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };

  // Existing useEffect hook that filters tweets
  useEffect(() => {
    // Filter only if there's an actual change in selectedAuthors or selectedRelevance
    if (
      !deepEqual(selectedAuthors, prevSelectedAuthorsRef.current) ||
      selectedRelevance !== prevSelectedAuthorsRef.currentRelevance
    ) {
      prevSelectedAuthorsRef.current = { ...selectedAuthors };
      prevSelectedAuthorsRef.currentRelevance = selectedRelevance;

      const filtered = tweets.filter(
        (tweet) =>
          selectedRelevance.includes(tweet.relevancy.toLowerCase()) &&
          selectedAuthors[tweet.authors[0].name]
      );

      setFilteredTweets(filtered);
      loadTwitterWidgets();
    }
  }, [selectedAuthors, selectedRelevance, tweets, loadTwitterWidgets]);

  const handleAuthorDropdownToggle = () => {
    setShowAuthorDropdown(!showAuthorDropdown);
    // No state change related to authors here
    loadTwitterWidgets();
  };

  // Toggle author selection state only when there's an actual change
  const toggleAuthor = (author) => {
    const newSelectedAuthors = {
      ...selectedAuthors,
      [author]: !selectedAuthors[author],
    };

    // Update state only if there's a real change
    if (!deepEqual(newSelectedAuthors, selectedAuthors)) {
      setSelectedAuthors(newSelectedAuthors);
    }
  };

  const fetchUserTweets = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    try {
      const userTweetsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "user_tweets"
      );
      const userTweetsQuery = query(userTweetsCollectionRef, // Order by timestamp in descending order
      limit(50));
      const querySnapshot = await getDocs(userTweetsQuery);

      const tweetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTweets(tweetsData);
      setFilteredTweets(tweetsData);

      const uniqueAuthors = [
        ...new Set(tweetsData.map((tweet) => tweet.authors[0].name)),
      ];
      setAuthors(uniqueAuthors);

      const initialSelectedAuthors = Object.fromEntries(
        uniqueAuthors.map((author) => [author, true])
      );
      setSelectedAuthors((prev) => {
        prevSelectedAuthorsRef.current = initialSelectedAuthors; // Initialize previous authors on first load
        return initialSelectedAuthors;
      });
    } catch (error) {
      console.error("Error fetching user tweets:", error);
    } finally {
      setLoading(false);

      setLoaderTwitter(twitterLoader);
    }
  };
  useEffect(() => {
    import("ldrs").then(({ cardio }) => {
      cardio.register();
    });
    import("ldrs").then(({ lineSpinner }) => {
      lineSpinner.register();
    });
  }, []);

  useEffect(() => {
    if (tweets.length > 0 && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [tweets]);

  useEffect(() => {
    setFilteredTweets(
      tweets.filter(
        (tweet) =>
          selectedRelevance.includes(tweet.relevancy.toLowerCase()) &&
          selectedAuthors[tweet.authors[0].name]
      )
    );
  }, [selectedRelevance, selectedAuthors, tweets]);
  useEffect(() => {
    if (twitterLoader) {
      setLoaderTwitter(twitterLoader);
    }
    fetchUserTweets();
    setLoaderTwitter(twitterLoader);
  }, [twitterLoader]);

  const handleOpen = (value) => setSize(value);

  const handleRelevanceChange = (newRelevance) => {
    setSelectedRelevance(newRelevance);
    loadTwitterWidgets();
  };
  const handleRefresh = () => {
    router.refresh();
  };
  // const toggleAuthor = (author) => {
  //   const newSelectedAuthors = {
  //     ...selectedAuthors,
  //     [author]: !selectedAuthors[author],
  //   };
  //   if (!deepEqual(newSelectedAuthors, selectedAuthors)) {
  //     setSelectedAuthors(newSelectedAuthors);
  //   }
  // };

  const clearAllFilters = () => {
    const resetAuthors = Object.fromEntries(
      Object.keys(selectedAuthors).map((author) => [author, true])
    );
    setSelectedAuthors(resetAuthors);
  };

  const getRelevancyColor = (relevancy) => {
    switch (relevancy.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const handleFeedCreated = () => {
    fetchUserTweets();
  };

  const handleImageError = (e) => {
    e.target.src = "/images/fallback.png"; // Fallback image
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  if (loading) {
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

  if (loaderTwitter) {
    return (
      <div className="flex items-center justify-center min-h-[90%]">
        <div className=" text-center">
          <div>
            <l-cardio size="80" stroke="4" speed="2" color="black"></l-cardio>{" "}
          </div>
          <div>Give us 2 minutes to prepare your feed</div>
        </div>
        {/* Loader content */}
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
          loadTwitterWidgets();
        }}
      />
      <div>
        {tweets.length === 0 ? (
          <div className="font-kumbh-sans-medium flex flex-col items-center justify-center h-full p-8">
            <Image
              src="/images/twitter.png"
              alt="Twitter Feed"
              width={457}
              height={270}
            />
            <div className="text-center mb-8 mt-8">
              <h1 className="font-kumbh-sans-bold text-3xl font-bold mb-4">
                Create your Twitter TopFeed
              </h1>
              <div className="max-w-lg mx-auto">
                <p className="font-kumbh-sans-regular text-gray-600 mb-8">
                  Start collecting and analyzing tweets from your favorite
                  accounts.
                </p>
              </div>
              <button
                className="font-kumbh-sans-medium bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
                onClick={() => handleOpen("lg")}
              >
                + Create New Feed
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5">
            <div className="w-full p-4 mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-kumbh-sans-medium text-[#8D8D8D]">
                  Search Results ({filteredTweets.length})
                </h2>
                <button
                  className="flex mt-2 items-center px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={16} className="mr-1" />
                  Refresh
                </button>
              </div>
              <div className="flex space-x-2 relative" ref={authorDropdownRef}>
                <RelevanceSelector
                  tweets={tweets}
                  onRelevanceChange={handleRelevanceChange}
                />
                <button
                  className="px-4 py-2 text-sm font-medium text-black bg-white border border-[#CECECE] rounded-md hover:bg-gray-50 focus:outline-none"
                  onClick={handleAuthorDropdownToggle}
                >
                  <span className="flex items-center">
                    <BsPeople color="black" size={17} className="mr-2" />
                    Twitter Accounts
                    <ChevronDown size={16} className="ml-1" />
                  </span>
                </button>
                {showAuthorDropdown && (
                  <AuthorSelectionDropdown
                    authors={authors}
                    selectedAuthors={selectedAuthors}
                    onToggleAuthor={toggleAuthor}
                    onClose={() => setShowAuthorDropdown(false)}
                  />
                )}
              </div>
            </div>
            <MasonryLayout
              filteredTweets={filteredTweets}
              getRelevancyColor={getRelevancyColor}
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
          </div>
        )}
        <TwitterFeedDialog
          size={size}
          handleOpen={handleOpen}
          onFeedCreated={handleFeedCreated}
        />
      </div>
    </>
  );
};

export default TwitterComponent;
