"use client";
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  
const [twitterLoader, setTwitterLoader] = useState(false)
const [redditDataFetch, setRedditDataFetch] = useState(false)
const [feedSetting, setFeedSetting] = useState(false)
const [redditLoading, setRedditLoading] = useState(true)
  return (
    <AppContext.Provider
      value={{
        twitterLoader, setTwitterLoader,redditDataFetch, setRedditDataFetch, feedSetting, setFeedSetting, redditLoading, setRedditLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
