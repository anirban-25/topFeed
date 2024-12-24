"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import ServiceBlock from './ServiceBlock';
import { storeNotificationData } from "@/utils/storeNotification";
import { useRouter } from 'next/navigation';

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
  const [isActiveSlack, setIsActiveSlack] = useState(true); 
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [notificationData, setNotificationData] = useState({
    istelegram: false,
    telegramAccount: "",
    telegramUserId: "",
    
    isActive: true, 
    isActiveSlack: true,
    twitter: false,
    reddit: false,
    isslack: false,
    slackAccount: "",
    slackUserId: "",
  });
  const router = useRouter();
  useEffect(() => {
    if(user){
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        handleSlackAuth(code); // Exchange the code for a token
      }
    }
  }, [router.query, user]);


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
          setSlackAccount(data.slackAccount ? `@${data.slackAccount}` : "");
          setSlackUserId(data.slackUserId);
          setChannels(data.channels || []);
          setSelectedChannels(data.selectedChannels || []);
          setTwitterConnected(data.twitter);
          setRedditConnected(data.reddit);
          setIsActive(data.isActive);
          setIsActiveSlack(data.isActiveSlack);
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
    setTelegramid([]);
    setIsActive(false);
    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
    }
  };

  const handleSlackConnect = () => {
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=7916518040914.7902056902599&scope=channels:read,chat:write,chat:write.public,groups:read,im:read,mpim:read&redirect_uri=https://topfeed.ai/dashboard/notifications`;
    window.location.href = slackAuthUrl; 
  };
  
  const handleSlackAuth = async (code) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const response = await fetch("/api/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, uuid: user.uid }),
      });
      const data = await response.json();
      console.log(data);
      
      if (data.message === "Slack user connected, channels retrieved and data stored successfully") {
        const { team, authed_user,channels } = data;
        const slackData = {
          isslack: true,
          slackAccount: team?.name || "",  // Store the team name here
          slackUserId: authed_user?.id,
          channels,
        };
        setSlackConnected(true);
        setSlackAccount(team?.name || "");  // Display team name
        setSlackUserId(authed_user?.id);
        setChannels(channels);
        storeNotificationData(user.uid, slackData);
        // router.push("/dashboard/notifications");
      }
    } catch (error) {
      console.error("Slack authorization failed:", error);
      
    }
  };
  // const handleChannelSelection = (channelId) => {
  //   const updatedSelectedChannels = selectedChannels.includes(channelId)
  //     ? selectedChannels.filter(id => id !== channelId)
  //     : [...selectedChannels, channelId];
  //   setSelectedChannels(updatedSelectedChannels);
  //   if (user) {
  //     storeNotificationData(user.uid, { selectedChannels: updatedSelectedChannels });
  //   }
  // };
  

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

  const handleToggleSwitchSlack = () => {
    const newIsActiveSlack = !isActiveSlack;
    setIsActiveSlack(newIsActiveSlack);

    const updatedNotificationData = {
      ...notificationData,
      isActiveSlack: newIsActiveSlack,
    };

    setNotificationData(updatedNotificationData);

    if (user) {
      storeNotificationData(user.uid, updatedNotificationData);
    }
  };
  //teleg
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
          />
          <ServiceBlock
            icon={<img src="/images/slack.svg" alt="Slack" className="h-10 w-10" />}
            title="Slack"
            connected={slackConnected}
            accountName={slackAccount}
            onConnect={handleSlackConnect} 
            onDisconnect={handleDisconnectSlack}
            isActive={isActiveSlack}
            onToggleSwitch={handleToggleSwitchSlack}
            handleToggleTwitter={handleToggleTwitter}
          />
        </div>
      </div>
    </div>
  );
};

export default BotsAndAlerts;
