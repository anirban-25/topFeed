"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingG, setLoadingG] = useState(false);

  const [error, setError] = useState("");
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const updateUserPlan = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.plan) {
          console.log("User already has a plan. No update needed.");
          return;
        }

        await setDoc(
          userDocRef,
          {
            plan: "free",
          }, 
          { merge: true }
        );
        console.log("User plan updated successfully to free");
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error updating user plan:", error);
    }
  };
  const handleSendSignInLink = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: `${window.location.origin}/handle-email-link`,
        handleCodeInApp: true,
      });
      setIsEmailSent(true);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      setError("Error sending sign-in link. Please try again.");
      console.error("Error sending sign-in link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingG(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await updateUserPlan(result.user.uid);
        router.push("/dashboard/reddit");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoadingG(false);
    }
  };

  return (
    <div className="w-full max-w-md md:p-8 bg-transparent">
      <div className="flex justify-center">
        <h1 className="text-xl md:text-5xl  font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9] relative whitespace-nowrap">
          Welcome <span className="text-white">to TopFeed</span>
        </h1>
      </div>

      <p className="text-xs md:text-sm text-center text-[#E6E6E6] mb-4 mt-5">
        Please enter your email ID to receive a login link. Click the link in
        your email to be signed in instantly.
      </p>

      {!isEmailSent ? (
        <form className="mb-5" onSubmit={handleSendSignInLink}>
          <label
            className="text-sm md:text-base block text-white mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@topfeed.com"
            className="w-full p-2 mb-5 bg-white text-gray-900 rounded-md"
            required
          />
          <button
            className="w-full p-2 bg-[#146EF5] text-bold text-white rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send login link"}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      ) : (
        <p className="text-center text-white">
          Please check your email for the sign-up link.
        </p>
      )}

      <div className="flex items-center mb-10 mt-10">
        <hr className="flex-grow border-gray-600" />
        <span className="text-sm text-[#B8B8B8] mx-4">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      <button
        className="w-full p-3 bg-[#2A2A2A] text-white rounded-md flex items-center justify-center"
        onClick={handleGoogleSignIn}
        disabled={loadingG}
      >
        <div className="scale-125 mr-4">
          <FcGoogle />
        </div>
        {loadingG ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
};

export default LoginForm;
