"use client";
import { useEffect } from "react";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";

const HandleEmailLink = () => {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const handleEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          let email = window.localStorage.getItem("emailForSignIn");
          if (!email) {
            email = window.prompt("Please provide your email for confirmation.");
          }
          if (email) {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            router.push("/dashboard/reddit"); 
          }
        } catch (error) {
          console.error("Error signing in with email link:", error);
        }
      }
    };

    handleEmailLink();
  }, [auth, router]);

  return null;
};

export default HandleEmailLink;
