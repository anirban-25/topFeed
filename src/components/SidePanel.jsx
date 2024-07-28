import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaRedditAlien } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { HiOutlineSupport } from "react-icons/hi";

const SidePanel = () => {
    return (
        <div className="h-screen w-64 flex bg-[#0B0B0B] flex-col relative">
            <Image
                src="/images/bg-pattern.svg"
                height={100}
                width={1200}
                alt="bg"
                className="overflow-hidden w-96 absolute top-0"
            />
            <Image
                src="/images/ellipse-1.svg"
                height={100}
                width={600}
                alt="bg"
                className="mx-auto absolute left-0 -top-10"
            />
            <Image
                src="/images/ellipse-2.svg"
                height={100}
                width={500}
                alt="bg"
                className="mx-auto absolute left-0 top-0 blur-md"
            />
            <Image
                src="/images/circle.png"
                height={100}
                width={800}
                alt="bg"
                className="mx-auto absolute left-36 top-0"
            />
            
            <div className="my-4 mt-6 items-left ml-6">
                <Image src="/images/logo.svg" height={120} width={120} alt="logo" />
            </div>
            <div className="flex flex-col space-y-4 mt-8 items-left ml-5 z-10"> 
                <Link href="/dashboard/reddit">
                    <div className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full cursor-pointer">
                        <FaRedditAlien className='mr-5 scale-125' /> Reddit
                    </div>
                </Link>
                <Link href="/dashboard/twitter">
                    <div className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                        <div ><FaXTwitter className='mr-5 scale-125'/></div>Twitter
                    </div>
                    
                </Link>
                
                <Link href="/dashboard/notifications" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <div ><IoNotifications className='mr-5 scale-125'/></div>Notifications
                </Link>
                <Link href="/dashboard/support" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <div ><HiOutlineSupport className='mr-5 scale-125'/></div>Support
                </Link>
            </div>
            <div className="mt-auto mb-4 items-center">
                <Link href="/pricing" className="text-white flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full">
                    <span>My Current Plan</span>
                    <span className="text-gray-400">FREE</span>
                </Link>
                <button className="text-white mt-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md w-full items-center">
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
};

export default SidePanel;
