"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LiaHamburgerSolid } from "react-icons/lia";
import { RxCrossCircled } from "react-icons/rx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase";
const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the Firebase user when logged in
      }
    });

    return () => unsubscribe();
  }, [auth, router]);
  const [visibleIndex, setVisibleIndex] = useState(false);
  const toggleVisibility = () => {
    setVisibleIndex(!visibleIndex);
  };
  const pathname = usePathname();

  return (
    <div className=" w-full  items-center py-3 md:py-7 text-white">
      {visibleIndex && (
        <div className="transition-transform duration-300 ease-in-out transform text-black absolute z-10 min-w-1/2 w-1/2 left-0 top-0 h-full bg-gray-400 bg-opacity-90 border-r-white border-r">
          <div className="p-6">
            <div className=" flex justify-end">
              <RxCrossCircled
                onClick={() => setVisibleIndex(!visibleIndex)}
                size={25}
              />
            </div>
            <div className="mt-5">
              <a href="/">
                <div className="p-2  cursor-pointer bg-gray-400 mt-5 text-center rounded-lg font-bold text-sm shadow-md">
                  HOME
                </div>
              </a>
              <a href="/">
                <div className="p-2 cursor-pointer bg-gray-400 mt-5 text-center rounded-lg font-bold text-sm shadow-md">
                  MY FEED
                </div>
              </a>
              <a href="/">
                <div className="p-2 cursor-pointer bg-gray-400 mt-5 text-center rounded-lg font-bold text-sm shadow-md">
                  PRICING
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
      <div className=" w-full flex items-center justify-between">
        <div className="md:hidden">
          <Link href="/">
            <div className=" bg-[#2A2A2A] text-xs md:text-sm p-1 md:p-2 ring-1 hover:bg-[#1d1d1d] hover:scale-105 transition-all duration-200  cursor-pointer ring-[#3D3D3D] px-3 md:px-4 rounded-md">
              Home
            </div>
          </Link>
        </div>
        <Link href="/">
          <div className="flex items-center space-x-3 font-gilroy-bold text-lg">
            <Image src="/images/logo.png" height={120} width={120} alt="logo" />
          </div>
        </Link>
        <div className=" items-center cursor-pointer  space-x-5 md:space-x-20 font-semibold text-sm hidden md:flex">
          <Link href="/">
            <div
              className={` cursor-pointer ${
                pathname == "/" ? "text-white" : "text-[#8D8D8D]"
              }`}
            >
              HOME
            </div>
          </Link>

          <Link href="/pricing">
            <div
              className={` cursor-pointer ${
                pathname == "/pricing" ? "text-white" : "text-[#8D8D8D]"
              }`}
            >
              PRICING
            </div>
          </Link>
        </div>
        <div>
          {!user ? (
            <Link href="/login">
              <div className=" bg-[#2A2A2A] text-xs md:text-sm p-1 md:p-2 ring-1 hover:bg-[#1d1d1d] hover:scale-105 transition-all duration-200  cursor-pointer ring-[#3D3D3D] px-3 md:px-4 rounded-md">
                Login
              </div>
            </Link>
          ) : (
            <Link href="/dashboard/reddit">
              <div className=" bg-[#2A2A2A] text-xs md:text-sm p-1 md:p-2 ring-1 hover:bg-[#1d1d1d] hover:scale-105 transition-all duration-200  cursor-pointer ring-[#3D3D3D] px-3 md:px-4 rounded-md">
                Dashboard
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
