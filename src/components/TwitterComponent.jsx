import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Script from "next/script";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  RefreshCw,
  Check,
  X,
  Search,
} from "lucide-react";
import { BsPeople } from "react-icons/bs";
const AuthorSelectionDropdown = ({
  authors,
  selectedAuthors,
  onToggleAuthor,
  onClose,
  onClearFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAuthors = authors.filter((author) =>
    author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute z-10 mt-2 w-72 bg-white rounded-md shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Twitter Accounts</h2>
          <button onClick={onClearFilters} className="text-red-500 text-sm">
            Clear All Filters
          </button>
        </div>
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search here"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredAuthors.map((author) => (
            <div key={author} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={author}
                checked={selectedAuthors[author]}
                onChange={() => onToggleAuthor(author)}
                className="mr-2"
              />
              <label htmlFor={author} className="flex-grow">
                {author}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RelevanceSelector = ({ tweets, onRelevanceChange }) => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRelevance, setSelectedRelevance] = useState([
    { label: "High Relevancy", value: "high", selected: true },
    { label: "Medium Relevancy", value: "medium", selected: true },
    { label: "Low Relevancy", value: "low", selected: true },
  ]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleRelevance = (index) => {
    const updatedRelevance = selectedRelevance.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    );
    setSelectedRelevance(updatedRelevance);
    onRelevanceChange(
      updatedRelevance.filter((item) => item.selected).map((item) => item.value)
    );
  };

  const getRelevanceCount = (relevance) => {
    return tweets.filter((tweet) => tweet.relevancy.toLowerCase() === relevance)
      .length;
  };

  const selectedCount = selectedRelevance.filter(
    (item) => item.selected
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-sm font-kumbh-sans-medium text-black bg-white border border-[#CECECE] rounded-md hover:bg-gray-50 focus:outline-none"
      >
        <span className="flex items-center">
          <Image
            src="/images/relevancy-icon.png"
            height={15}
            width={15}
            className="mr-2"
            alt="relevancy-icon"
          />
          Relevance
          {selectedCount > 0 && selectedCount < 3 && (
            <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
              {selectedCount}
            </span>
          )}
          <ChevronDown size={16} color="gray" className="ml-1" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {selectedRelevance.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleRelevance(index)}
              >
                <div
                  className={`w-4 h-4 mr-2 border rounded ${
                    item.selected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {item.selected && <Check size={12} color="white" />}
                </div>
                <span className="flex-grow">{item.label}</span>
                <span className="text-gray-500">
                  {getRelevanceCount(item.value).toString().padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TwitterComponent = () => {
  const [user] = useAuthState(auth);
  const [tweets, setTweets] = useState([]);

  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const authorDropdownRef = useRef(null);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRelevance, setSelectedRelevance] = useState([
    "high",
    "medium",
    "low",
  ]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState({});
  const [showAuthorPopup, setShowAuthorPopup] = useState(false);

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

  useEffect(() => {
    const fetchUserTweets = async () => {
      if (!user) {
        console.error("No user is logged in.");
        setLoading(false);
        return;
      }

      try {
        const userTweetsCollectionRef = collection(
          db,
          "tweets",
          user.uid,
          "user_tweets"
        );
        const userTweetsQuery = query(userTweetsCollectionRef);
        const querySnapshot = await getDocs(userTweetsQuery);

        const tweetsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTweets(tweetsData);
        setFilteredTweets(tweetsData);

        // Extract unique authors
        const uniqueAuthors = [
          ...new Set(tweetsData.map((tweet) => tweet.authors[0].name)),
        ];
        setAuthors(uniqueAuthors);

        // Initialize all authors as selected
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

  const handleRelevanceChange = (newRelevance) => {
    setSelectedRelevance(newRelevance);
  };

  const toggleAuthor = (author) => {
    setSelectedAuthors((prev) => ({
      ...prev,
      [author]: !prev[author],
    }));
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
        {!tweets.length > 0 ? (
          <div className="font-kumbh-sans-Medium flex flex-col items-center justify-center h-full p-8">
            <Image
              src="/images/twitter.png"
              alt="Reddit Feed"
              width={457}
              height={270}
            />
            <div className="text-center mb-8 mt-8">
              <h1 className="font-kumbh-sans-Bold text-3xl font-bold mb-4">
                Create your Twitter TopFeed
              </h1>
              <div className="max-w-lg mx-auto">
                <p className="font-kumbh-sans-Regular text-gray-600 mb-8">
                  Lorem ipsum dolor sit amet consectetur. Cras est ornare
                  rhoncus massa nunc ornare purus aliquet massa.
                </p>
              </div>
              <button className="font-kumbh-sans-Medium bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
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
                  onClick={() => console.log("Refresh clicked")}
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
      </div>
    </>
  );
};

export default TwitterComponent;
