import { useState, useEffect, createElement } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Switch,
} from "@material-tailwind/react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaXTwitter, FaRedditAlien } from "react-icons/fa6";
import Image from "next/image";

const SocialMediaDialog = ({ size, handleOpen, handleDisconnect }) => {
  const [selectedNotificationLevels, setSelectedNotificationLevels] = useState(
    []
  );

  const [redditNotifications, setRedditNotifications] = useState(false);
  const [redditAccounts, setRedditAccounts] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchNotificationLevels = async () => {
      if (user) {
        const notificationsRef = doc(db, "notifications", user.uid);
        const notificationsSnap = await getDoc(notificationsRef);

        if (notificationsSnap.exists()) {
          const levels = notificationsSnap.data().notificationLevels || [];
          setSelectedNotificationLevels(levels);
        }
      }
    };
    const fetchData = async () => {
      if (user) {
        const notificationsRef = doc(db, "notifications", user.uid);
        const notificationsSnap = await getDoc(notificationsRef);

        if (notificationsSnap.exists()) {
          const data = notificationsSnap.data();
          setSelectedNotificationLevels(data.notificationLevels || []);
          setRedditNotifications(data.redditNotifications || false);
        }

        const latestAnalysisRef = doc(
          db,
          "users",
          user.uid,
          "user_reddits",
          "latest_analysis"
        );
        const latestAnalysisSnap = await getDoc(latestAnalysisRef);

        if (latestAnalysisSnap.exists()) {
          const data = latestAnalysisSnap.data();
          if (data.subreddits) {
            const subreddits = data.subreddits.map((subreddit) => ({
              name: subreddit,
              url: `https://www.reddit.com/r/${subreddit}`,
              profileImageUrl: `https://unavatar.io/reddit/${subreddit}`,
            }));
            setRedditAccounts(subreddits);
          }
        }
      }
    };

    fetchData();
    fetchNotificationLevels();
  }, [user]);

  const handleConfirm = async () => {
    if (user) {
      try {
        const notificationsRef = doc(db, "notifications", user.uid);

        await updateDoc(notificationsRef, {
          notificationLevels: selectedNotificationLevels,
          redditNotifications: redditNotifications,
        });

        console.log("Notification settings updated successfully");
      } catch (error) {
        console.error("Error updating notification settings:", error);
      }
    }
    handleOpen(null); // Close the dialog
  };

  const handleNotificationLevelChange = (level) => {
    setSelectedNotificationLevels((prevLevels) => {
      if (prevLevels.includes(level)) {
        return prevLevels.filter((l) => l !== level);
      } else {
        return [...prevLevels, level];
      }
    });
  };
  const handleRedditNotificationChange = () => {
    setRedditNotifications(!redditNotifications);
  };
  const data = [
    {
      label: "Twitter",
      value: "twitter",
      icon: FaXTwitter,
      content: (
        <div>
          <h3 className="text-lg font-kumbh-sans-regular mb-4  text-black">
            Select Notification Levels:
          </h3>
          <div className="space-y-4">
            {["high", "medium", "low"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={level}
                  name="notificationLevels"
                  value={level}
                  checked={selectedNotificationLevels.includes(level)}
                  onChange={() => handleNotificationLevelChange(level)}
                  className="form-checkbox"
                />
                <label
                  htmlFor={level}
                  className="capitalize font-kumbh-sans-bold text-black"
                >
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Reddit",
      value: "reddit",
      icon: FaRedditAlien,
      content: (
        <div>
          <div className="flex justify-between ">
            <h3 className="text-lg font-kumbh-sans-regular text-black mb-3">
              Subreddits:
            </h3>

            <div className="flex items-center justify-between mb-4 space-x-4">
              <h3 className="text-sm font-kumbh-sans-medium text-black">
                Reddit Notifications: 
              </h3>
              <Switch
                checked={redditNotifications}
                onChange={handleRedditNotificationChange}
                color="blue"
              />
            </div>
          </div>
          <ul className="space-y-2">
            {redditAccounts.map((subreddit, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Image
                  src={subreddit.profileImageUrl}
                  alt={`${subreddit.name} profile`}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <a
                  href={subreddit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-kumbh-sans-medium"
                >
                  r/{subreddit.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ), // Placeholder for the Reddit content
    },
  ];

  return (
    <Dialog
      open={["xs", "sm", "md", "lg", "xl", "xxl"].includes(size)}
      size={size || "md"}
      handler={handleOpen}
      className="max-h-[80%] overflow-scroll"
    >
      <DialogHeader className="font-kumbh-sans-bold flex justify-between">
        <div>Notification Settings</div>
        <div
          className="text-sm font-kumbh-sans-light p-2 hover:bg-red-100/40  drop-shadow-2xl duration-200 cursor-pointer text-red-500 rounded-lg"
          onClick={() => handleDisconnect()}
        >
          Disconnect Telegram
        </div>
      </DialogHeader>
      <DialogBody>
        <Tabs defaultValue="twitter" value="twitter" className="w-full">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-gray-900/20 shadow-none !text-gray-900",
            }}
          >
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div className="flex items-center gap-2 py-1 font-kumbh-sans-bold">
                  {createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, content }) => (
              <TabPanel key={value} value={value} className="py-4">
                {content}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => handleOpen(null)}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button onClick={handleConfirm} variant="text" color="blue">
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SocialMediaDialog;
