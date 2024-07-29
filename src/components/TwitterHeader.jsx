import React from 'react';
import { RxAvatar } from "react-icons/rx";

const TwitterHeader = () => {
  return (
    <header className="font-KumbhSans-Medium flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="font-KumbhSans-Bold text-xl text-[#8D8D8D] font-semibold ml-2">My Twitter Feed</h1>
      <div className="flex items-center">
        <button className="flex items-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-900 mr-6">
          <span className="font-KumbhSans-Medium">+ Create New Feed</span>
        </button>
        <button className='mr-5'>
          <RxAvatar size={32}/>
        </button>
      </div>
    </header>
  );
};

export default TwitterHeader;
