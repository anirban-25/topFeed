"use client";
import React from "react";
import Image from "next/image";
import SidePanel from '@/components/SidePanel';
import RedditComponent from '@/components/RedditComponent';
const page = () => {
    return (
        <div className="flex">
        <div className="flex">
            <div className="relative w-full -z-10 flex justify-center items-center top-0 mx-auto">
                
            

                <SidePanel />

             </div>
        </div>     
           
       
        <div className="flex-grow bg-white">
        <RedditComponent />
    
        </div>
        </div>
    
    );
};
export default page;