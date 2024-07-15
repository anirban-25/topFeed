"use client";
import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("")
  return (
    <div>
      <div className="text-xl  font-gilroy-bold mb-4 text-white">
        Sign in with Email
      </div>
      <div className="mb-4 ">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className=" outline-none bg-[#202123] border border-gray-500 rounded-xl px-3 py-2 w-full text-gray-200"
        />
      </div>
      <div className="mb-4 ">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className=" outline-none bg-[#202123] border border-gray-500 rounded-xl px-3 py-2 w-full text-gray-200"
        />
      </div>
      <button
        onClick={()=>{}}
        className="bg-orange-500 hover:bg-orange-600 transition text-white font-bold py-2 px-4 rounded shadow-md"
      >
        Submit
      </button>
    </div>
  );
};

export default SignIn;
