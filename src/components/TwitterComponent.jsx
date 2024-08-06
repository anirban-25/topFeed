import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Script from 'next/script';

const TwitterComponent = () => {
  const [user] = useAuthState(auth);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching user tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTweets();
  }, [user]);

  useEffect(() => {
    // This effect will run after tweets are loaded and component is mounted
    if (tweets.length > 0 && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [tweets]);

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
      <div className="font-KumbhSans-Medium flex flex-col items-center justify-center min-h-screen p-8">
        <Image
          src="/images/twitter.png"
          alt="Reddit Feed"
          width={457}
          height={270}
        />
        <div className="text-center mb-8 mt-8">
          <h1 className="font-KumbhSans-Bold text-3xl font-bold mb-4">
            Create your Twitter TopFeed
          </h1>
          <div className="max-w-lg mx-auto">
            <p className="font-KumbhSans-Regular text-gray-600 mb-8">
              Lorem ipsum dolor sit amet consectetur. Cras est ornare rhoncus
              massa nunc ornare purus aliquet massa.
            </p>
          </div>
          <button className="font-KumbhSans-Medium bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
            + Create New Feed
          </button>
          {tweets.length > 0 ? (
            <div className="w-full  mx-auto"> {/* Increased max-width for larger screens */}
              <h2 className="font-KumbhSans-Bold text-2xl font-bold mb-4 text-center">
                Your Tweets
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tweets.map((tweet) => (
                  <div
                    key={tweet.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div
                      className="tweet-content"
                      dangerouslySetInnerHTML={{ __html: tweet.content_html }}
                    />
                    <p className="font-KumbhSans-Regular text-gray-500 mt-2">
                      Relevancy: {tweet.relevancy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-600">No tweets found for your account.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default TwitterComponent;