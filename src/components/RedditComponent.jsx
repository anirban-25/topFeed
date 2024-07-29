import React from 'react';
import Image from 'next/image';


const RedditComponent = () => {
    return (
        <div className="font-KumbhSans-Medium flex flex-col items-center justify-center  p-8">
            <Image src="/images/reddit.png" alt="Reddit Feed" width={457} height={270} />
            <div className="text-center mb-8 mt-8">
                <h1 className="font-KumbhSans-Bold text-3xl font-bold mb-4">Create your Reddit TopFeed</h1>
                <div className="max-w-lg mx-auto">
                    <p className="font-KumbhSans-Medium text-gray-600 mb-8">Lorem ipsum dolor sit amet consectetur. Cras est ornare rhoncus massa nunc ornare purus aliquet massa.</p>
                </div>
                <button className="bg-[#146EF5] hover:bg-blue-900 text-white px-4 py-2 rounded-lg">+ Create New Feed</button>
            </div>
        </div>
    );
};

export default RedditComponent;
