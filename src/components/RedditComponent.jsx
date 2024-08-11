"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const RedditComponent = () => {
    const [redditData, setRedditData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRedditData = async () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const userRedditsRef = collection(db, 'users', userId, 'user_reddits');
                const querySnapshot = await getDocs(userRedditsRef);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(data[0].analysis[0].analysis);
                setRedditData(data[0].analysis[0].analysis);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };

        fetchRedditData();
    }, []);

    if (loading) {
        return (
            <div className="font-kumbh-sans-Medium flex flex-col items-center justify-center p-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (redditData.length === 0) {
        return (
            <div className="font-kumbh-sans-Medium flex flex-col items-center justify-center p-8">
                <Image src="/images/reddit.png" alt="Reddit Feed" width={457} height={270} />
                <div className="text-center mb-8 mt-8">
                    <h1 className="font-kumbh-sans-Bold text-3xl font-bold mb-4">Create your Reddit TopFeed</h1>
                    <div className="max-w-lg mx-auto">
                        <p className="font-kumbh-sans-Medium text-gray-600 mb-8">Lorem ipsum dolor sit amet consectetur. Cras est ornare rhoncus massa nunc ornare purus aliquet massa.</p>
                    </div>
                    <button className="bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg">+ Create New Feed</button>
                </div>
            </div>
        );
    }

    return (
        <div className="font-kumbh-sans-Medium p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {redditData.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="font-kumbh-sans-Bold text-xl font-bold mb-4">{item.heading}</h2>
                        {item.sub_headings && item.sub_headings.map((subHeading, subIndex) => (
                            <div key={subIndex} className="mb-4">
                                <h3 className="font-kumbh-sans-SemiBold text-lg font-semibold mb-2">{subHeading.title}</h3>
                                <ul className="list-disc pl-5">
                                    {subHeading.points.map((point, pointIndex) => (
                                        <li key={pointIndex} className="font-kumbh-sans-Medium text-sm text-gray-600">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {item.points && (
                            <ul className="list-disc pl-5">
                                {item.points.map((point, pointIndex) => (
                                    <li key={pointIndex} className="font-kumbh-sans-Medium text-sm text-gray-600">{point}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RedditComponent;