import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
  limit,
} from "firebase/firestore";
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
  const [displayedTweetsCount, setDisplayedTweetsCount] = useState(50);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [allTweets, setAllTweets] = useState([]);
  const [loaderTwitter, setLoaderTwitter] = useState(false);
  const [user] = useAuthState(auth);
  const [tweets, setTweets] = useState([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const authorDropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
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

  const filteredTweets = useMemo(() => {
    if (filterLoading) return [];
    return tweets.filter(
      (tweet) =>
        selectedRelevance.includes(tweet.relevancy.toLowerCase()) &&
        selectedAuthors[tweet.authors[0].name]
    );
  }, [tweets, selectedRelevance, selectedAuthors, filterLoading]);

  const loadTwitterWidgets = useCallback(() => {
    if (window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  const initializeAuthors = useCallback(async () => {
    if (!user) return;

    try {
      const tweetFeedCollection = collection(
        db,
        "users",
        user.uid,
        "tweet_feed"
      );
      const tweetFeedSnapshot = await getDocs(tweetFeedCollection);

      if (!tweetFeedSnapshot.empty) {
        const tweetFeedDoc = tweetFeedSnapshot.docs[0];
        const twitterUrls = tweetFeedDoc.data().twitterUrls || [];

        const handles = twitterUrls.map((url) => {
          const username = url.split("/").pop();
          return `@${username}`;
        });

        const newSelectedAuthors = Object.fromEntries(
          handles.map((handle) => [handle, true])
        );

        setAuthors(handles);
        setSelectedAuthors(newSelectedAuthors);
      }
    } catch (error) {
      console.error("Error initializing authors:", error);
    }
  }, [user]);

  const fetchUserTweets = useCallback(async () => {
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
      const userTweetsQuery = query(userTweetsCollectionRef);
      const querySnapshot = await getDocs(userTweetsQuery);

      const tweetsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllTweets(tweetsData);
      setTweets(tweetsData.slice(0, displayedTweetsCount));
      setHasMoreTweets(tweetsData.length > displayedTweetsCount);
    } catch (error) {
      console.error("Error fetching user tweets:", error);
    } finally {
      setLoading(false);
      setLoaderTwitter(twitterLoader);
    }
  }, [user, twitterLoader, displayedTweetsCount]);

  const handleShowMore = useCallback(() => {
    const nextCount = displayedTweetsCount + 50;
    setDisplayedTweetsCount(nextCount);
    setTweets(allTweets.slice(0, nextCount));
    setHasMoreTweets(allTweets.length > nextCount);
  }, [displayedTweetsCount, allTweets]);

  useEffect(() => {
    initializeAuthors();
    fetchUserTweets();
  }, [initializeAuthors, fetchUserTweets]);

  useEffect(() => {
    loadTwitterWidgets();
  }, [filteredTweets, loadTwitterWidgets]);

  useEffect(() => {
    if (scriptLoaded) {
      loadTwitterWidgets();
    }
  }, [tweets, scriptLoaded, loadTwitterWidgets]);

  useEffect(() => {
    import("ldrs").then(({ cardio, lineSpinner }) => {
      cardio.register();
      lineSpinner.register();
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.twitterLoading === false) {
            setTwitterLoader(false);
            fetchUserTweets();
          }
        }
      },
      (error) => {
        console.error("Error listening to document:", error);
      }
    );
    return () => unsubscribe();
  }, [user, fetchUserTweets, setTwitterLoader]);

  useEffect(() => {
    const checkLoadingStatus = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.twitterLoading === true) {
            setTwitterLoader(true);
          } else {
            await fetchUserTweets();
            setTwitterLoader(false);
          }
        }
      } catch (error) {
        console.error("Error checking loading status:", error);
      }
    };

    checkLoadingStatus();
  }, [user, fetchUserTweets, setTwitterLoader]);

  useEffect(() => {
    if (twitterLoader) {
      setLoaderTwitter(twitterLoader);
    }
    fetchUserTweets();
    setLoaderTwitter(twitterLoader);
  }, [twitterLoader, fetchUserTweets]);

  const handleSelectAll = useCallback(() => {
    setSelectedAuthors((prev) =>
      Object.fromEntries(Object.keys(prev).map((author) => [author, true]))
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedAuthors((prev) =>
      Object.fromEntries(Object.keys(prev).map((author) => [author, false]))
    );
  }, []);

  const handleAuthorDropdownToggle = useCallback(() => {
    setShowAuthorDropdown((prev) => !prev);
  }, []);

  // Update toggleAuthor function in TwitterComponent
const toggleAuthor = useCallback((newSelectedAuthors) => {
  setSelectedAuthors(newSelectedAuthors);
    setFilterLoading(false);
}, []);

  const handleOpen = useCallback((value) => setSize(value), []);

  const handleRelevanceChange = useCallback((newRelevance) => {
    setFilterLoading(true);
    setSelectedRelevance(newRelevance);
      setFilterLoading(false);
  }, []);

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const getRelevancyColor = useCallback((relevancy) => {
    switch (relevancy.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  }, []);

  const handleFeedCreated = useCallback(() => {
    fetchUserTweets();
  }, [fetchUserTweets]);

  const handleImageError = useCallback((e) => {
    e.target.src = "/images/fallback.png";
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  const handleReset = useCallback(async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        twitterLoading: false,
      });
    } catch (error) {
      console.error("Error resetting loader:", error);
    }
  }, [user]);

  if (loading || filterLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90%]">
        <l-line-spinner size="40" stroke="3" speed="1" color="black" />
      </div>
    );
  }

  if (loaderTwitter) {
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
            <l-cardio size="80" stroke="4" speed="2" color="black" />
          </div>
          <div>We are generating your feed!</div>
        </div>
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
                  setLoading={setFilterLoading}
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
                  <div className="absolute left-32 top-10">
                    <AuthorSelectionDropdown
                      authors={authors}
                      selectedAuthors={selectedAuthors}
                      onToggleAuthor={toggleAuthor}
                      onClose={() => setShowAuthorDropdown(false)}
                      onSelectAll={handleSelectAll}
                      onClearAll={handleClearAll}
                      setLoading={setFilterLoading}
                      onSubmit={() => {
                        setSelectedAuthors((prev) => ({ ...prev }));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <MasonryLayout
              filteredTweets={filteredTweets}
              getRelevancyColor={getRelevancyColor}
              handleImageLoad={handleImageLoad}
              handleImageError={handleImageError}
            />
            {hasMoreTweets && (
              <div className="flex justify-center my-8">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Show More
                </button>
              </div>
            )}
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
