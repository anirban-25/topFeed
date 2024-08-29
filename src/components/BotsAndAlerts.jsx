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
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [redditConnected, setRedditConnected] = useState(false);
  const [notificationData, setNotificationData] = useState({
    istelegram: false,
    telegramAccount: "",
    isActive: false,
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
          setTwitterConnected(data.twitter);
          setRedditConnected(data.reddit);
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
        isActive: true,
        twitter: notificationData.twitter,
        reddit: notificationData.reddit,
      };

      setTelegramConnected(true);
      setTelegramAccount(`@${authUser.username}`);
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
      isActive: false,
    };

    setTelegramConnected(false);
    setTelegramAccount("");
    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
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
            twitterConnected={twitterConnected}
            redditConnected={redditConnected}
            setTwitterConnected={setTwitterConnected}
            setRedditConnected={setRedditConnected}
          />
        </div>
      </div>
    </div>
  );
};

export default BotsAndAlerts;
