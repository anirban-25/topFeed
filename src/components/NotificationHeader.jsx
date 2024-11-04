//noti header
"use client";
import React, { useState } from "react";
import { RxAvatar } from "react-icons/rx";
import UserMenu from "../components/UserMenu";
import { Drawer } from "@material-tailwind/react";
import Link from "next/link";

const TwitterHeader = () => {
  const [openSidePanel, setOpenSidePanel] = useState(false);
  const openDrawer = () => setOpenSidePanel(true);
  const closeDrawer = () => setOpenSidePanel(false);
  return (
    <header className="font-kumbh-sans-Medium flex justify-between items-center py-4 pr-2 bg-white shadow-md">
      <div>
        <h1 className="font-kumbh-sans-bold text-xl text-[#8D8D8D] font-semibold ">
          <button
            onClick={openDrawer}
            className="flex md:hidden  bg-[#4c448a] text-white py-2 text-base ring-2 ring-blue-200  font-kumbh-sans-regular px-4 rounded-r-full  "
          >
            Notification
          </button>
          <div className="hidden md:flex ml-2">My Notifications</div>
          <Drawer
            open={openSidePanel}
            onClose={closeDrawer}
            className=" bg-transparent w-[10rem]"
          >
          <div className="space-y-10  border-[#4c448a] border-l-[10px] ">
          <div className=" bg-transparent text-center py-8 rounded-r-full text-black font-kumbh-sans-medium "></div>
          <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/dashboard/reddit">Reddit</Link>
          </div>
          <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/dashboard/twitter">Twitter</Link>
          </div>
          <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white border-l-transparent border-4 border-white  font-kumbh-sans-regular ">
            <Link href="/dashboard/notifications">Notification</Link>
          </div>
          <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/dashboard/manage-subscription">Subscriptions</Link>
          </div>
          <div className=" bg-[#4c448a] text-center py-3 rounded-r-full text-white font-kumbh-sans-regular ">
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
          </Drawer>
        </h1>
      </div>
      <h1 className="flex md:hidden font-kumbh-sans-Bold text-xl text-[#8D8D8D] font-semibold ml-2">
        My Notifications
      </h1>

      <div className="flex items-center">
        <div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TwitterHeader;
