"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  return (
    <div className="w-full max-w-md p-8 bg-transparent">
      <div className="flex justify-center">
        <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9] relative whitespace-nowrap">
          Welcome{" "}
          <span className="text-white">to TopFeed</span>
        </h1>
      </div>

      <p className="text-sm text-center text-[#E6E6E6] mb-4 mt-5">
        Please enter your email ID to receive a login link. Click the link
        in your email to be signed in instantly.
      </p>

      <form className="mb-5">
        <label className="block text-white mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="example@topfeed.com"
          className="w-full p-2 mb-5 bg-white text-gray-900 rounded-md"
        />
        <button
          className="w-full p-2 bg-[#146EF5] text-bold text-white rounded-md"
          type="submit"
        >
          Send login link
        </button>
      </form>
      <div className="flex items-center mb-10 mt-10">
        <hr className="flex-grow border-gray-600" />
        <span className="text-sm text-[#B8B8B8] mx-4">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>
      <button
        className="w-full p-3 bg-[#2A2A2A] text-white rounded-md flex items-center justify-center"
        onClick={() => signIn("google")}
      >
        <div className="scale-125 mr-4">
          <FcGoogle />
        </div>
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginForm;
