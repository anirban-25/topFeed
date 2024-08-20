import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Script from "next/script";
import { RefreshCw, ChevronDown, AlertCircle, CheckCircle } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import AuthorSelectionDropdown from "./AuthorSelectionDropdown";
import RelevanceSelector from "./RelevanceSelector";
import TwitterFeedDialog from "./TwitterFeedDialog";

const TwitterComponent = () => {
  const [user] = useAuthState(auth);
  const [tweets, setTweets] = useState([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const authorDropdownRef = useRef(null);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRelevance, setSelectedRelevance] = useState(["high", "medium", "low"]);
  const [size, setSize] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState({});

  const fetchUserTweets = async () => {
    if (!user) {
      console.error("No user is logged in.");
      setLoading(false);
      return;
    }

    try {
      const userTweetsCollectionRef = collection(db, "users", user.uid, "user_tweets");
      const userTweetsQuery = query(userTweetsCollectionRef);
      const querySnapshot = await getDocs(userTweetsQuery);

      const tweetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTweets(tweetsData);
      setFilteredTweets(tweetsData);

      const uniqueAuthors = [...new Set(tweetsData.map((tweet) => tweet.authors[0].name))];
      setAuthors(uniqueAuthors);

      const initialSelectedAuthors = Object.fromEntries(
        uniqueAuthors.map((author) => [author, true])
      );
      setSelectedAuthors(initialSelectedAuthors);
    } catch (error) {
      console.error("Error fetching user tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTweets();
  }, [user]);

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

  const handleOpen = (value) => setSize(value);

  const handleRelevanceChange = (newRelevance) => {
    setSelectedRelevance(newRelevance);
  };

  const toggleAuthor = (author) => {
    setSelectedAuthors((prev) => ({
      ...prev,
      [author]: !prev[author],
    }));
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (tweets.length > 0 && window.twttr) {
            window.twttr.widgets.load();
          }
        }}
      />
      <div>
        {tweets.length === 0 ? (
          <div className="font-kumbh-sans-Medium flex flex-col items-center justify-center h-full p-8">
            <Image
              src="/images/twitter.png"
              alt="Twitter Feed"
              width={457}
              height={270}
            />
            <div className="text-center mb-8 mt-8">
              <h1 className="font-kumbh-sans-Bold text-3xl font-bold mb-4">
                Create your Twitter TopFeed
              </h1>
              <div className="max-w-lg mx-auto">
                <p className="font-kumbh-sans-Regular text-gray-600 mb-8">
                  Start collecting and analyzing tweets from your favorite accounts.
                </p>
              </div>
              <button
                className="font-kumbh-sans-Medium bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
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
                  onClick={() => handleOpen("lg")}
                >
                  <RefreshCw size={16} className="mr-1" />
                  Create New Feed
                </button>
              </div>
              <div className="flex space-x-2 relative" ref={authorDropdownRef}>
                <RelevanceSelector
                  tweets={tweets}
                  onRelevanceChange={handleRelevanceChange}
                />
                <button
                  className="px-4 py-2 text-sm font-medium text-black bg-white border border-[#CECECE] rounded-md hover:bg-gray-50 focus:outline-none"
                  onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
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
                    onClearFilters={clearAllFilters}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="border border-gray-500 border-dotted rounded-lg overflow-hidden flex flex-col"
                >
                  <div
                    className={`${getRelevancyColor(
                      tweet.relevancy
                    )} text-white font-kumbh-sans-bold py-2 px-4 flex items-center justify-between`}
                  >
                    <span>Relevancy: {tweet.relevancy}</span>
                    {tweet.relevancy.toLowerCase() === "high" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <div
                      className="tweet-content"
                      dangerouslySetInnerHTML={{ __html: tweet.content_html }}
                    />
                  </div>
                </div>
              ))}
            </div>
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