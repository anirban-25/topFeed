import React from "react";
import SidePanel from '@/components/SidePanel';
import RedditComponent from '@/components/RedditComponent';
import DashboardHeader from '@/components/DashboardHeader';

const page = () => {
    return (
        <div className="flex">
            <div className="flex fixed h-full">
                <div className="relative w-full z-10 flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="flex-grow bg-white ml-64 w-[calc(100%-16rem)]">
                <DashboardHeader />
                <RedditComponent />
            </div>
        </div>
    );
};

export default page;
