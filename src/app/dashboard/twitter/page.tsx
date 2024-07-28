"use client";
import React from "react";
import SidePanel from '@/components/SidePanel';
import TwitterComponent from '@/components/TwitterComponent';
import TwitterHeader from '@/components/TwitterHeader';
import withAuth from '@/hoc/withAuth';

const DashboardPage = () => {
    return (
        <div className="flex">
            <div className="flex h-full">
                <div className="relative w-full -z-10 flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="flex-grow bg-white">
                <TwitterHeader />
                <TwitterComponent />
            </div>
        </div>
    );
};

export default DashboardPage;
