"use client";
import React from "react";
import SidePanel from '@/components/SidePanel';
import RedditComponent from '@/components/RedditComponent';
import DashboardHeader from '@/components/DashboardHeader';

const DashboardPage = () => {
    return (
        <div className="flex relative w-full">
            <div className="flex fixed h-full left-0">
                <div className="relative z-2 flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="flex-grow bg-white h-screen ml-64 w-[calc(100%-16rem)]">
                <DashboardHeader />
                <RedditComponent />
            </div>
        </div>
    );
};

export default DashboardPage;
