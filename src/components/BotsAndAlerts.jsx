"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import ServiceBlock from './ServiceBlock';
import { storeNotificationData } from "@/utils/storeNotification";

const BotsAndAlerts = () => {
  const [user] = useAuthState(auth);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramAccount, setTelegramAccount] = useState("");
  const [telegramid, setTelegramid] = useState("");
  const [slackConnected, setSlackConnected] = useState(false);
  const [slackAccount, setSlackAccount] = useState("");
  const [slackUserId, setSlackUserId] = useState("");
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [redditConnected, setRedditConnected] = useState(false);
  const [isActive, setIsActive] = useState(true); 
  const [notificationData, setNotificationData] = useState({
    istelegram: false,
    telegramAccount: "",
    telegramUserId: "",
    isActive: true, 
    twitter: false,
    reddit: false,
    isslack: false,
    slackAccount: "",
    slackUserId: "",
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
          setSlackConnected(data.isslack);
          setSlackAccount(data.slackAccount);
          setSlackUserId(data.slackUserId);
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
      telegramUserId: "",
      isActive: false,
    };

    setTelegramConnected(false);
    setTelegramAccount("");
    setTelegramid("");
    setIsActive(false);
    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
    }
  };

  const handleSlackConnect = () => {
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=7916518040914.7902056902599&scope=channels:read,chat:write,chat:write.public,groups:read,im:read,mpim:read&redirect_uri=https://topfeed.ai/dashboard/notifications`;
    window.location.href = slackAuthUrl; // Redirect to Slack OAuth
  };

  const handleSlackAuth = (code) => {
    // Here you would typically make a request to your backend to exchange the code for tokens
    // Assuming you will handle this part later, for now, just log the code
    console.log("Slack auth code received:", code);
    
    // After getting the access token, store the Slack account details
    const updatedNotificationData = {
      ...notificationData,
      isslack: true,
      slackAccount: "User's Slack Account", // Replace this with actual account name
      slackUserId: "User's Slack User ID", // Replace this with actual user ID
    };
    setSlackConnected(true);
    setSlackAccount("User's Slack Account"); // Replace with actual value
    setSlackUserId("User's Slack User ID"); // Replace with actual value
    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
    }
  };

  const handleDisconnectSlack = () => {
    const updatedNotificationData = {
      ...notificationData,
      isslack: false,
      slackAccount: "",
      slackUserId: "",
    };

    setSlackConnected(false);
    setSlackAccount("");
    setSlackUserId("");
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
          <ServiceBlock
            icon={<img src="/images/slack.svg" alt="Slack" className="h-10 w-10" />}
            title="Slack"
            connected={slackConnected}
            accountName={slackAccount}
            onConnect={handleSlackConnect} 
            onDisconnect={handleDisconnectSlack}
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
