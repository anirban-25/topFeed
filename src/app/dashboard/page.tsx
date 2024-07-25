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
                <Image
                src="/images/bg-pattern.svg"
                height={100}
                width={1200}
                alt="bg"
                className="mx-auto absolute top-0"
                />
                <Image
                src="/images/ellipse-1.svg"
                height={100}
                width={600}
                alt="bg"
                className="mx-auto absolute left-0 -top-10 "
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
                className="mx-auto absolute left-36 top-0 "
                />
            

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