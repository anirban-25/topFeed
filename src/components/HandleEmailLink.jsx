"use client";
import { useEffect, useState } from "react";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const HandleEmailLink = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Please provide your email for confirmation.");
        }
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            const user = auth.currentUser;if (user) {
              // Update user's plan in Firestore
              const updateUserPlan = async (userId) => {
                try {
                  const userDocRef = doc(db, "users", userId);
                  const userDoc = await getDoc(userDocRef);

                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (!userData.plan) {
                      await setDoc(userDocRef, { plan: "free" }, { merge: true });
                      console.log("User plan updated successfully to free");
                    } else {
                      console.log("User already has a plan. No update needed.");
                    }
                  } else {
                    await setDoc(userDocRef, { plan: "free" });
                    console.log("New user document created with free plan");
                  }
                } catch (err) {
                  console.error("Error updating user plan:", err);
                }
              };

              await updateUserPlan(user.uid);
            }

            router.push("/dashboard/reddit");
          } catch (error) {
            console.error("Error signing in with email link:", error);
            setError("Failed to sign in. Please try again or contact support.");
          }
        }
      } else {
        setError("Invalid sign-in link. Please request a new one.");
      }
    };

    handleEmailLink();
  }, [router]);


  return <div className="text-center mt-4">Processing your sign-in...</div>;
};

export default HandleEmailLink;