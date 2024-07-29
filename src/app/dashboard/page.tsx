"use client";
import React from "react";
import SidePanel from '@/components/SidePanel';
import RedditComponent from '@/components/RedditComponent';
import DashboardHeader from '@/components/DashboardHeader';

const DashboardPage = () => {
    return (
        <div className="flex">
            <div className="flex h-full">
                <div className="relative w-full z-2 flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="flex-grow bg-white">
                <DashboardHeader />
                <RedditComponent />
            </div>
        </div>
    );
};

export default DashboardPage;
