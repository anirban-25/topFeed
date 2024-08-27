"use client";
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  
const [twitterLoader, setTwitterLoader] = useState(false)
  return (
    <AppContext.Provider
      value={{
        twitterLoader, setTwitterLoader
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
