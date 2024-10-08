import React from "react";
import SidePanel from '@/components/SidePanel';
import ManageSubscription from '@/pricingComponents/ManageSubscription';


const page = () => {
    return (
        <div className="flex">
            <div className="flex fixed h-full">
                <div className="relative hidden w-full z-10 md:flex justify-center items-center top-0 mx-auto">
                    <SidePanel />
                </div>
            </div>
            <div className="min-h-screen flex-grow bg-white md:ml-64 w-[calc(100%-16rem)]">
                <ManageSubscription />
            </div>
        </div>
    );
};

export default page;