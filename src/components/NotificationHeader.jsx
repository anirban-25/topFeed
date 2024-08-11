//noti header
import React from 'react';
import { RxAvatar } from "react-icons/rx";
import UserMenu from "../components/UserMenu";

const TwitterHeader = () => {
  return (
    <header className="font-KumbhSans-Medium flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="font-KumbhSans-Bold text-xl text-[#8D8D8D] font-semibold ml-2">My Notifications</h1>
      <div className="flex items-center">
        <div >
        <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TwitterHeader;
