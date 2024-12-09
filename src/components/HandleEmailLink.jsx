"use client";
import { useEffect, useState } from "react";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

const HandleEmailLink = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEmailLink = async () => {
      const auth = getAuth();
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Please provide your email for confirmation.");
        }
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");

            if (result.user) {
              // Update user's plan in Firestore
              const userDocRef = doc(db, "users", result.user.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                const userData = userDoc.data();
                if (!userData.plan) {
                  await setDoc(
                    userDocRef,
                    { plan: "free" },
                    { merge: true }
                  );
                  console.log("User plan updated successfully to free.");
                } else {
                  console.log("User already has a plan. No update needed.");
                }
              } else {
                // Create a new user document if it doesn't exist
                await setDoc(userDocRef, { plan: "free" });
                console.log("New user document created with free plan.");
              }
            }

            // Redirect to dashboard
            router.push("/dashboard/reddit");
          } catch (error) {
            console.error("Error signing in with email link:", error);
            setError("Failed to sign in. Please try again.");
          }
        }
      } else {
        setError("Invalid or expired sign-in link. Please request a new one.");
      }
    };

    handleEmailLink();
  }, [router]);

  return (
    <div className="text-center mt-4">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Processing your sign-in...</p>
      )}
    </div>
  );
};

export default HandleEmailLink;
