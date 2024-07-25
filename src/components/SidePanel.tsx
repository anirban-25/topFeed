import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRedditAlien } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { HiOutlineSupport } from "react-icons/hi";

const SidePanel = () => {
    return (
        <div className="h-screen w-64 flex flex-col ">
            <div className="my-4 mt-6 items-left ml-6">
                <Image src="/images/logo.svg" height={120} width={120} alt="logo" />
            </div>
            <nav className="flex flex-col space-y-4 mt-8 items-left ml-5">
                <Link href="/reddit" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <div ><FaRedditAlien className='mr-5 scale-125'/></div> Reddit
                </Link>
                <Link href="/twitter" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <div ><FaXTwitter className='mr-5 scale-125'/></div>Twitter
                </Link>
                <Link href="/notifications" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <div ><IoNotifications className='mr-5 scale-125'/></div>Notifications
                </Link>
                
                <Link href="/support" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <div ><HiOutlineSupport className='mr-5 scale-125'/></div>Support
                </Link>
                
            </nav>
            <div className="mt-auto mb-4 items-center">
                <Link href="/pricing" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <span>My Current Plan</span>
                    <span className="text-gray-400">FREE</span>
                </Link>
                <button className="text-white mt-2  bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md w-full items-center">
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
};

export default SidePanel;
