"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db, auth } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const RedditComponent = () => {
  const [redditData, setRedditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLatestRedditData = async () => {
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
          console.log("Analysis data:", analysisData);

          setRedditData(analysisData);
        } else {
          console.log("No documents found in user_reddits");
          setRedditData([]);
        }
      } catch (err) {
        console.error("Error fetching Reddit data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLatestRedditData();
    }
  }, [user]);

  if (loading) {
    return <div className="font-kumbh-sans-medium flex flex-col items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="font-kumbh-sans-medium flex flex-col items-center justify-center p-8">Error: {error}</div>;
  }

  if (!redditData || redditData.length === 0) {
    return (
      <div className="font-kumbh-sans-medium flex flex-col items-center justify-center p-8">
        <Image src="/images/reddit.png" alt="Reddit Feed" width={457} height={270} />
        <div className="text-center mb-8 mt-8">
          <h1 className="font-kumbh-sans-Bold text-3xl font-bold mb-4">Create your Reddit TopFeed</h1>
          <div className="max-w-lg mx-auto">
            <p className="font-kumbh-sans-medium text-gray-600 mb-8">
              No Reddit data available. Click the button below to create a new feed.
            </p>
          </div>
          <button className="bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
            + Create New Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-kumbh-sans-Medium p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redditData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            {item.heading && <h2 className="font-kumbh-sans-bold text-xl font-bold mb-4">{item.heading}</h2>}
            
            {item.sub_headings && item.sub_headings.map((subHeading, subIndex) => (
              <div key={subIndex} className="mb-4">
                <h3 className="font-kumbh-sans-semibold text-lg font-semibold mb-2" style={{ color: "#146EF5" }}>
                  {formatTitle(subHeading.title)}
                </h3>
                <ul className="list-disc pl-5">
                  {subHeading.points && subHeading.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="font-kumbh-sans-medium text-sm text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            ))}

            {item.title && (
              <div className="mb-4">
                <h3 className="font-kumbh-sans-semibold text-lg font-semibold mb-2" style={{ color: "#146EF5" }}>
                  {formatTitle(item.title)}
                </h3>
                <ul className="list-disc pl-5">
                  {item.points && item.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="font-kumbh-sans-medium text-sm text-gray-600">{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const formatTitle = (title) => {
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default RedditComponent;
