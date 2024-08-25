"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FormTemplates from "@/components/FormTemplates";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const Page = () => {
  
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
      // setLoading(false);
      console.log("Auth state changed:", user);

      if (user && pathname === '/') {
        console.log("Redirecting to dashboard");
        router.push('/dashboard/reddit');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router, pathname]);

  return (
    <div>
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
          className="mx-auto absolute w-[234px] md:w-[800px] top-10 left-20 md:left-36 md:top-0 "
        />
        
      </div>
      <div className="px-5 md:px-20">
        <div className="w-full flex justify-center items-center">
          <Navbar />
        </div>
        <div className=" w-full  justify-center items-center">
          <HeroSection />
        </div>
        <div className="mt-20 block">
          {/* <FormTemplates /> */}
          <FeaturesSection />
        </div>
      </div>
      <div className=" w-full border-gradient-2 mt-44" />
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
