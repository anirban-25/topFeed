"use client";
import React from "react";
import SidePanel from '@/components/SidePanel';
import TwitterComponent from '@/components/TwitterComponent';
import TwitterHeader from '@/components/TwitterHeader';


const DashboardPage = () => {
    return (
        <div className="flex">
            <div className="flex fixed h-full">
                <div className="relative w-full z-10 flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="flex-grow bg-white ml-64 w-[calc(100%-16rem)]">
                <TwitterHeader />
                <TwitterComponent />
            </div>
        </div>
    );
};

export default DashboardPage;
