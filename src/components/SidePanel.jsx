"use client";
import { React, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRedditAlien } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { HiOutlineSupport } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { IoPricetagsSharp } from "react-icons/io5";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, app } from "@/firebase";
import { useAppContext } from "@/contexts/AppContext";

const SidePanel = () => {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

  const { planChange, setPlanChange } = useAppContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Set the Firebase user when logged in

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPlan(userData.plan); // Set plan from Firestore, default to 'FREE' if not found
        } else {
          console.error("No user document found in Firestore");
        }
      } else {
        router.push("/login"); // Redirect to login if no user is found
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(
    () => async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPlan(userData.plan); // Set plan from Firestore, default to 'FREE' if not found
        } else {
          console.error("No user document found in Firestore");
        }
      }
    },
    [user, planChange]
  );

  const pathname = usePathname();
  return (
    <div className="h-screen w-64 flex bg-[#0B0B0B] flex-col ">
      <Image
        src="/images/bg-pattern.svg"
        height={100}
        width={1200}
        alt="bg"
        className="overflow-hidden w-96 absolute top-0"
      />
      <Image
        src="/images/ellipse-1.svg"
        height={100}
        width={600}
        alt="bg"
        className="mx-auto absolute left-0 -top-10"
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
        className="mx-auto absolute left-20 top-0"
      />

      <div className="my-4 mt-6 items-left ml-6">
        <Link href="/">
          <Image src="/images/logo.png" height={120} width={120} alt="logo" />
        </Link>
      </div>
      <div className="font-kumbh-sans-bold text-[#8D8D8D] flex flex-col space-y-4 mt-8 items-left ml-5 mr-5 z-10">
        <div className="group">
          <Link href="/dashboard/reddit">
            <div
              className={` flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full cursor-pointer group-hover:text-white  ${
                pathname == "/dashboard/reddit" ? "bg-gray-700 text-white" : ""
              }`}
            >
              <FaRedditAlien className="mr-5 scale-125 icon-outline" /> Reddit
            </div>
          </Link>
        </div>
        <div className="group">
          <Link href="/dashboard/twitter">
            <div
              className={` flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full cursor-pointer group-hover:text-white  ${
                pathname == "/dashboard/twitter" ? "bg-gray-700 text-white" : ""
              }`}
            >
              <div>
                <FaXTwitter className="mr-5 scale-125 " />
              </div>
              Twitter
            </div>
          </Link>
        </div>
        <div className="group">
          <Link
            href="/dashboard/notifications"
            className={` flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full cursor-pointer group-hover:text-white  ${
              pathname == "/dashboard/notifications"
                ? "bg-gray-700 text-white"
                : ""
            }`}
          >
            <div>
              <IoNotifications className="mr-5 scale-125 " />
            </div>
            Notifications
          </Link>
        </div>
        <div className="group">
          <Link
            href="/pricing"
            className={` flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 rounded-md w-full cursor-pointer group-hover:text-white  ${
              pathname == "/dashboard/support" ? "bg-gray-700 text-white" : ""
            }`}
          >
            <div>
              <IoPricetagsSharp className="mr-5 scale-125" />
            </div>
            Pricing
          </Link>
        </div>
      </div>
      <div className="font-kumbh-sans-medium mt-auto mb-9 items-center">
        <div className=" space-x-2 bg-[#2A2A2A] p-3 rounded-md w-3/2 ml-3 mr-3 ">
          <div className="font-kumbh-sans-medium flex items-center justify-between ml-3 mb-5">
            <span className="text-[#8D8D8D] text-sm whitespace-nowrap">
              Current Plan
            </span>
            <span className="font-kumbh-sans-semibold text-white uppercase whitespace-nowrap">
              {plan}
            </span>
          </div>

          {plan === "free" ? (
            <Link
              href="/pricing"
              className="flex items-center justify-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-900 transition-all duration-200 mr-6"
            >
              Upgrade Plan
            </Link>
          ) : (
            <Link
              href="/dashboard/manage-subscription"
              className="flex items-center justify-center px-4 py-2 bg-[#146EF5] text-white rounded-lg hover:bg-blue-900 transition-all duration-200 mr-6"
            >
              Manage Subscription
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
