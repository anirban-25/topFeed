import React from "react";
import SidePanel from '@/components/SidePanel';
import RedditComponent from '@/components/RedditComponent';
import NotificationHeader from '@/components/NotificationHeader';
import BotsAndAlerts from '@/components/BotsAndAlerts';

const page = () => {
    return (
        <div className="flex">
            <div className="flex fixed h-full">
                <div className="relative w-full z-10 flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="min h-screen flex-grow bg-[#F7F9FB] ml-64 w-[calc(100%-16rem)]">
                <NotificationHeader />
                <BotsAndAlerts />
                    
            </div>
        </div>
    );
};

export default page;
