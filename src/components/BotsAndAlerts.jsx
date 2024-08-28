"use client";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import TelegramLoginButton from './TelegramLoginButton';
import { Switch } from '@headlessui/react' ;
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import ServiceBlock from './ServiceBlock';
import { storeNotificationData } from "@/utils/Notifications ";
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
  //const [emailConnected, setEmailConnected] = useState(false)
  //const [emailAccount, setEmailAccount] = useState("")
  
  const handleTelegramAuth = (user) => {
    if (user) {
      setTelegramConnected(true)
      setTelegramAccount(`@${user.username}`);
      setNotificationData(prevState => ({
        ...prevState,
        istelegram: true,
        telegramAccount: user.username,
        isActive: true,
      }));
      if (user) {
        storeNotificationData(user.uid, notificationData);
      console.log("Telegram connected:", user);
      }
    } else {
      console.error("Telegram login failed")
    }
  };

  const handleAddTelegramBot = () => {
    console.log("Telegram bot added for", telegramAccount)
  }

  const handleDisconnectTelegram = () => {
    setTelegramConnected(false);
    setTelegramAccount("");
    setNotificationData(prevState => ({
      ...prevState,
      istelegram: false,
      isActive: false,
    }));
    if (user) {
      storeNotificationData(user.uid, notificationData);
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
            onAddBot={handleAddTelegramBot}
            onDisconnect={handleDisconnectTelegram}
          />
        </div>
      </div>
    </div>
  )
}

export default BotsAndAlerts
