"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import ServiceBlock from './ServiceBlock';
import { storeNotificationData } from "@/utils/storeNotification";

const BotsAndAlerts = () => {
  const [user] = useAuthState(auth);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramAccount, setTelegramAccount] = useState("");
  const [telegramid, setTelegramid] = useState("");
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [redditConnected, setRedditConnected] = useState(false);
  const [isActive, setIsActive] = useState(true); // Switch state is on by default
  const [notificationData, setNotificationData] = useState({
    istelegram: false,
    telegramAccount: "",
    telegramUserId:"",
    isActive: true, 
    twitter: false,
    reddit: false,
  });

  useEffect(() => {
    if (user) {
      // Fetch stored notification data from Firebase
      const notificationDocRef = doc(db, 'notifications', user.uid);
      getDoc(notificationDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTelegramConnected(data.istelegram);
          setTelegramAccount(data.telegramAccount ? `@${data.telegramAccount}` : "");
          setTelegramid(data.telegramUserId);
          setTwitterConnected(data.twitter);
          setRedditConnected(data.reddit);
          setIsActive(data.isActive);
          setNotificationData(data);
        }
      }).catch(error => {
        console.error("Error fetching notification data:", error);
      });
    }
  }, [user]);

  const handleTelegramAuth = (authUser) => {
    if (authUser) {
      const updatedNotificationData = {
        istelegram: true,
        telegramAccount: authUser.username,
        telegramUserId: authUser.id,
        isActive: true, 
        twitter: notificationData.twitter,
        reddit: notificationData.reddit,
      };

      setTelegramConnected(true);
      setTelegramAccount(`@${authUser.username}`);
      setTelegramid(authUser.id);
      setIsActive(true);
      setNotificationData(updatedNotificationData);

      // Store the notification data immediately after login
      if (user) {
        storeNotificationData(user.uid, updatedNotificationData);
        console.log("Telegram connected:", authUser);
      }
    } else {
      console.error("Telegram login failed");
    }
  };

  const handleDisconnectTelegram = () => {
    const updatedNotificationData = {
      ...notificationData,
      istelegram: false,
      telegramAccount: "",
      telegramid: "",

      isActive: false,
    };

    setTelegramConnected(false);
    setTelegramAccount("");
    telegramid(""),
    setIsActive(false);
    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
    }
  };

  const handleToggleSwitch = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);

    const updatedNotificationData = {
      ...notificationData,
      isActive: newIsActive,
    };

    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
    }
  };
  const handleToggleTwitter = () => {
    const newTwitterConnected = !twitterConnected;
    setTwitterConnected(newTwitterConnected);
    setNotificationData(prevState => ({
      ...prevState,
      twitter: newTwitterConnected,  // Update state
    }));
    if (user) {
      storeNotificationData(user.uid, {
        ...notificationData,
        twitter: newTwitterConnected,  // Store in Firestore
      });
    }
  };

  // Handle Reddit Toggle
  const handleToggleReddit = () => {
    const newRedditConnected = !redditConnected;
    setRedditConnected(newRedditConnected);
    setNotificationData(prevState => ({
      ...prevState,
      reddit: newRedditConnected,  // Update state
    }));
    if (user) {
      storeNotificationData(user.uid, {
        ...notificationData,
        reddit: newRedditConnected,  // Store in Firestore
      });
    }
  };

  return (
    <div className="py-4"> 
      <div className="container px-6 space-y-4">
        <div className="flex flex-col items-center">
          <ServiceBlock
            icon={<img src="/images/telegram.svg" alt="Telegram" className="h-10 w-10" />}
            title="Telegram"
            connected={telegramConnected}
            accountName={telegramAccount}
            onConnect={handleTelegramAuth}
            onDisconnect={handleDisconnectTelegram}
            isActive={isActive}
            onToggleSwitch={handleToggleSwitch}
            handleToggleTwitter={handleToggleTwitter}
            handleToggleReddit={handleToggleReddit}
          />
        </div>
      </div>
    </div>
  );
};

export default BotsAndAlerts;
